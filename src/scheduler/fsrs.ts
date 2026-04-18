// Thin wrapper around ts-fsrs. We keep our own MemoryState shape so the
// persistence layer never sees library-specific types — that way we can swap
// SRS engines later without an IndexedDB migration.

import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  State,
  type Card,
  type Grade as FsrsGrade,
} from "ts-fsrs";
import type { FsrsState, Grade, MemoryState } from "@/db/types";

export type FsrsParams = ReturnType<typeof generatorParameters>;

export function makeScheduler(retentionTarget = 0.90) {
  const params: FsrsParams = generatorParameters({
    request_retention: retentionTarget,
    maximum_interval: 365,
    enable_fuzz: true,
    enable_short_term: true,
  });
  return fsrs(params);
}

const STATE_MAP: Record<State, FsrsState> = {
  [State.New]: "new",
  [State.Learning]: "learning",
  [State.Review]: "review",
  [State.Relearning]: "relearning",
};
const REVERSE_STATE: Record<FsrsState, State> = {
  new: State.New,
  learning: State.Learning,
  review: State.Review,
  relearning: State.Relearning,
};

const GRADE_MAP: Record<Grade, Rating> = {
  1: Rating.Again,
  2: Rating.Hard,
  3: Rating.Good,
  4: Rating.Easy,
};

export function emptyMemory(itemId: string, now = Date.now()): MemoryState {
  const card = createEmptyCard(new Date(now));
  return fromCard(itemId, card);
}

function fromCard(itemId: string, card: Card): MemoryState {
  return {
    itemId,
    stability: card.stability,
    difficulty: card.difficulty,
    lastReview: card.last_review ? card.last_review.getTime() : 0,
    due: card.due.getTime(),
    reps: card.reps,
    lapses: card.lapses,
    state: STATE_MAP[card.state],
  };
}

function toCard(m: MemoryState): Card {
  return {
    due: new Date(m.due),
    stability: m.stability,
    difficulty: m.difficulty,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: m.reps,
    lapses: m.lapses,
    state: REVERSE_STATE[m.state],
    last_review: m.lastReview ? new Date(m.lastReview) : undefined,
  } as Card;
}

/** Apply a grade to a memory-state and return the new state. */
export function applyGrade(
  scheduler: ReturnType<typeof fsrs>,
  current: MemoryState,
  grade: Grade,
  when = Date.now(),
): MemoryState {
  // ts-fsrs's `Grade` type excludes Rating.Manual; our four Ratings are all
  // valid Grades, so the cast is safe.
  const rating = GRADE_MAP[grade] as unknown as FsrsGrade;
  const result = scheduler.next(toCard(current), new Date(when), rating);
  return fromCard(current.itemId, result.card);
}

/**
 * Has this item graduated? "Graduated" = reps≥3 AND state ∈ {review} AND no
 * recent lapse within the last 7d. Used by the readiness badge (§9).
 */
export function isGraduated(m: MemoryState, now = Date.now()): boolean {
  if (m.reps < 3) return false;
  if (m.state !== "review") return false;
  if (m.lapses === 0) return true;
  // crude "recent lapse" proxy — state is "review" so last lapse is implicit,
  // and we just check lastReview isn't within the very recent past.
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  return now - m.lastReview > sevenDays;
}
