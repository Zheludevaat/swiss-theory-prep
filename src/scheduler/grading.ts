// Inferred grading — the user never picks Again/Hard/Good/Easy.
// We compute the FSRS grade from correctness + latency. See DESIGN_v3 §6.2.
//
// The latency cutoff (8s) matches the "fluent retrieval" notion in the
// design doc. Adjust here if real-use feedback says otherwise — keep the
// rule centralised so it stays one knob, not many.

import type { Grade } from "@/db/types";

export const FAST_LATENCY_MS = 8_000;

export type GradingInput = {
  userTicks: [boolean, boolean, boolean];
  truth: [boolean, boolean, boolean];
  latencyMs: number;
};

export type GradingResult = {
  grade: Grade;
  correct: boolean;
  partiallyCorrect: boolean;
  /** number of options matched out of 3 */
  matched: number;
  /** number of correct options the user selected */
  truePositives: number;
};

export function gradeAnswer(input: GradingInput): GradingResult {
  const { userTicks, truth, latencyMs } = input;

  let matched = 0;
  let truePositives = 0;
  let truthCount = 0;
  for (let i = 0; i < 3; i++) {
    if (truth[i]) truthCount += 1;
    if (userTicks[i] === truth[i]) matched += 1;
    if (truth[i] && userTicks[i]) truePositives += 1;
  }

  const correct = matched === 3;
  const partiallyCorrect = !correct && truePositives > 0;

  let grade: Grade;
  if (correct && latencyMs < FAST_LATENCY_MS) grade = 4; // Easy
  else if (correct) grade = 3;                            // Good
  else if (truePositives === 0 && truthCount > 0) grade = 1; // Again
  else grade = 2;                                          // Hard

  return { grade, correct, partiallyCorrect, matched, truePositives };
}
