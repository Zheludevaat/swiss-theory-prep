// Calibration reducer + drill composer tests (Audit §3.3). Guards the
// metacognitive-feedback loop: if this reducer's numbers drift, the user
// gets the wrong drill surfaced and the Koriat effect inverts.

import { describe, expect, it } from "vitest";
import {
  CALIBRATION_GAP_BAD_PP,
  CALIBRATION_GAP_WARN_PP,
  calibrationByCategory,
  composeCalibrationDrill,
  gapSeverity,
} from "@/lib/calibration";
import type { Category, Item } from "@/content/schema";
import type { ReviewEvent } from "@/db/types";

/** Minimal Item builder — calibrationByCategory only needs id via
 *  itemCategory(itemId), but composeCalibrationDrill needs the real Item. */
const item = (id: string, category: Category): Item =>
  ({
    id,
    ruleIds: [`r-${category}`],
    question: id,
    options: [
      { text: "a", correct: true },
      { text: "b", correct: false },
      { text: "c", correct: false },
    ],
    rationale: id,
  } as unknown as Item);

type RevPartial = {
  itemId: string;
  correct: boolean;
  confidence?: 1 | 2 | 3 | 4;
  timestamp?: number;
};

let revSeq = 0;
const review = (p: RevPartial): ReviewEvent => ({
  id: `ev-${++revSeq}`,
  itemId: p.itemId,
  sessionId: "s1",
  timestamp: p.timestamp ?? Date.now(),
  grade: p.correct ? 3 : 1,
  correct: p.correct,
  partiallyCorrect: false,
  userTicks: [p.correct, false, false],
  latencyMs: 5_000,
  ...(p.confidence !== undefined ? { confidence: p.confidence } : {}),
});

const catOf =
  (map: Record<string, Category>) =>
  (itemId: string): Category | undefined =>
    map[itemId];

describe("calibrationByCategory", () => {
  it("returns an empty array when there are no confidence-tagged reviews", () => {
    const rows = calibrationByCategory([review({ itemId: "i1", correct: true })], catOf({ i1: "signs" }));
    expect(rows).toEqual([]);
  });

  it("ignores reviews without a resolvable category", () => {
    const revs = [
      review({ itemId: "i1", correct: true, confidence: 3 }),
      review({ itemId: "i2", correct: false, confidence: 3 }),
    ];
    // i2 has no category mapping.
    const rows = calibrationByCategory(revs, catOf({ i1: "signs" }));
    expect(rows).toHaveLength(1);
    expect(rows[0]?.category).toBe("signs");
    expect(rows[0]?.n).toBe(1);
  });

  it("computes observed/expected/gap correctly for a single bucket", () => {
    // 10 reviews at confidence 3 (expected 75%), 6 correct.
    const revs: ReviewEvent[] = [];
    for (let k = 0; k < 6; k++) revs.push(review({ itemId: "i1", correct: true, confidence: 3 }));
    for (let k = 0; k < 4; k++) revs.push(review({ itemId: "i1", correct: false, confidence: 3 }));

    const rows = calibrationByCategory(revs, catOf({ i1: "priority" }));
    expect(rows).toHaveLength(1);
    const row = rows[0]!;
    expect(row.n).toBe(10);
    expect(row.observedPct).toBeCloseTo(0.6, 6);
    expect(row.expectedPct).toBeCloseTo(0.75, 6);
    // expected - observed = 0.75 - 0.60 = 0.15 → +15pp (overconfident).
    expect(row.gapPp).toBeCloseTo(15, 6);
    expect(row.byConfidence[3]).toEqual({ n: 10, correct: 6 });
    expect(row.byConfidence[1]).toEqual({ n: 0, correct: 0 });
  });

  it("weights expected by per-confidence sample counts", () => {
    // 2 at conf 1 (expected 0.25) both wrong, 2 at conf 4 (expected 1.00) both right.
    // Observed = 2/4 = 0.5. Expected = (2*0.25 + 2*1.0)/4 = 2.5/4 = 0.625.
    // Gap = 0.625 - 0.5 = 0.125 → +12.5pp overconfident.
    const revs = [
      review({ itemId: "i1", correct: false, confidence: 1 }),
      review({ itemId: "i1", correct: false, confidence: 1 }),
      review({ itemId: "i1", correct: true, confidence: 4 }),
      review({ itemId: "i1", correct: true, confidence: 4 }),
    ];
    const rows = calibrationByCategory(revs, catOf({ i1: "signs" }));
    expect(rows[0]?.observedPct).toBeCloseTo(0.5, 6);
    expect(rows[0]?.expectedPct).toBeCloseTo(0.625, 6);
    expect(rows[0]?.gapPp).toBeCloseTo(12.5, 6);
  });

  it("sorts by |gap| desc with n as tiebreak", () => {
    // Cat A: 10 reviews, gap +10pp.  Cat B: 20 reviews, gap +10pp.
    // Cat C: 5 reviews, gap +20pp.
    // Expected order: C (|20|), B (|10|, n=20), A (|10|, n=10).
    const revs: ReviewEvent[] = [];
    // A: conf 3, 7 right / 3 wrong → obs .70, exp .75, gap +5pp.
    //    we want gap +10pp so flip 1 more wrong.
    // Easier: use conf=4 always (expected 100%).
    // A: 10 at conf 4, 9 right / 1 wrong → obs .90, exp 1.00, gap +10.
    for (let k = 0; k < 9; k++) revs.push(review({ itemId: "a", correct: true, confidence: 4 }));
    for (let k = 0; k < 1; k++) revs.push(review({ itemId: "a", correct: false, confidence: 4 }));
    // B: 20 at conf 4, 18 right / 2 wrong → obs .90, exp 1.00, gap +10.
    for (let k = 0; k < 18; k++) revs.push(review({ itemId: "b", correct: true, confidence: 4 }));
    for (let k = 0; k < 2; k++) revs.push(review({ itemId: "b", correct: false, confidence: 4 }));
    // C: 5 at conf 4, 4 right / 1 wrong → obs .80, exp 1.00, gap +20.
    for (let k = 0; k < 4; k++) revs.push(review({ itemId: "c", correct: true, confidence: 4 }));
    for (let k = 0; k < 1; k++) revs.push(review({ itemId: "c", correct: false, confidence: 4 }));

    const rows = calibrationByCategory(
      revs,
      catOf({ a: "signs", b: "priority", c: "maneuvers" }),
    );
    expect(rows.map((r) => r.category)).toEqual(["maneuvers", "priority", "signs"]);
  });

  it("produces a negative gap when the user is underconfident", () => {
    // 10 at conf 2 (expected 50%), 9 right.
    const revs = [
      ...Array.from({ length: 9 }, () =>
        review({ itemId: "i1", correct: true, confidence: 2 }),
      ),
      review({ itemId: "i1", correct: false, confidence: 2 }),
    ];
    const rows = calibrationByCategory(revs, catOf({ i1: "signs" }));
    expect(rows[0]?.gapPp).toBeCloseTo(-40, 6);
  });
});

describe("gapSeverity", () => {
  it("classifies on the documented thresholds (and their negatives)", () => {
    expect(gapSeverity(0)).toBe("ok");
    expect(gapSeverity(CALIBRATION_GAP_WARN_PP - 0.1)).toBe("ok");
    expect(gapSeverity(CALIBRATION_GAP_WARN_PP)).toBe("warn");
    expect(gapSeverity(CALIBRATION_GAP_BAD_PP - 0.1)).toBe("warn");
    expect(gapSeverity(CALIBRATION_GAP_BAD_PP)).toBe("bad");
    // Negative gaps (underconfidence) hit the same bands.
    expect(gapSeverity(-CALIBRATION_GAP_BAD_PP)).toBe("bad");
    expect(gapSeverity(-CALIBRATION_GAP_WARN_PP)).toBe("warn");
  });
});

describe("composeCalibrationDrill", () => {
  const NOW = 1_700_000_000_000; // deterministic epoch for the tests
  const DAY = 24 * 60 * 60 * 1000;

  const items = [
    item("i1", "signs"),
    item("i2", "signs"),
    item("i3", "signs"),
    item("i4", "signs"),
    item("i5", "priority"),
  ];
  const itemCategory = (it: Item): Category | undefined => {
    if (it.id === "i5") return "priority";
    return "signs";
  };

  it("returns strict high-confidence misses when there are enough", () => {
    const revs = [
      review({ itemId: "i1", correct: false, confidence: 3, timestamp: NOW - 1 * DAY }),
      review({ itemId: "i2", correct: false, confidence: 3, timestamp: NOW - 2 * DAY }),
      review({ itemId: "i3", correct: false, confidence: 4, timestamp: NOW - 3 * DAY }),
      // Low-confidence miss — excluded by strict criterion.
      review({ itemId: "i4", correct: false, confidence: 1, timestamp: NOW - 4 * DAY }),
      // Correct high-conf — excluded.
      review({ itemId: "i4", correct: true, confidence: 4, timestamp: NOW - 5 * DAY }),
      // Wrong category — excluded.
      review({ itemId: "i5", correct: false, confidence: 4, timestamp: NOW - 1 * DAY }),
    ];
    const ids = composeCalibrationDrill({
      reviews: revs,
      items,
      itemCategory,
      category: "signs",
      now: NOW,
    });
    // Strict pool: i1, i2, i3 — ordered most-recent-miss first.
    expect(ids).toEqual(["i1", "i2", "i3"]);
  });

  it("falls back to any-miss-in-window when strict pool is too small", () => {
    const revs = [
      // Only 2 strict misses — minStrict defaults to 3, so fallback wins.
      review({ itemId: "i1", correct: false, confidence: 3, timestamp: NOW - 1 * DAY }),
      review({ itemId: "i2", correct: false, confidence: 4, timestamp: NOW - 2 * DAY }),
      // Low-confidence miss — eligible under fallback.
      review({ itemId: "i3", correct: false, confidence: 1, timestamp: NOW - 3 * DAY }),
      // Un-stamped miss — eligible under fallback (no confidence gate there).
      review({ itemId: "i4", correct: false, timestamp: NOW - 4 * DAY }),
    ];
    const ids = composeCalibrationDrill({
      reviews: revs,
      items,
      itemCategory,
      category: "signs",
      now: NOW,
    });
    expect(ids).toEqual(["i1", "i2", "i3", "i4"]);
  });

  it("dedupes by item id, keeping the most recent miss's position", () => {
    const revs = [
      review({ itemId: "i1", correct: false, confidence: 3, timestamp: NOW - 10 * DAY }),
      review({ itemId: "i2", correct: false, confidence: 3, timestamp: NOW - 5 * DAY }),
      // A more recent miss for i1 — it should take i1's slot first.
      review({ itemId: "i1", correct: false, confidence: 3, timestamp: NOW - 1 * DAY }),
      review({ itemId: "i3", correct: false, confidence: 3, timestamp: NOW - 7 * DAY }),
    ];
    const ids = composeCalibrationDrill({
      reviews: revs,
      items,
      itemCategory,
      category: "signs",
      now: NOW,
    });
    expect(ids).toEqual(["i1", "i2", "i3"]);
  });

  it("excludes misses outside the 30-day default window", () => {
    const revs = [
      review({ itemId: "i1", correct: false, confidence: 3, timestamp: NOW - 60 * DAY }),
      review({ itemId: "i2", correct: false, confidence: 3, timestamp: NOW - 1 * DAY }),
    ];
    const ids = composeCalibrationDrill({
      reviews: revs,
      items,
      itemCategory,
      category: "signs",
      now: NOW,
    });
    // i1 falls outside strict window AND fallback window — only i2 remains.
    expect(ids).toEqual(["i2"]);
  });

  it("honours the n cap", () => {
    const revs = Array.from({ length: 15 }, (_v, k) =>
      review({
        itemId: `i${(k % 4) + 1}`,
        correct: false,
        confidence: 3,
        timestamp: NOW - (k + 1) * (DAY / 4),
      }),
    );
    const ids = composeCalibrationDrill({
      reviews: revs,
      items,
      itemCategory,
      category: "signs",
      n: 2,
      now: NOW,
    });
    expect(ids).toHaveLength(2);
  });

  it("returns empty when there are no eligible misses at all", () => {
    const revs = [
      review({ itemId: "i1", correct: true, confidence: 4, timestamp: NOW - 1 * DAY }),
    ];
    const ids = composeCalibrationDrill({
      reviews: revs,
      items,
      itemCategory,
      category: "signs",
      now: NOW,
    });
    expect(ids).toEqual([]);
  });
});
