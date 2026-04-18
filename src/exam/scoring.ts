// Exact ASA scoring for the Theorieprüfung. This file must stay correct — a
// bug here means we'd be training on a wrong objective. See DESIGN_v3 §8.2.
//
// Per-question: 1 point per option whose tick matches truth (max 3).
// Penalty = number of mismatched options. Pass: total ≥135, penalties ≤15.

export type TickTriple = [boolean, boolean, boolean];

export type QuestionScore = {
  points: number;   // 0–3
  penalties: number; // 0–3
};

export type ExamResult = {
  points: number;
  maxPoints: number;
  penalties: number;
  passed: boolean;
  perQuestion: QuestionScore[];
};

export const PASS_THRESHOLD_POINTS = 135;
export const PASS_THRESHOLD_MAX_PENALTIES = 15;
export const DEFAULT_EXAM_LENGTH = 50;

export function scoreQuestion(
  userTicks: TickTriple,
  truth: TickTriple,
): QuestionScore {
  let points = 0;
  let penalties = 0;
  for (let i = 0; i < 3; i++) {
    if (userTicks[i] === truth[i]) points += 1;
    else penalties += 1;
  }
  return { points, penalties };
}

export function scoreExam(
  answers: Array<{ userTicks: TickTriple; truth: TickTriple }>,
): ExamResult {
  const perQuestion: QuestionScore[] = [];
  let points = 0;
  let penalties = 0;
  for (const a of answers) {
    const s = scoreQuestion(a.userTicks, a.truth);
    perQuestion.push(s);
    points += s.points;
    penalties += s.penalties;
  }
  return {
    points,
    maxPoints: answers.length * 3,
    penalties,
    passed:
      points >= PASS_THRESHOLD_POINTS &&
      penalties <= PASS_THRESHOLD_MAX_PENALTIES,
    perQuestion,
  };
}
