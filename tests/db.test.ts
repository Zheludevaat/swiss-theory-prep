// E-2: integration tests for the IndexedDB layer.
//
// Backed by fake-indexeddb (see tests/setup.ts), so each test starts with a
// fresh, empty store. We verify that user-state round-trips correctly, the
// triage write-back path mutates `due`, and that the schema upgrade doesn't
// drop data when called repeatedly.

import { describe, expect, it } from "vitest";
import {
  addReview,
  allMemoryState,
  allReviews,
  bumpDueByOneDay,
  exportBackup,
  flagRule,
  getMemoryState,
  importBackup,
  putMemoryState,
  reviewsForItem,
  reviewsSince,
  startSession,
  updateSession,
  wipeAll,
} from "@/db";
import type { MemoryState, ReviewEvent, Session } from "@/db/types";

const ONE_DAY = 24 * 60 * 60 * 1000;

const memState = (id: string, due = Date.now()): MemoryState => ({
  itemId: id,
  stability: 1,
  difficulty: 5,
  lastReview: 0,
  due,
  reps: 1,
  lapses: 0,
  state: "review",
});

const reviewEvent = (
  id: string,
  itemId: string,
  timestamp: number,
  correct = true,
): ReviewEvent => ({
  id,
  itemId,
  sessionId: "s1",
  timestamp,
  grade: correct ? 3 : 1,
  correct,
  partiallyCorrect: false,
  userTicks: [correct, false, false],
  latencyMs: 1000,
});

describe("memoryState round-trip", () => {
  it("stores and retrieves a single record", async () => {
    const m = memState("a");
    await putMemoryState(m);
    const got = await getMemoryState("a");
    expect(got).toEqual(m);
  });

  it("returns undefined for unknown ids", async () => {
    expect(await getMemoryState("missing")).toBeUndefined();
  });

  it("lists all records", async () => {
    await putMemoryState(memState("a"));
    await putMemoryState(memState("b"));
    const all = await allMemoryState();
    const ids = all.map((m) => m.itemId).sort();
    expect(ids).toEqual(["a", "b"]);
  });
});

describe("bumpDueByOneDay", () => {
  it("shifts due of every passed id by exactly one day", async () => {
    const t0 = 1_700_000_000_000;
    await putMemoryState(memState("a", t0));
    await putMemoryState(memState("b", t0 + 1000));
    await putMemoryState(memState("c", t0 + 2000)); // not deferred

    await bumpDueByOneDay(["a", "b"]);

    const a = await getMemoryState("a");
    const b = await getMemoryState("b");
    const c = await getMemoryState("c");
    expect(a?.due).toBe(t0 + ONE_DAY);
    expect(b?.due).toBe(t0 + 1000 + ONE_DAY);
    expect(c?.due).toBe(t0 + 2000); // untouched
  });

  it("ignores ids that have no persisted memory state", async () => {
    await putMemoryState(memState("a", 1000));
    // 'ghost' is brand-new — never reviewed, no memory record. Triage should
    // never defer such an item, but if it does, we silently no-op rather
    // than create an empty row.
    await expect(bumpDueByOneDay(["ghost", "a"])).resolves.toBeUndefined();
    expect(await getMemoryState("ghost")).toBeUndefined();
    expect((await getMemoryState("a"))?.due).toBe(1000 + ONE_DAY);
  });
});

describe("reviews", () => {
  it("indexes by item and timestamp", async () => {
    const now = 1_700_000_000_000;
    await addReview(reviewEvent("e1", "a", now - 3 * ONE_DAY));
    await addReview(reviewEvent("e2", "a", now - ONE_DAY));
    await addReview(reviewEvent("e3", "b", now - ONE_DAY));

    const a = await reviewsForItem("a");
    expect(a.map((r) => r.id).sort()).toEqual(["e1", "e2"]);

    const recent = await reviewsSince(now - 2 * ONE_DAY);
    expect(recent.map((r) => r.id).sort()).toEqual(["e2", "e3"]);

    const all = await allReviews();
    expect(all).toHaveLength(3);
  });
});

describe("sessions", () => {
  it("records and updates a session", async () => {
    const s: Session = {
      id: "s1",
      startedAt: 1000,
      mode: "review",
      itemsReviewed: 0,
      itemsCorrect: 0,
    };
    await startSession(s);
    await updateSession({ ...s, endedAt: 2000, itemsReviewed: 5, itemsCorrect: 4 });

    const backup = await exportBackup();
    expect(backup.sessions).toHaveLength(1);
    expect(backup.sessions[0]?.endedAt).toBe(2000);
    expect(backup.sessions[0]?.itemsCorrect).toBe(4);
  });
});

describe("flagged rules", () => {
  it("counts repeated flags on the same rule", async () => {
    await flagRule("r1");
    await flagRule("r1");
    const after = await flagRule("r1");
    expect(after.count).toBe(3);
  });
});

describe("exportBackup / importBackup", () => {
  it("round-trips memory + reviews + sessions + flagged", async () => {
    await putMemoryState(memState("a", 1000));
    await putMemoryState(memState("b", 2000));
    await addReview(reviewEvent("e1", "a", 500));
    await startSession({
      id: "s1",
      startedAt: 100,
      mode: "review",
      itemsReviewed: 1,
      itemsCorrect: 1,
      endedAt: 200,
    });
    await flagRule("r1");

    const backup = await exportBackup();
    expect(backup.memoryState).toHaveLength(2);
    expect(backup.reviews).toHaveLength(1);
    expect(backup.sessions).toHaveLength(1);
    expect(backup.flagged).toHaveLength(1);

    // Wipe and re-import — the contents must come back intact.
    await wipeAll();
    expect(await allMemoryState()).toHaveLength(0);

    await importBackup(backup);

    const mem = await allMemoryState();
    expect(mem.map((m) => m.itemId).sort()).toEqual(["a", "b"]);
    expect((await reviewsForItem("a"))[0]?.id).toBe("e1");
  });

  it("rejects unsupported backup versions", async () => {
    // @ts-expect-error - intentionally wrong version
    await expect(importBackup({ version: 99 })).rejects.toThrow(/version/i);
  });
});

describe("wipeAll", () => {
  it("clears every store", async () => {
    await putMemoryState(memState("a"));
    await addReview(reviewEvent("e1", "a", 100));
    await flagRule("r1");
    await wipeAll();
    expect(await allMemoryState()).toHaveLength(0);
    expect(await allReviews()).toHaveLength(0);
  });
});
