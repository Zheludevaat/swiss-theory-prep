import { describe, expect, it } from "vitest";
import {
  buildCatalog,
  CATCH_UP_THRESHOLD_MS,
  composeBlastSession,
  composeNormalSession,
  dailyCapacity,
  isInCatchUpMode,
  newItemBudget,
  pickNext,
  summarise,
  triage,
  weakSpotIds,
  type PickContext,
} from "@/scheduler/pickNext";
import { isGraduated } from "@/scheduler/fsrs";
import type { Item, Rule } from "@/content/schema";
import type { MemoryState, ReviewEvent, Settings } from "@/db/types";
import { DEFAULT_SETTINGS } from "@/db/types";

const r = (id: string, weight = 0.5): Rule => ({
  id,
  title: id,
  statement: id,
  category: "priority",
  legalRefs: [],
  tags: [],
  examWeight: weight,
  workedExamples: [],
});

const i = (id: string, ruleIds: string[]): Item =>
  ({
    id,
    ruleIds,
    question: id,
    options: [
      { text: "a", correct: true },
      { text: "b", correct: false },
      { text: "c", correct: false },
    ],
    rationale: "",
    tags: [],
    difficulty: 3,
  }) as Item;

const memState = (
  id: string,
  o: Partial<MemoryState> = {},
): MemoryState => ({
  itemId: id,
  stability: 1,
  difficulty: 5,
  lastReview: 0,
  due: Date.now(),
  reps: 1,
  lapses: 0,
  state: "review",
  ...o,
});

const baseSettings: Settings = { ...DEFAULT_SETTINGS };

describe("newItemBudget", () => {
  it("scales with backlog", () => {
    expect(newItemBudget(0)).toBe(10);
    expect(newItemBudget(20)).toBe(10);
    expect(newItemBudget(21)).toBe(3);
    expect(newItemBudget(40)).toBe(3);
    expect(newItemBudget(41)).toBe(0);
  });
});

describe("dailyCapacity", () => {
  it("respects floor", () => {
    expect(dailyCapacity({ ...baseSettings, dailyTargetMinutes: 1 })).toBe(10);
  });
  it("scales linearly", () => {
    expect(dailyCapacity({ ...baseSettings, dailyTargetMinutes: 20 })).toBe(60);
  });
});

describe("pickNext priority", () => {
  it("prefers relearning over overdue", () => {
    const items = [i("a", ["r1"]), i("b", ["r2"])];
    const rules = [r("r1"), r("r2")];
    const memory = new Map<string, MemoryState>([
      ["a", memState("a", { state: "review", due: Date.now() - 86_400_000 })],
      ["b", memState("b", { state: "relearning" })],
    ]);
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: baseSettings,
      now: Date.now(),
    };
    expect(pickNext(ctx)).toBe("b");
  });

  it("interleaves: doesn't return same-rule item back-to-back", () => {
    const items = [i("a1", ["r1"]), i("a2", ["r1"]), i("b1", ["r2"])];
    const rules = [r("r1"), r("r2")];
    const memory = new Map<string, MemoryState>([
      ["a1", memState("a1", { state: "review", reps: 3 })],
      ["a2", memState("a2", { state: "review", reps: 3 })],
      ["b1", memState("b1", { state: "review", reps: 3 })],
    ]);
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: baseSettings,
      now: Date.now(),
      lastItemId: "a1",
      servedThisSession: new Set(["a1"]),
    };
    expect(pickNext(ctx)).toBe("b1");
  });

  it("respects restrictTo (mock pool)", () => {
    const items = [i("a", ["r1"]), i("b", ["r2"])];
    const rules = [r("r1"), r("r2")];
    const memory = new Map<string, MemoryState>();
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: baseSettings,
      now: Date.now(),
    };
    const picked = pickNext(ctx, { restrictTo: new Set(["b"]) });
    expect(picked).toBe("b");
  });
});

describe("summarise / triage", () => {
  it("triggers triage when due > 3× capacity", () => {
    const items = Array.from({ length: 50 }, (_, k) => i(`x${k}`, ["r"]));
    const rules = [r("r")];
    const memory = new Map(
      items.map((it) => [
        it.id,
        memState(it.id, { state: "review", due: Date.now() - 86_400_000 }),
      ]),
    );
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: { ...baseSettings, dailyTargetMinutes: 5 }, // capacity 15
      now: Date.now(),
    };
    const sum = summarise(ctx);
    expect(sum.totalDue).toBe(50);
    const t = triage(sum, ctx);
    expect(t.triaged).toBe(true);
    expect(t.keep.size).toBe(15);
    expect(t.defer.length).toBe(35);
  });
});

describe("composeBlastSession", () => {
  it("returns up to N due items, no new", () => {
    const items = [
      i("a", ["r1"]),
      i("b", ["r2"]),
      i("new", ["r3"]),
    ];
    const rules = [r("r1"), r("r2"), r("r3")];
    const memory = new Map<string, MemoryState>([
      ["a", memState("a")],
      ["b", memState("b")],
    ]);
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: baseSettings,
      now: Date.now(),
    };
    const ids = composeBlastSession(ctx, 5);
    expect(ids.length).toBe(2);
    expect(ids).not.toContain("new");
  });
});

describe("composeNormalSession", () => {
  it("returns up to N items, mixing due + new", () => {
    const items = [
      i("a", ["r1"]),
      i("b", ["r2"]),
      i("c", ["r3"]),
      i("d", ["r4"]),
    ];
    const rules = [r("r1"), r("r2"), r("r3"), r("r4")];
    const memory = new Map<string, MemoryState>([
      ["a", memState("a")],
    ]);
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: baseSettings,
      now: Date.now(),
    };
    const ids = composeNormalSession(ctx, 3);
    expect(ids.length).toBe(3);
    expect(new Set(ids).size).toBe(3);
  });

  it("caps new-item draw at floor(0.2·n) when overdue is plentiful", () => {
    // 10 overdue + 10 brand-new. Quota maths for n=10:
    //   overdue: ceil(0.7·10)=7, new: floor(0.2·10)=2, weak: 1.
    // Expect at most 2 ids from the new pool. (We used to serve up to 10.)
    const now = Date.now();
    const overdueItems = Array.from({ length: 10 }, (_, k) =>
      i(`o${k}`, [`r${k}`]),
    );
    const newItems = Array.from({ length: 10 }, (_, k) =>
      i(`n${k}`, [`s${k}`]),
    );
    const items = [...overdueItems, ...newItems];
    const rules = items.map((it) => r(it.ruleIds[0]));
    const memory = new Map<string, MemoryState>(
      overdueItems.map((it) => [
        it.id,
        memState(it.id, { due: now - 86_400_000 }),
      ]),
    );
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: baseSettings,
      now,
    };
    const ids = composeNormalSession(ctx, 10);
    const newCount = ids.filter((id) => id.startsWith("n")).length;
    expect(ids.length).toBe(10);
    expect(newCount).toBeLessThanOrEqual(2);
  });

  it("suspends new-item drip in catch-up mode (72h+ absence)", () => {
    const now = Date.now();
    const overdueItems = Array.from({ length: 5 }, (_, k) =>
      i(`o${k}`, [`r${k}`]),
    );
    const newItems = Array.from({ length: 5 }, (_, k) =>
      i(`n${k}`, [`s${k}`]),
    );
    const items = [...overdueItems, ...newItems];
    const rules = items.map((it) => r(it.ruleIds[0]));
    const memory = new Map<string, MemoryState>(
      overdueItems.map((it) => [
        it.id,
        memState(it.id, { due: now - 86_400_000 }),
      ]),
    );
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: baseSettings,
      now,
      lastSessionEndedAt: now - (CATCH_UP_THRESHOLD_MS + 60_000),
    };
    const ids = composeNormalSession(ctx, 10);
    expect(ids.every((id) => id.startsWith("o"))).toBe(true);
  });
});

describe("weakSpotIds", () => {
  it("flags items with lapses ≥ threshold", () => {
    const items = [i("a", ["r1"]), i("b", ["r2"])];
    const rules = [r("r1"), r("r2")];
    const memory = new Map<string, MemoryState>([
      ["a", memState("a", { lapses: 2 })],
      ["b", memState("b", { lapses: 0 })],
    ]);
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: baseSettings,
      now: Date.now(),
    };
    expect(weakSpotIds(ctx).sort()).toEqual(["a"]);
  });

  it("flags items with a recent incorrect review within 24h", () => {
    const now = Date.now();
    const items = [i("a", ["r1"]), i("b", ["r2"]), i("c", ["r3"])];
    const rules = [r("r1"), r("r2"), r("r3")];
    const memory = new Map<string, MemoryState>([
      ["a", memState("a", { lapses: 0 })],
      ["b", memState("b", { lapses: 0 })],
      ["c", memState("c", { lapses: 0 })],
    ]);
    const review = (itemId: string, correct: boolean, ts: number): ReviewEvent => ({
      id: `${itemId}-${ts}`,
      itemId,
      sessionId: "s1",
      timestamp: ts,
      grade: correct ? 3 : 1,
      correct,
      partiallyCorrect: false,
      userTicks: [correct, false, false],
      latencyMs: 1000,
    });
    const ctx: PickContext = {
      catalog: buildCatalog(items, rules),
      memory,
      settings: baseSettings,
      now,
      recentReviews: [
        review("a", false, now - 3_600_000), // flagged (acute)
        review("b", true, now - 3_600_000), // correct, not flagged
        review("c", false, now - 48 * 3_600_000), // too old
      ],
    };
    expect(weakSpotIds(ctx).sort()).toEqual(["a"]);
  });
});

describe("isInCatchUpMode", () => {
  it("returns false when no prior session recorded", () => {
    const ctx: PickContext = {
      catalog: buildCatalog([], []),
      memory: new Map(),
      settings: baseSettings,
      now: Date.now(),
    };
    expect(isInCatchUpMode(ctx)).toBe(false);
  });

  it("returns true when last session ended more than 72h ago", () => {
    const now = Date.now();
    const ctx: PickContext = {
      catalog: buildCatalog([], []),
      memory: new Map(),
      settings: baseSettings,
      now,
      lastSessionEndedAt: now - (CATCH_UP_THRESHOLD_MS + 1),
    };
    expect(isInCatchUpMode(ctx)).toBe(true);
  });

  it("returns false when last session ended recently", () => {
    const now = Date.now();
    const ctx: PickContext = {
      catalog: buildCatalog([], []),
      memory: new Map(),
      settings: baseSettings,
      now,
      lastSessionEndedAt: now - 3_600_000,
    };
    expect(isInCatchUpMode(ctx)).toBe(false);
  });
});

describe("isGraduated", () => {
  const MS_DAY = 24 * 60 * 60 * 1000;

  it("requires reps ≥ 3 and state=review", () => {
    expect(isGraduated(memState("a", { reps: 2, state: "review" }))).toBe(false);
    expect(isGraduated(memState("a", { reps: 5, state: "learning" }))).toBe(false);
  });

  it("graduates when zero lapses and mature", () => {
    expect(
      isGraduated(memState("a", { reps: 5, state: "review", lapses: 0 })),
    ).toBe(true);
  });

  it("ungraduates lapsed items with a short current interval", () => {
    const now = Date.now();
    expect(
      isGraduated(
        memState("a", {
          reps: 5,
          state: "review",
          lapses: 1,
          lastReview: now - 2 * MS_DAY,
          due: now + 3 * MS_DAY, // 5d interval — still shaky
        }),
        now,
      ),
    ).toBe(false);
  });

  it("re-graduates lapsed items once their interval grows to ≥14d", () => {
    const now = Date.now();
    expect(
      isGraduated(
        memState("a", {
          reps: 8,
          state: "review",
          lapses: 1,
          lastReview: now - MS_DAY,
          due: now + 20 * MS_DAY, // 21d interval
        }),
        now,
      ),
    ).toBe(true);
  });
});
