// User-state types kept separate from content schemas (which are versioned
// independently). See DESIGN_v3 §5.2 + §5.3.

export type Grade = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export type Confidence = 1 | 2 | 3 | 4;

export type SessionMode = "review" | "blast5" | "mock" | "teach" | "bedtime";

export type FsrsState = "new" | "learning" | "review" | "relearning";

export type MemoryState = {
  itemId: string;
  stability: number;
  difficulty: number;
  /** epoch ms; 0 if never reviewed */
  lastReview: number;
  /** epoch ms */
  due: number;
  reps: number;
  lapses: number;
  state: FsrsState;
};

export type ReviewEvent = {
  id: string;
  itemId: string;
  sessionId: string;
  /** epoch ms */
  timestamp: number;
  grade: Grade;
  /** every option matches truth */
  correct: boolean;
  /** at least one option matches but not all */
  partiallyCorrect: boolean;
  userTicks: [boolean, boolean, boolean];
  latencyMs: number;
  confidence?: Confidence;
  flaggedConfused?: boolean;
};

export type Session = {
  id: string;
  /** epoch ms */
  startedAt: number;
  /** epoch ms; undefined while running */
  endedAt?: number;
  mode: SessionMode;
  itemsReviewed: number;
  itemsCorrect: number;
};

export type Settings = {
  dailyTargetMinutes: number;     // default 15
  retentionTarget: number;        // default 0.90
  overlearnMastered: boolean;     // default true
  sampleConfidenceEvery: number;  // default 5; 0 disables
  useLLM: boolean;                // default false
  anthropicKey?: string;
  bedtimeReminder?: string;       // local-time HH:mm; undefined = off
  examDate?: string;              // YYYY-MM-DD; undefined = unset
};

export const DEFAULT_SETTINGS: Settings = {
  dailyTargetMinutes: 15,
  retentionTarget: 0.90,
  overlearnMastered: true,
  sampleConfidenceEvery: 5,
  useLLM: false,
};

export type FlaggedRule = {
  ruleId: string;
  /** epoch ms first flagged */
  flaggedAt: number;
  /** epoch ms most recently flagged */
  lastFlaggedAt: number;
  count: number;
};

export type Backup = {
  version: 1;
  exportedAt: number;
  memoryState: MemoryState[];
  reviews: ReviewEvent[];
  sessions: Session[];
  settings: Settings;
  flagged?: FlaggedRule[];
};
