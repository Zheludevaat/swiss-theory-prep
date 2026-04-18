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
  mockAudibleTick: boolean;       // final-5-minutes 1Hz beep; default true
};

export const DEFAULT_SETTINGS: Settings = {
  dailyTargetMinutes: 15,
  retentionTarget: 0.90,
  overlearnMastered: true,
  sampleConfidenceEvery: 5,
  useLLM: false,
  mockAudibleTick: true,
};

export type FlaggedRule = {
  ruleId: string;
  /** epoch ms first flagged */
  flaggedAt: number;
  /** epoch ms most recently flagged */
  lastFlaggedAt: number;
  count: number;
};

export type MockResult = {
  /** uuid */
  id: string;
  /** epoch ms */
  at: number;
  /** total points scored */
  points: number;
  /** 3 × number of items (usually 150) */
  maxPoints: number;
  /** total penalty count */
  penalties: number;
  /** derived flag: points ≥135 and penalties ≤15 */
  passed: boolean;
  mode: "strict" | "practice";
};

export type Backup = {
  version: 1 | 2;
  exportedAt: number;
  memoryState: MemoryState[];
  reviews: ReviewEvent[];
  sessions: Session[];
  settings: Settings;
  flagged?: FlaggedRule[];
  mockHistory?: MockResult[];
};

/**
 * E-4: lightweight error report. We store the last N of these in IDB so the
 * user can export them from Settings if something starts going wrong. Not
 * sent anywhere — strictly local and inspectable.
 */
export type ErrorReport = {
  /** uuid */
  id: string;
  /** epoch ms */
  at: number;
  /** "error" | "unhandledrejection" | "react" */
  kind: string;
  /** route hash at the time of capture, e.g. "#/review" */
  route: string;
  message: string;
  stack: string;
  /** browser userAgent at the time of capture, useful for triage */
  userAgent: string;
};
