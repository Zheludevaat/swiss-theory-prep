import { describe, expect, it } from "vitest";
import { FAST_LATENCY_MS, gradeAnswer } from "@/scheduler/grading";

describe("gradeAnswer", () => {
  it("exact match fast → Easy (4)", () => {
    const r = gradeAnswer({
      userTicks: [true, false, true],
      truth: [true, false, true],
      latencyMs: 2_000,
    });
    expect(r.grade).toBe(4);
    expect(r.correct).toBe(true);
    expect(r.partiallyCorrect).toBe(false);
    expect(r.matched).toBe(3);
  });

  it("exact match slow → Good (3)", () => {
    const r = gradeAnswer({
      userTicks: [true, false, true],
      truth: [true, false, true],
      latencyMs: FAST_LATENCY_MS + 1,
    });
    expect(r.grade).toBe(3);
  });

  it("one wrong option → Hard (2) when any truth matched", () => {
    const r = gradeAnswer({
      userTicks: [true, true, false],
      truth: [true, false, true],
      latencyMs: 5_000,
    });
    expect(r.grade).toBe(2);
    expect(r.partiallyCorrect).toBe(true);
  });

  it("no correct options ticked → Again (1)", () => {
    const r = gradeAnswer({
      userTicks: [false, true, false],
      truth: [true, false, true],
      latencyMs: 5_000,
    });
    expect(r.grade).toBe(1);
    expect(r.correct).toBe(false);
    expect(r.partiallyCorrect).toBe(false);
  });
});
