// Today screen. Biggest button: Start review. The rest is honest reporting —
// readiness, due count, last session, streak. See DESIGN_v3 §10.1.

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITEMS, ruleById } from "@/content/bundle";
import { summarise, dailyCapacity, isInCatchUpMode, triage as triageFn, type PickContext } from "@/scheduler/pickNext";
import { selectLastSessionEndedAt, useStore } from "@/store";
import { computeStreak } from "@/lib/streak";
import { computeReadiness, READINESS_BLURB, READINESS_LABEL } from "@/lib/readiness";
import { fmtDate, fmtMinutes, daysUntil } from "@/lib/time";
import {
  IF_THEN_CUES,
  IF_THEN_PLACES,
  renderIfThenSentence,
  shouldShowCueTile,
} from "@/lib/ifThen";
import type { MemoryState } from "@/db/types";
import type { Session } from "@/db/types";

export default function Today() {
  const navigate = useNavigate();
  const memory = useStore((s) => s.memory);
  const settings = useStore((s) => s.settings);
  const catalog = useStore((s) => s.catalog);
  const recent = useStore((s) => s.recent);
  const flagged = useStore((s) => s.flagged);
  const reviews24h = useStore((s) => s.reviews24h);
  const lastSessionEndedAt = useStore(selectLastSessionEndedAt);
  const mockHistory = useStore((s) => s.mockHistory);

  const ctx: PickContext = useMemo(
    () => ({
      catalog,
      memory,
      settings,
      now: Date.now(),
      recentReviews: reviews24h,
      ...(lastSessionEndedAt !== undefined ? { lastSessionEndedAt } : {}),
    }),
    [catalog, memory, settings, reviews24h, lastSessionEndedAt],
  );
  const summary = useMemo(() => summarise(ctx), [ctx]);
  const triageState = useMemo(() => triageFn(summary, ctx), [summary, ctx]);
  const catchUp = useMemo(() => isInCatchUpMode(ctx), [ctx]);
  const cap = dailyCapacity(settings);

  // Mock history (last 10) sourced from the store, which mirrors IDB.
  const readiness = computeReadiness({
    items: ITEMS,
    memory,
    recentMocks: mockHistory.slice(0, 10),
  });
  const streak = computeStreak(recent);
  const lastSession = recent[0];
  const examIn = daysUntil(settings.examDate);

  // Audit §3.2 — if-then plan state. The onboarding card only appears once:
  // when the user hasn't bound a cue AND hasn't dismissed the prompt. Any
  // explicit answer (save or skip) flips a marker that hides it permanently.
  const showIfThenOnboarding =
    settings.ifThenCue === undefined && !settings.ifThenOnboardingSeen;
  const cueSentence = renderIfThenSentence(
    settings.ifThenCue,
    settings.ifThenPlace,
  );
  const showCueTile = shouldShowCueTile({
    ...(settings.ifThenCue !== undefined ? { cue: settings.ifThenCue } : {}),
    ...(lastSessionEndedAt !== undefined ? { lastSessionEndedAt } : {}),
  });

  // Audit §3.1 — exam-morning tile. Shown only on the exam date itself;
  // the route it links to (/exam-morning) handles reappraisal + expressive
  // writing + anchor retrieval in sequence.
  const showExamMorningTile = examIn === 0;

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      <header className="pt-2">
        <h1 className="text-2xl font-semibold">Swiss Theory Prep</h1>
        <p className="text-sm text-slate-400">
          {examIn !== undefined
            ? examIn >= 0
              ? `${examIn} day${examIn === 1 ? "" : "s"} until your exam`
              : "Exam date has passed — update in Settings"
            : "Set your exam date in Settings"}
        </p>
      </header>

      <ReadinessBadge readiness={readiness} />

      {/* Audit §3.1: exam-morning tile. Fires only on exam day; the route
          walks reappraisal → expressive writing → anchor retrieval. */}
      {showExamMorningTile && (
        <section className="rounded-2xl border border-sky-600/60 bg-sky-950/40 p-4 text-sm text-sky-100">
          <div className="text-xs uppercase tracking-wide text-sky-200/80">
            Exam day
          </div>
          <p className="mt-1 font-medium">Today's the day. Start here.</p>
          <p className="mt-1 text-xs text-sky-200/80">
            A short pre-exam walkthrough: reappraise the nerves, unload the
            worry, then re-read your anchors. About 15 minutes.
          </p>
          <button
            className="mt-3 min-h-[44px] w-full rounded-xl bg-sky-600 px-3 py-3 font-semibold"
            onClick={() => navigate("/exam-morning")}
          >
            Open exam-morning prep
          </button>
        </section>
      )}

      {/* Audit §3.2: first-run implementation-intention onboarding. */}
      {showIfThenOnboarding && <IfThenOnboardingCard />}

      {/* Audit §3.2: quiet reminder tile when the user enters their
          committed cue window without having done a session lately. */}
      {showCueTile && cueSentence && (
        <section className="rounded-2xl border border-emerald-700/40 bg-emerald-950/30 p-4 text-sm text-emerald-100">
          <div className="text-xs uppercase tracking-wide text-emerald-200/80">
            Your cue
          </div>
          <p className="mt-1">{cueSentence}</p>
          <p className="mt-1 text-xs text-emerald-200/70">
            Now's the window you picked. A quick review here is worth more
            than a long one later.
          </p>
        </section>
      )}

      <InstallPrompt />

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Due now
            </div>
            <div className="text-3xl font-semibold">{summary.totalDue}</div>
          </div>
          <div className="text-right text-xs text-slate-400">
            Capacity {cap}/day
          </div>
        </div>
        {catchUp && (
          <div className="mb-3 rounded-xl border border-sky-700/50 bg-sky-950/30 p-3 text-sm text-sky-200">
            <div className="font-medium">Welcome back — let's catch up first.</div>
            <div className="text-xs text-sky-200/80">
              It's been a few days. We'll clear the backlog before showing new
              items.
            </div>
          </div>
        )}
        {triageState.triaged && (
          <div className="mb-3 rounded-xl border border-amber-700/50 bg-amber-950/30 p-3 text-sm text-amber-200">
            <div className="font-medium">
              You have {summary.totalDue} due. Picking the {triageState.keep.size} that matter most.
            </div>
            <div className="text-xs text-amber-200/80">
              The rest will wait until tomorrow.
            </div>
          </div>
        )}
        <button
          className="w-full rounded-xl bg-sky-600 px-4 py-4 text-lg font-semibold"
          onClick={() => navigate("/review")}
        >
          Start review
        </button>
        <div className="mt-2 flex gap-2">
          <button
            className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm"
            onClick={() => navigate("/review?mode=blast5")}
          >
            5-minute blast
          </button>
          <button
            className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm"
            onClick={() => navigate("/mock")}
          >
            Take mock exam
          </button>
        </div>
      </section>

      {flagged.some((f) => f.count >= 3) && (
        <section className="rounded-2xl border border-amber-600/60 bg-amber-950/30 p-4 text-sm text-amber-100">
          <div className="text-xs uppercase tracking-wide text-amber-200/80">
            Drill this rule
          </div>
          <p className="mt-1 text-sm">
            You've flagged the same rule {Math.max(...flagged.map((f) => f.count))}+ times.
            A short teach-and-drill block usually unsticks it.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {flagged
              .filter((f) => f.count >= 3)
              .map((f) => {
                const r = ruleById.get(f.ruleId);
                return (
                  <button
                    key={f.ruleId}
                    className="rounded-lg bg-amber-800/60 px-3 py-1 text-xs text-amber-50"
                    onClick={() => navigate(`/teach/${encodeURIComponent(f.ruleId)}`)}
                  >
                    Teach · {r?.title ?? f.ruleId}
                  </button>
                );
              })}
          </div>
        </section>
      )}

      {flagged.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Flagged for teach
          </div>
          <ul className="space-y-2">
            {flagged.map((f) => {
              const r = ruleById.get(f.ruleId);
              return (
                <li
                  key={f.ruleId}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">
                    {r?.title ?? f.ruleId}
                    {f.count > 1 && (
                      <span className="ml-2 text-xs text-slate-400">×{f.count}</span>
                    )}
                  </span>
                  <button
                    className="rounded-lg bg-sky-700/50 px-3 py-1 text-xs"
                    onClick={() => navigate(`/teach/${encodeURIComponent(f.ruleId)}`)}
                  >
                    Teach
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <LastSessionCard last={lastSession} />

      <footer className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm">
        <span className="text-slate-400">Streak</span>
        <span className="font-medium">{streak} day{streak === 1 ? "" : "s"}</span>
      </footer>

      {/* Tiny dev help — shown once at N=0 so the first launch isn't stuck. */}
      {memory.size === 0 && (
        <FirstRunNudge memory={memory} />
      )}
    </div>
  );
}

function ReadinessBadge({ readiness }: { readiness: ReturnType<typeof computeReadiness> }) {
  const color =
    readiness === "comfortable"
      ? "border-ok bg-green-950/40 text-green-200"
      : readiness === "exam-worthy"
        ? "border-sky-500 bg-sky-950/40 text-sky-200"
        : readiness === "building"
          ? "border-warn bg-yellow-950/40 text-yellow-200"
          : "border-bad bg-red-950/40 text-red-200";
  return (
    <section className={`rounded-2xl border px-4 py-3 ${color}`}>
      <div className="text-xs uppercase tracking-wide opacity-80">Readiness</div>
      <div className="text-lg font-semibold">{READINESS_LABEL[readiness]}</div>
      <div className="text-xs opacity-80">{READINESS_BLURB[readiness]}</div>
    </section>
  );
}

function LastSessionCard({ last }: { last: Session | undefined }) {
  if (!last || !last.endedAt) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
        No previous sessions yet. Start your first review above.
      </section>
    );
  }
  const pct = last.itemsReviewed
    ? Math.round((last.itemsCorrect / last.itemsReviewed) * 100)
    : 0;
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-200">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        Last session
      </div>
      <div>
        {fmtDate(last.startedAt)} · {last.itemsReviewed} cards · {pct}% ·{" "}
        {fmtMinutes(last.endedAt - last.startedAt)}
      </div>
    </section>
  );
}

/**
 * D-7: dismissable "Add to Home Screen" onboarding card. The PWA works fine
 * from a tab, but installing it unlocks proper offline behavior + safe-area
 * handling on iOS. We show it exactly once per device unless dismissed; iOS
 * Safari doesn't fire beforeinstallprompt so we surface manual instructions.
 */
const INSTALL_DISMISSED_KEY = "installPromptDismissed";

function InstallPrompt() {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(INSTALL_DISMISSED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [showIos, setShowIos] = useState(false);
  const [installed, setInstalled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    // matchMedia display-mode: standalone is the best cross-browser signal.
    // navigator.standalone is iOS-specific fallback.
    const mm = window.matchMedia?.("(display-mode: standalone)");
    const iosStandalone = (navigator as unknown as { standalone?: boolean }).standalone;
    return !!(mm?.matches) || !!iosStandalone;
  });

  useEffect(() => {
    const mm = window.matchMedia?.("(display-mode: standalone)");
    if (!mm) return undefined;
    const onChange = (e: MediaQueryListEvent) => setInstalled(e.matches);
    mm.addEventListener?.("change", onChange);
    return () => mm.removeEventListener?.("change", onChange);
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
    } catch {
      /* non-fatal */
    }
    setDismissed(true);
  }

  if (dismissed || installed) return null;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-slate-200">Install for offline use</p>
          <p className="mt-1 text-slate-400">
            Add this app to your Home Screen so it works offline on the tram,
            in the car park, or anywhere without signal.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-300"
        >
          Dismiss
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setShowIos((v) => !v)}
          className="rounded-lg bg-slate-800 px-3 py-2 text-xs"
        >
          {showIos ? "Hide iOS steps" : "iOS / Safari steps"}
        </button>
      </div>
      {showIos && (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-slate-300">
          <li>Tap the Share button at the bottom of Safari.</li>
          <li>Scroll down and tap <b>Add to Home Screen</b>.</li>
          <li>Confirm with <b>Add</b>. The app launches from the new icon.</li>
        </ol>
      )}
    </section>
  );
}

function FirstRunNudge({ memory }: { memory: Map<string, MemoryState> }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
      <p className="font-medium">First run?</p>
      <p className="text-slate-400">
        Your catalog has {ITEMS.length} items. Tap <b>Start review</b> and a
        handful of new ones will appear. Memory store size: {memory.size}.
      </p>
    </section>
  );
}

/**
 * Audit §3.2 — implementation-intention onboarding card.
 *
 * Gollwitzer's original work showed that binding an abstract goal ("I want
 * to study more") to a concrete situational cue ("when I sit down at my
 * desk after lunch") roughly doubles follow-through. We ask for two stems:
 * the cue (temporal or activity-based) and the place (where the user
 * imagines themselves doing it). Two questions keeps the card under a
 * screen-height and respects the "onboarding cannot tax the learner" rule
 * from the audit. Both have an "other" escape hatch so users with
 * idiosyncratic routines aren't forced into our buckets.
 *
 * Persistence: writing either settings.ifThenCue (with a cue selection) or
 * settings.ifThenOnboardingSeen=true (skip) flips the gate. No re-prompt.
 */
function IfThenOnboardingCard() {
  const save = useStore((s) => s.saveSettings);
  const [cue, setCue] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [cueOther, setCueOther] = useState<string>("");
  const [placeOther, setPlaceOther] = useState<string>("");
  const [saving, setSaving] = useState(false);

  async function onSave() {
    const resolvedCue =
      cue === "other" ? cueOther.trim() || "other" : cue;
    const resolvedPlace =
      place === "other" ? placeOther.trim() || "other" : place;
    if (!resolvedCue) return;
    setSaving(true);
    await save({
      ifThenCue: resolvedCue,
      ...(resolvedPlace ? { ifThenPlace: resolvedPlace } : {}),
      ifThenOnboardingSeen: true,
    });
    setSaving(false);
  }

  async function onSkip() {
    await save({ ifThenOnboardingSeen: true });
  }

  const canSave = cue !== "" && (cue !== "other" || cueOther.trim() !== "");

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm">
      <div className="text-xs uppercase tracking-wide text-slate-400">
        One-time setup · 20 seconds
      </div>
      <p className="mt-1 font-medium text-slate-100">
        When do you want to review?
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Pinning a specific trigger roughly doubles follow-through. Pick the
        cue and place that fit your week — you can edit this later in
        Settings.
      </p>

      <fieldset className="mt-3">
        <legend className="mb-1 text-xs text-slate-400">Cue</legend>
        <div className="space-y-1">
          {IF_THEN_CUES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="ifThenCue"
                value={c}
                checked={cue === c}
                onChange={() => setCue(c)}
              />
              <span>{c === "other" ? "Other…" : c}</span>
            </label>
          ))}
          {cue === "other" && (
            <input
              type="text"
              placeholder="describe your cue"
              value={cueOther}
              onChange={(e) => setCueOther(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
          )}
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <legend className="mb-1 text-xs text-slate-400">Place (optional)</legend>
        <div className="space-y-1">
          {IF_THEN_PLACES.map((p) => (
            <label key={p} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="ifThenPlace"
                value={p}
                checked={place === p}
                onChange={() => setPlace(p)}
              />
              <span>{p === "other" ? "Other…" : p}</span>
            </label>
          ))}
          {place === "other" && (
            <input
              type="text"
              placeholder="describe the place"
              value={placeOther}
              onChange={(e) => setPlaceOther(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
          )}
        </div>
      </fieldset>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={!canSave || saving}
          className="min-h-[44px] flex-1 rounded-xl bg-sky-600 px-3 py-3 text-sm font-semibold disabled:opacity-50"
        >
          Save my plan
        </button>
        <button
          type="button"
          onClick={() => void onSkip()}
          className="min-h-[44px] rounded-xl bg-slate-800 px-3 py-3 text-sm"
        >
          Skip
        </button>
      </div>
    </section>
  );
}

