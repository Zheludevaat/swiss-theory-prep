// Implementation-intentions ("If-then plans", Gollwitzer 1999) helper.
//
// Audit §3.2 calls for a first-run onboarding that asks the user to bind a
// specific situational cue to the action of opening the app and doing a
// review. Once bound, Today surfaces a gentle one-line reminder whenever
// the user enters the cue window without already having done a session
// that day — without nagging or gamifying (neither of which helps long-run
// adherence, per Hagger & Luszczynska 2014).
//
// Scope of this module: pure functions + typed options. No React. Today.tsx
// and Settings.tsx do the rendering and persistence.

/** The cue stems the user picks from. Raw strings keep settings round-trip
 *  safe across versions — if we add or reorder cues later, unknown values
 *  just fall through to a "no window" state, which is the correct failure
 *  mode (don't silently nag the user). */
export const IF_THEN_CUES = [
  "after morning coffee",
  "during lunch break",
  "on the evening commute",
  "before bed",
  "other",
] as const;

export type IfThenCue = (typeof IF_THEN_CUES)[number];

export const IF_THEN_PLACES = [
  "at the kitchen table",
  "at my desk",
  "on the tram / train",
  "on the couch",
  "other",
] as const;

export type IfThenPlace = (typeof IF_THEN_PLACES)[number];

/** Hours (local time, 0–23) at which each named cue is considered "active."
 *  The interval is left-closed, right-open: [start, end). `bed` spans
 *  midnight, so we model it as two disjoint ranges. */
type CueWindow = Array<[number, number]>;

const CUE_WINDOWS: Record<Exclude<IfThenCue, "other">, CueWindow> = {
  "after morning coffee": [[6, 11]],
  "during lunch break": [[11, 14]],
  "on the evening commute": [[17, 20]],
  "before bed": [
    [21, 24],
    [0, 2],
  ],
};

/** True if `date` falls in the cue's window. "other" never matches — we
 *  have no way to know when the user's custom cue fires, so we don't
 *  show the tile for it. */
export function isCueWindow(cue: string | undefined, date = new Date()): boolean {
  if (!cue) return false;
  if (cue === "other" || !(cue in CUE_WINDOWS)) return false;
  const windows = CUE_WINDOWS[cue as Exclude<IfThenCue, "other">];
  const h = date.getHours();
  return windows.some(([start, end]) => h >= start && h < end);
}

/** A short, human-readable phrase for the tile. Keeps the copy in one place
 *  so the onboarding and reminder stay in sync if we rewrite wording. */
export function renderIfThenSentence(
  cue: string | undefined,
  place: string | undefined,
): string | undefined {
  if (!cue) return undefined;
  // Users who picked "other" for cue or place still get a placeholder that
  // reflects what *they* wrote, not a generic stem — otherwise the plan
  // reads as someone else's.
  const cueText = cue === "other" ? "my cue" : cue;
  const placeText = place ? (place === "other" ? "my spot" : place) : undefined;
  return placeText
    ? `When I'm ${cueText} ${placeText}, I'll open the app and run a review.`
    : `When I'm ${cueText}, I'll open the app and run a review.`;
}

/** Decide whether the Today cue tile should be shown.
 *
 *  Rule: show when a cue is bound, the current time is in its window, and
 *  the user hasn't finished a session in the last 16 hours. The 16-hour
 *  threshold is generous enough to skip nagging a user who just finished
 *  their morning session and is opening the app again at lunch.
 */
export function shouldShowCueTile(args: {
  cue?: string;
  lastSessionEndedAt?: number;
  now?: number;
}): boolean {
  const { cue, lastSessionEndedAt, now = Date.now() } = args;
  if (!isCueWindow(cue, new Date(now))) return false;
  if (lastSessionEndedAt !== undefined) {
    const SIXTEEN_HOURS = 16 * 60 * 60 * 1000;
    if (now - lastSessionEndedAt < SIXTEEN_HOURS) return false;
  }
  return true;
}
