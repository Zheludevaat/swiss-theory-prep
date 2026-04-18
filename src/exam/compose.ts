// Mock exam composition — draw 50 items from the catalog such that the
// category distribution approximates ASA's competence catalog (§8.1), and
// items seen in the last 48h are excluded so the composition is novel.

import { CATEGORY_WEIGHTS, type Category, type Item } from "@/content/schema";
import type { MemoryState, ReviewEvent } from "@/db/types";

const COOLDOWN_MS = 48 * 60 * 60 * 1000;

export function composeMockExam(
  items: Item[],
  ruleCategory: (item: Item) => Category | undefined,
  reviews: ReviewEvent[],
  _memory: Map<string, MemoryState>,
  now: number,
  length = 50,
): Item[] {
  // Build "seen recently" set.
  const seenRecently = new Set<string>();
  for (const r of reviews) {
    if (r.timestamp >= now - COOLDOWN_MS) seenRecently.add(r.itemId);
  }
  const pool = items.filter((it) => !seenRecently.has(it.id));

  // Bucket by category.
  const buckets: Partial<Record<Category, Item[]>> = {};
  for (const it of pool) {
    const cat = ruleCategory(it);
    if (!cat) continue;
    (buckets[cat] ??= []).push(it);
  }

  // Target counts per category, rounded.
  const targets: Partial<Record<Category, number>> = {};
  let assigned = 0;
  for (const cat of Object.keys(CATEGORY_WEIGHTS) as Category[]) {
    const count = Math.round(length * CATEGORY_WEIGHTS[cat]);
    targets[cat] = count;
    assigned += count;
  }
  // Absorb rounding drift into "signs" (largest bucket).
  if (assigned !== length) {
    targets.signs = (targets.signs ?? 0) + (length - assigned);
  }

  // Draw with fallback: if a bucket is too thin, top up from any remaining pool.
  const chosen: Item[] = [];
  const used = new Set<string>();
  for (const cat of Object.keys(targets) as Category[]) {
    const want = targets[cat] ?? 0;
    const bucket = shuffled(buckets[cat] ?? []);
    for (const it of bucket) {
      if (chosen.length >= length) break;
      if (used.has(it.id)) continue;
      chosen.push(it);
      used.add(it.id);
      if (chosen.filter((c) => ruleCategory(c) === cat).length >= want) break;
    }
  }
  // Top up if still short (thin categories).
  if (chosen.length < length) {
    for (const it of shuffled(pool)) {
      if (chosen.length >= length) break;
      if (!used.has(it.id)) {
        chosen.push(it);
        used.add(it.id);
      }
    }
  }
  // If still short (catalog too small), allow recently-seen items.
  if (chosen.length < length) {
    for (const it of shuffled(items)) {
      if (chosen.length >= length) break;
      if (!used.has(it.id)) {
        chosen.push(it);
        used.add(it.id);
      }
    }
  }

  return shuffled(chosen).slice(0, length);
}

function shuffled<T>(xs: T[]): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i]!, out[j]!] = [out[j]!, out[i]!];
  }
  return out;
}

export function truthOf(item: Item): [boolean, boolean, boolean] {
  return [
    item.options[0].correct,
    item.options[1].correct,
    item.options[2].correct,
  ];
}
