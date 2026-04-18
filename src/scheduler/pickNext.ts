// What to show next. FSRS says *when*; this module says *which due item now*.
// See DESIGN_v3 §6.3 – §6.6.
//
// Policy (in priority order):
//   1. Relearning items first (they must stabilise).
//   2. Overdue items, sorted by daysOverdue × examWeight desc.
//   3. Due-today items, sorted by examWeight desc.
//   4. New items, bounded by new-item budget.
//   5. Interleaving: refuse two consecutive items from the same rule once past
//      acquisition (rep ≥ 2 for the most recent item).
//
// Triage: when dueCount > 3 × dailyCapacity, we select top-N-by-priority and
// defer the rest by one day.

import type { Item, Rule } from "@/content/schema";
import type { MemoryState } from "@/db/types";
import type { Settings } from "@/db/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type CatalogIndex = {
  items: Item[];
  rules: Rule[];
  itemById: Map<string, Item>;
  ruleById: Map<string, Rule>;
};

export function buildCatalog(items: Item[], rules: Rule[]): CatalogIndex {
  return {
    items,
    rules,
    itemById: new Map(items.map((i) => [i.id, i])),
    ruleById: new Map(rules.map((r) => [r.id, r])),
  };
}

export type PickContext = {
  catalog: CatalogIndex;
  memory: Map<string, MemoryState>;
  settings: Settings;
  now: number;
  /** id of the item we just served — for the interleaving rule. */
  lastItemId?: string;
  /** ids served earlier in this session — used to avoid immediate repeats. */
  servedThisSession?: Set<string>;
};

/** Daily review capacity inferred from daily target minutes. Cards/min ≈ 3. */
export function dailyCapacity(settings: Settings): number {
  return Math.max(10, Math.round(settings.dailyTargetMinutes * 3));
}

export function newItemBudget(dueCount: number): number {
  if (dueCount > 40) return 0;
  if (dueCount > 20) return 3;
  return 10;
}

export type DueSummary = {
  overdue: string[];
  dueToday: string[];
  learning: string[];
  relearning: string[];
  newAvailable: string[];
  totalDue: number;
};

/** Partition the catalog into buckets for scheduling. */
export function summarise(ctx: PickContext): DueSummary {
  const { catalog, memory, now } = ctx;
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const endToday = endOfToday.getTime();

  const overdue: string[] = [];
  const dueToday: string[] = [];
  const learning: string[] = [];
  const relearning: string[] = [];
  const newAvailable: string[] = [];

  for (const item of catalog.items) {
    const m = memory.get(item.id);
    if (!m) {
      newAvailable.push(item.id);
      continue;
    }
    if (m.state === "relearning") relearning.push(item.id);
    else if (m.state === "learning") learning.push(item.id);
    else if (m.due <= now) overdue.push(item.id);
    else if (m.due <= endToday) dueToday.push(item.id);
  }

  return {
    overdue,
    dueToday,
    learning,
    relearning,
    newAvailable,
    totalDue: overdue.length + dueToday.length + learning.length + relearning.length,
  };
}

/** Triage trigger: when due > 3× daily capacity, take top N by priority. */
export function triage(
  summary: DueSummary,
  ctx: PickContext,
): { triaged: boolean; keep: Set<string>; defer: string[] } {
  const cap = dailyCapacity(ctx.settings);
  const due = summary.totalDue;
  if (due <= cap * 3) {
    return { triaged: false, keep: new Set(), defer: [] };
  }
  const ranked = rankOverdue(
    [...summary.overdue, ...summary.dueToday],
    ctx,
  );
  const top = ranked.slice(0, cap);
  const defer = ranked.slice(cap);
  return { triaged: true, keep: new Set(top), defer };
}

function daysOverdue(m: MemoryState, now: number): number {
  return Math.max(0, (now - m.due) / MS_PER_DAY);
}

function rankOverdue(ids: string[], ctx: PickContext): string[] {
  const { catalog, memory, now } = ctx;
  return ids
    .map((id) => {
      const it = catalog.itemById.get(id)!;
      const m = memory.get(id);
      const over = m ? daysOverdue(m, now) : 0;
      const weight = topRuleWeight(it, catalog);
      // +1 so same-day-due items still rank by weight (otherwise over=0 zeroes the product).
      return { id, score: (over + 1) * weight };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.id);
}

function topRuleWeight(item: Item, catalog: CatalogIndex): number {
  let max = 0;
  for (const rid of item.ruleIds) {
    const r = catalog.ruleById.get(rid);
    if (r && r.examWeight > max) max = r.examWeight;
  }
  return max || 0.5;
}

/** Interleaving: don't serve two consecutive items from the same rule. */
function sharesRule(a: Item, b: Item): boolean {
  for (const r of a.ruleIds) if (b.ruleIds.includes(r)) return true;
  return false;
}

export type PickOptions = {
  /** Override new-item budget (e.g. blast5 sets 0). */
  allowNew?: boolean;
  /** Pool restriction for mock exam (we pass a custom list there). */
  restrictTo?: Set<string>;
  /** Relax the interleaving rule (teach mode, acquisition block). */
  relaxInterleaving?: boolean;
};

/** Choose the next item id. Returns undefined if nothing to serve. */
export function pickNext(
  ctx: PickContext,
  opts: PickOptions = {},
): string | undefined {
  const allowRestrict = (id: string) =>
    opts.restrictTo ? opts.restrictTo.has(id) : true;

  const summary = summarise(ctx);

  // 1. Relearning first.
  const relearn = summary.relearning.filter(allowRestrict);
  const picked =
    tryPick(relearn, ctx, opts) ??
    tryPick(rankOverdue(summary.learning.filter(allowRestrict), ctx), ctx, opts) ??
    tryPick(rankOverdue(summary.overdue.filter(allowRestrict), ctx), ctx, opts) ??
    tryPick(rankOverdue(summary.dueToday.filter(allowRestrict), ctx), ctx, opts);

  if (picked) return picked;

  // New items (if budget + session allow).
  const dueCount = summary.totalDue;
  const allowNew = opts.allowNew !== false && newItemBudget(dueCount) > 0;
  if (allowNew) {
    const newPool = summary.newAvailable.filter(allowRestrict);
    const ranked = newPool
      .map((id) => {
        const it = ctx.catalog.itemById.get(id)!;
        return { id, score: topRuleWeight(it, ctx.catalog) };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.id);
    const newPick = tryPick(ranked, ctx, opts);
    if (newPick) return newPick;
  }
  return undefined;
}

function tryPick(
  ids: string[],
  ctx: PickContext,
  opts: PickOptions,
): string | undefined {
  if (ids.length === 0) return undefined;
  const last = ctx.lastItemId
    ? ctx.catalog.itemById.get(ctx.lastItemId)
    : undefined;
  const served = ctx.servedThisSession ?? new Set<string>();

  // Prefer the first id that respects interleaving and hasn't been served.
  for (const id of ids) {
    if (served.has(id)) continue;
    const it = ctx.catalog.itemById.get(id);
    if (!it) continue;
    if (!opts.relaxInterleaving && last && sharesRule(it, last)) continue;
    return id;
  }
  // Fallback: relax interleaving, but still skip served items — never return
  // duplicates within a session.
  for (const id of ids) {
    if (served.has(id)) continue;
    return id;
  }
  return undefined;
}

/** Session composition for the normal review loop (§6.7). */
export function composeNormalSession(
  ctx: PickContext,
  n: number,
): string[] {
  const picked: string[] = [];
  const served = new Set<string>(ctx.servedThisSession ?? []);
  let last = ctx.lastItemId;
  for (let i = 0; i < n; i++) {
    const id = pickNext(
      { ...ctx, lastItemId: last, servedThisSession: served },
      {},
    );
    if (!id) break;
    picked.push(id);
    served.add(id);
    last = id;
  }
  return picked;
}

/** Session composition for blast5 (§6.7): overdue/due-today only, no new items. */
export function composeBlastSession(ctx: PickContext, n = 10): string[] {
  const summary = summarise(ctx);
  const pool = new Set<string>([
    ...summary.relearning,
    ...summary.learning,
    ...summary.overdue,
    ...summary.dueToday,
  ]);
  const picked: string[] = [];
  const served = new Set<string>();
  let last = ctx.lastItemId;
  for (let i = 0; i < n; i++) {
    const id = pickNext(
      { ...ctx, lastItemId: last, servedThisSession: served },
      { allowNew: false, restrictTo: pool },
    );
    if (!id) break;
    picked.push(id);
    served.add(id);
    last = id;
  }
  return picked;
}
