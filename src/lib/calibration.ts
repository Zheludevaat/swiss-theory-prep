// Per-category confidence calibration — the Koriat feedback loop made
// granular. Audit §3.3.
//
// DESIGN_v3 §2.5 calls for confidence sampling plus a metacognitive-feedback
// loop that "contrasts judgement with outcome at the grain where the learner
// makes decisions." The global calibration curve in Stats satisfies the first
// half; this reducer satisfies the second by splitting the curve per ASA
// category so overconfidence in signs doesn't hide behind correctness in
// priority (or vice versa).
//
// The drill path — pickOverconfidentCategory + picking items the user
// answered incorrectly at stated confidence ≥3 — is what makes this more
// than a read-only chart.

import type { Category } from "@/content/schema";
import type { Item } from "@/content/schema";
import type { ReviewEvent } from "@/db/types";

/** Minimum per-category samples before the bucket is considered meaningful. */
export const CALIBRATION_SAMPLE_FLOOR = 50;

/** Absolute gap in percentage points at which we flag a bucket. */
export const CALIBRATION_GAP_WARN_PP = 8;
export const CALIBRATION_GAP_BAD_PP = 15;

/**
 * Confidence buckets ("what fraction of the time did the user say they were
 * Guessing / Unsure / Likely / Sure, and what fraction were they actually
 * right?"). Expected rates follow the Likert spacing used in Card.tsx:
 * 1 → 0.25, 2 → 0.50, 3 → 0.75, 4 → 1.00.
 */
export const EXPECTED_ACCURACY: Record<1 | 2 | 3 | 4, number> = {
  1: 0.25,
  2: 0.50,
  3: 0.75,
  4: 1.00,
};

export type CalibrationRow = {
  category: Category;
  /** Weighted observed accuracy (correct / n). */
  observedPct: number;
  /** Weighted expected accuracy based on stated confidences. */
  expectedPct: number;
  /** Positive = overconfident (said higher than truth). */
  gapPp: number;
  /** Sample count with a confidence attached. */
  n: number;
  /** Per-confidence-level breakdown, useful for the detail drill-down later. */
  byConfidence: Record<1 | 2 | 3 | 4, { n: number; correct: number }>;
};

/**
 * Collapse a stream of ReviewEvents into per-category calibration rows.
 * Items without a resolvable category are ignored (they wouldn't map to a
 * drill URL anyway). Reviews without a confidence stamp are also ignored —
 * they're the 4-in-5 un-sampled cards.
 */
export function calibrationByCategory(
  reviews: ReviewEvent[],
  itemCategory: (itemId: string) => Category | undefined,
): CalibrationRow[] {
  const buckets = new Map<Category, CalibrationRow>();

  for (const ev of reviews) {
    if (ev.confidence === undefined) continue;
    const cat = itemCategory(ev.itemId);
    if (!cat) continue;

    let row = buckets.get(cat);
    if (!row) {
      row = {
        category: cat,
        observedPct: 0,
        expectedPct: 0,
        gapPp: 0,
        n: 0,
        byConfidence: {
          1: { n: 0, correct: 0 },
          2: { n: 0, correct: 0 },
          3: { n: 0, correct: 0 },
          4: { n: 0, correct: 0 },
        },
      };
      buckets.set(cat, row);
    }

    const b = row.byConfidence[ev.confidence];
    b.n += 1;
    if (ev.correct) b.correct += 1;
    row.n += 1;
  }

  // Second pass: finalise observed / expected / gap. We compute expected as
  // a sample-size-weighted average of the bucket expectations — matching
  // the shape "if the user said X on average, the calibrated accuracy would
  // be X%."
  for (const row of buckets.values()) {
    let correctTotal = 0;
    let expectedSum = 0;
    (Object.entries(row.byConfidence) as Array<[string, { n: number; correct: number }]>)
      .forEach(([cStr, b]) => {
        const c = Number(cStr) as 1 | 2 | 3 | 4;
        correctTotal += b.correct;
        expectedSum += b.n * EXPECTED_ACCURACY[c];
      });
    row.observedPct = row.n ? correctTotal / row.n : 0;
    row.expectedPct = row.n ? expectedSum / row.n : 0;
    row.gapPp = (row.expectedPct - row.observedPct) * 100;
  }

  // Sort by |gap| desc, then by n desc — we want the worst miscalibration
  // up top, with a tiebreaker on reliability.
  return Array.from(buckets.values()).sort((a, b) => {
    const d = Math.abs(b.gapPp) - Math.abs(a.gapPp);
    return d !== 0 ? d : b.n - a.n;
  });
}

/** Gap severity as a tri-state for UI colouring. */
export type GapSeverity = "ok" | "warn" | "bad";

export function gapSeverity(gapPp: number): GapSeverity {
  const abs = Math.abs(gapPp);
  if (abs >= CALIBRATION_GAP_BAD_PP) return "bad";
  if (abs >= CALIBRATION_GAP_WARN_PP) return "warn";
  return "ok";
}

/**
 * Compose a calibration-repair drill session for a specific category.
 *
 * Criterion: items in `category` that the user answered incorrectly in the
 * last ~30 days at a *high* stated confidence (≥3). High-confidence misses
 * are the most metacognitively dangerous — they'll get under-practiced
 * precisely because the learner thinks they're fine — and the Koriat
 * feedback-loop effect is strongest when the contrast is vivid.
 *
 * Falls back to "any incorrect answer in category" if the strict criterion
 * yields fewer than `min`. Returns a deduped list of item IDs, ordered by
 * most-recent-miss first (so the drill feels responsive to what just
 * happened).
 */
export function composeCalibrationDrill(args: {
  reviews: ReviewEvent[];
  items: Item[];
  itemCategory: (item: Item) => Category | undefined;
  category: Category;
  /** how far back to look, ms. defaults to 30 days */
  windowMs?: number;
  /** target session length */
  n?: number;
  /** minimum high-confidence misses before we relax to any miss */
  minStrict?: number;
  /** reference time, injectable for tests */
  now?: number;
}): string[] {
  const {
    reviews,
    items,
    itemCategory,
    category,
    windowMs = 30 * 24 * 60 * 60 * 1000,
    n = 10,
    minStrict = 3,
    now = Date.now(),
  } = args;

  const itemById = new Map<string, Item>();
  for (const it of items) itemById.set(it.id, it);
  const windowStart = now - windowMs;

  const strict: { id: string; at: number }[] = [];
  const relaxed: { id: string; at: number }[] = [];
  const seenStrict = new Set<string>();
  const seenRelaxed = new Set<string>();

  // Scan in reverse chronological order so the most recent miss wins the
  // dedup race.
  const sorted = [...reviews].sort((a, b) => b.timestamp - a.timestamp);
  for (const ev of sorted) {
    if (ev.timestamp < windowStart) continue;
    if (ev.correct) continue;
    const it = itemById.get(ev.itemId);
    if (!it) continue;
    const cat = itemCategory(it);
    if (cat !== category) continue;

    if (ev.confidence !== undefined && ev.confidence >= 3) {
      if (!seenStrict.has(ev.itemId)) {
        seenStrict.add(ev.itemId);
        strict.push({ id: ev.itemId, at: ev.timestamp });
      }
    }
    if (!seenRelaxed.has(ev.itemId)) {
      seenRelaxed.add(ev.itemId);
      relaxed.push({ id: ev.itemId, at: ev.timestamp });
    }
  }

  const pool = strict.length >= minStrict ? strict : relaxed;
  return pool.slice(0, n).map((p) => p.id);
}
