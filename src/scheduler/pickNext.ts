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
import type { MemoryState, ReviewEvent } from "@/db/types";
import type { Settings } from "@/db/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** If a session hasn't happened in this long, suspend new-item drip. */
export const CATCH_UP_THRESHOLD_MS = 72 * 60 * 60 * 1000; // 72 hours

/** Lapses at or above this count mark an item as a weak-spot candidate. */
export const WEAK_SPOT_LAPSE_THRESHOLD = 2;

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
  /**
   * Recent review events (typically the last 24h) used by the weak-spot
   * detector. Optional — when absent, weak-spot defaults to lapse-only.
   */
  recentReviews?: ReviewEvent[];
  /**
   * Epoch ms when the user's last session ended. When this is more than
   * CATCH_UP_THRESHOLD_MS ago we suspend new-item drip (DESIGN_v3 §6.6).
   * Undefined means "no prior session" — treated as fresh, not in catch-up.
   */
  lastSessionEndedAt?: number;
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

/**
 * Items the user is currently struggling with. Two signals:
 *   - lapses ≥ WEAK_SPOT_LAPSE_THRESHOLD (chronic difficulty), or
 *   - any incorrect review in the last 24h (acute confusion).
 * The intersection isn't required — either signal qualifies an item.
 */
export function weakSpotIds(ctx: PickContext): string[] {
  const out = new Set<string>();
  for (const m of ctx.memory.values()) {
    if (m.lapses >= WEAK_SPOT_LAPSE_THRESHOLD) out.add(m.itemId);
  }
  const oneDayAgo = ctx.now - MS_PER_DAY;
  for (const ev of ctx.recentReviews ?? []) {
    if (!ev.correct && ev.timestamp >= oneDayAgo) out.add(ev.itemId);
  }
  return Array.from(out);
}

/**
 * Has the user been away long enough that we should suspend new-item drip
 * and just clear the backlog? Returns false when there is no prior session
 * recorded (treat as fresh start, not absence).
 */
export function isInCatchUpMode(ctx: PickContext): boolean {
  if (ctx.lastSessionEndedAt == null) return false;
  return ctx.now - ctx.lastSessionEndedAt > CATCH_UP_THRESHOLD_MS;
}

/**
 * Session composition for the normal review loop (DESIGN_v3 §6.7).
 *
 * Quotas: 70% overdue/due (priority-ranked) + 20% new (budget-bounded) +
 * 10% weak-spot. Empty buckets spill to a final pass that fills any
 * remaining slots from whatever's available, respecting interleaving and
 * the optional `restrictTo` pool.
 *
 * In catch-up mode (no session in 72h+), the new-item quota is forced to
 * zero so the user clears backlog before introducing fresh material.
 */
export function composeNormalSession(
  ctx: PickContext,
  n: number,
  opts: PickOptions = {},
): string[] {
  if (n <= 0) return [];

  const summary = summarise(ctx);
  const catchUp = isInCatchUpMode(ctx);

  // Quota math: ceil(0.7n) overdue, floor(0.2n) new, remainder weak-spot.
  // Keeps overdue dominant when n is small and lets weak-spot get its slice.
  const quotaOverdue = Math.ceil(n * 0.7);
  const quotaNewRaw = Math.floor(n * 0.2);
  const quotaNew = catchUp ? 0 : quotaNewRaw;
  const quotaWeak = Math.max(0, n - quotaOverdue - quotaNew);

  const passesRestrict = (id: string) =>
    opts.restrictTo ? opts.restrictTo.has(id) : true;

  // Overdue-and-due-today pool, intersected with any restrictTo.
  const overduePool = new Set(
    [
      ...summary.relearning,
      ...summary.learning,
      ...summary.overdue,
      ...summary.dueToday,
    ].filter(passesRestrict),
  );
  const newPool = new Set(summary.newAvailable.filter(passesRestrict));
  const weakSet = new Set(weakSpotIds(ctx));
  const weakPool = new Set(
    Array.from(overduePool).filter((id) => weakSet.has(id)),
  );

  const picked: string[] = [];
  const served = new Set<string>(ctx.servedThisSession ?? []);
  let last = ctx.lastItemId;

  const drawFromPool = (
    pool: Set<string>,
    quota: number,
    drawOpts: PickOptions,
  ): number => {
    if (quota <= 0 || pool.size === 0) return 0;
    let drawn = 0;
    while (drawn < quota) {
      // Subtract already-served from the pool view so pickNext won't repeat.
      const live = new Set<string>();
      for (const id of pool) if (!served.has(id)) live.add(id);
      if (live.size === 0) break;
      const id = pickNext(
        { ...ctx, lastItemId: last, servedThisSession: served },
        { ...drawOpts, restrictTo: live },
      );
      if (!id) break;
      picked.push(id);
      served.add(id);
      last = id;
      drawn++;
    }
    return drawn;
  };

  // Order matters: overdue first so the high-priority bucket gets first
  // pick of the interleaving budget.
  drawFromPool(overduePool, quotaOverdue, { allowNew: false });
  drawFromPool(weakPool, quotaWeak, { allowNew: false });
  drawFromPool(newPool, quotaNew, { allowNew: true });

  // Spill: top up from any remaining pool until n is filled or we run out.
  if (picked.length < n) {
    const spillPool = opts.restrictTo
      ? new Set(Array.from(opts.restrictTo).filter((id) => !served.has(id)))
      : undefined;
    while (picked.length < n) {
      const id = pickNext(
        { ...ctx, lastItemId: last, servedThisSession: served },
        { ...opts, restrictTo: spillPool, allowNew: !catchUp },
      );
      if (!id) break;
      picked.push(id);
      served.add(id);
      last = id;
    }
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
