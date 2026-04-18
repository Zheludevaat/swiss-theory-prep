import { describe, expect, it } from "vitest";
import {
  PASS_THRESHOLD_MAX_PENALTIES,
  PASS_THRESHOLD_POINTS,
  scoreExam,
  scoreQuestion,
} from "@/exam/scoring";

describe("scoreQuestion", () => {
  it("perfect match gives 3 points, 0 penalties", () => {
    const r = scoreQuestion([true, false, true], [true, false, true]);
    expect(r).toEqual({ points: 3, penalties: 0 });
  });

  it("one option wrong gives 2 points, 1 penalty", () => {
    const r = scoreQuestion([true, true, true], [true, false, true]);
    expect(r).toEqual({ points: 2, penalties: 1 });
  });

  it("all options wrong gives 0 points, 3 penalties", () => {
    const r = scoreQuestion([true, true, true], [false, false, false]);
    expect(r).toEqual({ points: 0, penalties: 3 });
  });

  it("all options blank when truth all blank gives 3/0", () => {
    const r = scoreQuestion([false, false, false], [false, false, false]);
    expect(r).toEqual({ points: 3, penalties: 0 });
  });
});

describe("scoreExam", () => {
  it("totals points, penalties, max", () => {
    const truth: [boolean, boolean, boolean] = [true, false, true];
    const answers = Array.from({ length: 50 }, () => ({
      userTicks: truth,
      truth,
    }));
    const r = scoreExam(answers);
    expect(r.points).toBe(150);
    expect(r.maxPoints).toBe(150);
    expect(r.penalties).toBe(0);
    expect(r.passed).toBe(true);
  });

  it("threshold: exactly 135 pts and 15 penalties passes", () => {
    // 45 perfect (135 pts), 5 with 0 pts and 3 penalties = 15 penalties.
    const perfect = { userTicks: [true, false, false] as [boolean, boolean, boolean],
                      truth: [true, false, false] as [boolean, boolean, boolean] };
    const wrong   = { userTicks: [false, true, true] as [boolean, boolean, boolean],
                      truth: [true, false, false] as [boolean, boolean, boolean] };
    const answers = [
      ...Array.from({ length: 45 }, () => perfect),
      ...Array.from({ length: 5 }, () => wrong),
    ];
    const r = scoreExam(answers);
    expect(r.points).toBe(135);
    expect(r.penalties).toBe(15);
    expect(r.passed).toBe(true);
  });

  it("136 pts but 16 penalties fails", () => {
    // Need to construct a scenario with 136 pts AND 16 penalties.
    // Each q has points + penalties = 3, so totals also sum to 150.
    // 136 pts → 14 penalties. That's not 16. So impossible to have 136/16.
    // Construct 134 pts / 16 penalties (clear failure on points).
    const perfect = { userTicks: [true, false, false] as [boolean, boolean, boolean],
                      truth: [true, false, false] as [boolean, boolean, boolean] };
    const wrong   = { userTicks: [false, true, true] as [boolean, boolean, boolean],
                      truth: [true, false, false] as [boolean, boolean, boolean] };
    const half    = { userTicks: [true, true, false] as [boolean, boolean, boolean],
                      truth: [true, false, false] as [boolean, boolean, boolean] };
    // 44 perfect (132) + 1 half (2) + 5 wrong (0) = 134 pts; penalties: 0+1+15=16
    const answers = [
      ...Array.from({ length: 44 }, () => perfect),
      half,
      ...Array.from({ length: 5 }, () => wrong),
    ];
    const r = scoreExam(answers);
    expect(r.points).toBe(134);
    expect(r.penalties).toBe(16);
    expect(r.passed).toBe(false);
  });

  it("pass thresholds match design", () => {
    expect(PASS_THRESHOLD_POINTS).toBe(135);
    expect(PASS_THRESHOLD_MAX_PENALTIES).toBe(15);
  });
});
