import { describe, expect, it } from "vitest";
import {
  buildCatalog,
  composeBlastSession,
  composeNormalSession,
  dailyCapacity,
  newItemBudget,
  pickNext,
  summarise,
  triage,
  type PickContext,
} from "@/scheduler/pickNext";
import type { Item, Rule } from "@/content/schema";
import type { MemoryState, Settings } from "@/db/types";
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
});
