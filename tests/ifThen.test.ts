// Implementation-intention helper tests (Audit §3.2). These are the only
// pieces of the onboarding that are pure logic — the card UI is exercised
// by a smoke test in routes.test.tsx. If isCueWindow / shouldShowCueTile
// drift, the Today reminder fires at the wrong time (nagging) or stays
// silent (no retrieval cue), either of which undermines Gollwitzer's
// "if-then → doubles follow-through" result.

import { describe, expect, it } from "vitest";
import {
  isCueWindow,
  renderIfThenSentence,
  shouldShowCueTile,
} from "@/lib/ifThen";

function at(hour: number): Date {
  const d = new Date(2026, 3, 19, hour, 0, 0, 0);
  return d;
}

describe("isCueWindow", () => {
  it("returns false for unknown and unset cues", () => {
    expect(isCueWindow(undefined, at(9))).toBe(false);
    expect(isCueWindow("", at(9))).toBe(false);
    expect(isCueWindow("something made up", at(9))).toBe(false);
  });

  it("returns false for 'other' — we can't know a custom cue's window", () => {
    expect(isCueWindow("other", at(9))).toBe(false);
  });

  it("matches the morning-coffee window from 06:00 to 10:59", () => {
    expect(isCueWindow("after morning coffee", at(5))).toBe(false);
    expect(isCueWindow("after morning coffee", at(6))).toBe(true);
    expect(isCueWindow("after morning coffee", at(10))).toBe(true);
    expect(isCueWindow("after morning coffee", at(11))).toBe(false);
  });

  it("matches the lunch window from 11:00 to 13:59", () => {
    expect(isCueWindow("during lunch break", at(11))).toBe(true);
    expect(isCueWindow("during lunch break", at(13))).toBe(true);
    expect(isCueWindow("during lunch break", at(14))).toBe(false);
  });

  it("handles the bedtime window across midnight", () => {
    expect(isCueWindow("before bed", at(20))).toBe(false);
    expect(isCueWindow("before bed", at(21))).toBe(true);
    expect(isCueWindow("before bed", at(23))).toBe(true);
    expect(isCueWindow("before bed", at(0))).toBe(true);
    expect(isCueWindow("before bed", at(1))).toBe(true);
    expect(isCueWindow("before bed", at(2))).toBe(false);
  });
});

describe("shouldShowCueTile", () => {
  const inWindow = at(9).getTime();

  it("is false when no cue is set", () => {
    expect(shouldShowCueTile({ now: inWindow })).toBe(false);
  });

  it("is false outside the cue window", () => {
    expect(
      shouldShowCueTile({
        cue: "after morning coffee",
        now: at(20).getTime(),
      }),
    ).toBe(false);
  });

  it("is true in-window when no prior session exists", () => {
    expect(
      shouldShowCueTile({
        cue: "after morning coffee",
        now: inWindow,
      }),
    ).toBe(true);
  });

  it("is suppressed within 16 hours of the last session", () => {
    const lastEnd = inWindow - 2 * 60 * 60 * 1000; // 2h ago
    expect(
      shouldShowCueTile({
        cue: "after morning coffee",
        lastSessionEndedAt: lastEnd,
        now: inWindow,
      }),
    ).toBe(false);
  });

  it("is shown again after 16+ hours — the user hasn't reviewed this day", () => {
    const lastEnd = inWindow - 20 * 60 * 60 * 1000; // 20h ago
    expect(
      shouldShowCueTile({
        cue: "after morning coffee",
        lastSessionEndedAt: lastEnd,
        now: inWindow,
      }),
    ).toBe(true);
  });
});

describe("renderIfThenSentence", () => {
  it("returns undefined when no cue is bound", () => {
    expect(renderIfThenSentence(undefined, undefined)).toBeUndefined();
    expect(renderIfThenSentence(undefined, "at my desk")).toBeUndefined();
  });

  it("includes the place when present", () => {
    const s = renderIfThenSentence("during lunch break", "at my desk");
    expect(s).toContain("during lunch break");
    expect(s).toContain("at my desk");
    expect(s).toContain("review");
  });

  it("omits the place clause when the place isn't set", () => {
    const s = renderIfThenSentence("after morning coffee", undefined);
    expect(s).toBe(
      "When I'm after morning coffee, I'll open the app and run a review.",
    );
  });

  it("softens raw 'other' placeholders into readable text", () => {
    const s = renderIfThenSentence("other", "other");
    // The exact copy can evolve; the contract is that we never render
    // the literal string "other" to the user as their plan.
    expect(s).not.toContain("'other'");
    expect(s?.toLowerCase()).toContain("my cue");
    expect(s?.toLowerCase()).toContain("my spot");
  });
});
