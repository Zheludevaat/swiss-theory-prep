// Mock exam — 50 items, 45-minute countdown, exact ASA scoring.
// See DESIGN_v3 §8 + FIX_PLAN Chunk 7.
//
// Stress mirroring (§8.3): timer always visible; final-5-minute audible tick;
// no pause; strict navigation (no back) in strict mode. Practice mode loosens
// navigation but still records answers as real ReviewEvents so FSRS advances.
//
// Visual: mock is intentionally different from review — a stone / serif theme
// plus a visible final-five-minute ring and audible 1 Hz beep. Lobby shows a
// summary block so the learner knows exactly what they are about to enter.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import { CATEGORY_LABELS, type Category } from "@/content/schema";
import { ITEMS, categoryOfItem, ruleById } from "@/content/bundle";
import { allReviews } from "@/db";
import type { MockResult } from "@/db/types";
import { composeMockExam } from "@/exam/compose";
import {
  DEFAULT_EXAM_LENGTH,
  PASS_THRESHOLD_MAX_PENALTIES,
  PASS_THRESHOLD_POINTS,
  scoreExam,
  type QuestionScore,
  type TickTriple,
} from "@/exam/scoring";
import { useStore } from "@/store";
import { uuid } from "@/lib/uuid";
import { daysUntil, fmtDate } from "@/lib/time";

const EXAM_DURATION_MS = 45 * 60 * 1000;
const FINAL_5MIN_MS = 5 * 60 * 1000;
const RECOVERY_KEY = "mockRecovery";

type Phase = "lobby" | "running" | "results";
type Mode = "strict" | "practice";

type Answer = {
  itemId: string;
  userTicks: TickTriple;
  truth: TickTriple;
  latencyMs: number;
};

type RecoverySlot = {
  savedAt: number;
  itemIds: string[];
  answers: Answer[];
  mode: Mode;
};

export default function Mock() {
  const navigate = useNavigate();
  const memory = useStore((s) => s.memory);
  const settings = useStore((s) => s.settings);
  const saveSettings = useStore((s) => s.saveSettings);
  const startReview = useStore((s) => s.startReview);
  const finishSession = useStore((s) => s.finishSession);
  const recordReview = useStore((s) => s.recordReview);
  const recordMockResult = useStore((s) => s.recordMockResult);
  const mockHistory = useStore((s) => s.mockHistory);

  const [phase, setPhase] = useState<Phase>("lobby");
  const [mode, setMode] = useState<Mode>("strict");
  const [items, setItems] = useState<typeof ITEMS>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());
  const [fellBackToRecentlySeen, setFellBackToRecentlySeen] = useState(false);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);

  // Mirror of `answers` kept as a ref so async/timer code paths can always
  // read the latest list without closure staleness. This matters for the
  // very last card: if the user submits and then the timer fires (or they
  // click Finish) before React has re-rendered the parent, we still have
  // the new answer.
  const answersRef = useRef<Answer[]>([]);
  const itemsRef = useRef<typeof ITEMS>([]);
  const modeRef = useRef<Mode>("strict");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastBeepSecondRef = useRef<number>(-1);

  // Countdown timer — strict and practice both tick.
  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const remainingMs = phase === "running"
    ? Math.max(0, EXAM_DURATION_MS - (now - startedAt))
    : EXAM_DURATION_MS;

  // Audible 1Hz tick in final 5 minutes. Plays at most once per wall-clock
  // second; stays silent if the user disabled it in settings.
  useEffect(() => {
    if (phase !== "running") return;
    if (!settings.mockAudibleTick) return;
    if (remainingMs > FINAL_5MIN_MS || remainingMs <= 0) return;
    const secondsLeft = Math.ceil(remainingMs / 1000);
    if (secondsLeft === lastBeepSecondRef.current) return;
    lastBeepSecondRef.current = secondsLeft;
    playShortBeep(audioCtxRef.current);
  }, [remainingMs, phase, settings.mockAudibleTick]);

  // Close the AudioContext when we leave the running phase.
  useEffect(() => {
    if (phase !== "running" && audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  }, [phase]);

  const finalize = useCallback(
    async (finalAnswers: Answer[]) => {
      if (phase === "results") return;
      setPhase("results");

      // Record each answer as a normal ReviewEvent so FSRS state advances.
      // Collect failures so we can persist a recovery slot and warn the user
      // rather than silently losing work.
      const failed: Answer[] = [];
      for (const a of finalAnswers) {
        try {
          await recordReview(
            a.itemId,
            { userTicks: a.userTicks, truth: a.truth, latencyMs: a.latencyMs },
            {},
          );
        } catch (err) {
          console.error("mock: recordReview failed", err);
          failed.push(a);
        }
      }
      try {
        await finishSession();
      } catch (err) {
        console.error("mock: finishSession failed", err);
      }

      // Persist a full mock result to IDB via the store. Old localStorage
      // entries were migrated on init; this is the sole write path.
      const result = scoreExam(finalAnswers);
      const persisted: MockResult = {
        id: uuid(),
        at: Date.now(),
        points: result.points,
        maxPoints: result.maxPoints,
        penalties: result.penalties,
        passed: result.passed,
        mode: modeRef.current,
      };
      try {
        await recordMockResult(persisted);
      } catch (err) {
        console.error("mock: recordMockResult failed", err);
      }

      if (failed.length > 0) {
        // Persist a recovery slot so the user can retry or at least see the
        // work they did. Surfaces via lobby banner on next entry.
        try {
          const slot: RecoverySlot = {
            savedAt: Date.now(),
            itemIds: itemsRef.current.map((i) => i.id),
            answers: finalAnswers,
            mode: modeRef.current,
          };
          localStorage.setItem(RECOVERY_KEY, JSON.stringify(slot));
        } catch {
          /* ignore — recovery is best-effort */
        }
        setFinalizeError(
          `${failed.length} answer(s) could not be saved to review history. Your score below is still correct; a recovery snapshot was saved.`,
        );
      } else {
        // Clean up any stale recovery slot on successful finalize.
        try {
          localStorage.removeItem(RECOVERY_KEY);
        } catch {
          /* ignore */
        }
      }
    },
    [phase, recordReview, finishSession, recordMockResult],
  );

  // Auto-finish on timeout. Use the ref — `answers` in closure may be stale
  // if the user answered the last card moments before the clock hit zero.
  useEffect(() => {
    if (phase === "running" && remainingMs === 0) {
      void finalize(answersRef.current);
    }
  }, [remainingMs, phase, finalize]);

  const currentItem = items[idx];
  const isLast = idx === items.length - 1;

  async function begin(selectedMode: Mode) {
    const reviews = await allReviews();
    const composed = composeMockExam(
      ITEMS,
      categoryOfItem,
      reviews,
      memory,
      Date.now(),
      DEFAULT_EXAM_LENGTH,
    );
    setItems(composed.items);
    itemsRef.current = composed.items;
    setFellBackToRecentlySeen(composed.fellBackToRecentlySeen);
    setMode(selectedMode);
    modeRef.current = selectedMode;
    setIdx(0);
    setAnswers([]);
    answersRef.current = [];
    setStartedAt(Date.now());
    setNow(Date.now());
    setFinalizeError(null);

    // AudioContext can only be created inside a user gesture. Begin is a
    // user gesture, so we create it here — subsequent beeps reuse it.
    if (settings.mockAudibleTick && !audioCtxRef.current) {
      try {
        const AC: typeof AudioContext | undefined =
          window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        audioCtxRef.current = AC ? new AC() : null;
      } catch {
        audioCtxRef.current = null;
      }
    }

    await startReview("mock");
    setPhase("running");
  }

  // ---------- render ----------

  if (phase === "lobby") {
    return (
      <Lobby
        settings={settings}
        memory={memory}
        mockHistory={mockHistory}
        fellBackToRecentlySeen={fellBackToRecentlySeen}
        onBegin={begin}
        onCancel={() => navigate("/")}
        onToggleAudibleTick={async (v) => {
          await saveSettings({ mockAudibleTick: v });
        }}
      />
    );
  }

  if (phase === "results") {
    return (
      <Results
        items={items}
        answers={answers}
        finalizeError={finalizeError}
        onDone={() => navigate("/")}
        onDrillRule={(ruleId: string) => navigate(`/teach/${encodeURIComponent(ruleId)}`)}
      />
    );
  }

  if (!currentItem) {
    return null;
  }

  const currentAnswer = answers[idx];
  const answeredCount = answers.length;
  const runningScore = mode === "practice" ? scoreExam(answers) : null;

  return (
    <div className="flex h-full flex-col bg-stone-100 font-serif text-stone-900">
      <ExamTimer
        remainingMs={remainingMs}
        progress={`${idx + 1} / ${items.length}`}
      />
      {runningScore && (
        <div className="border-b border-stone-300 bg-stone-200/70 px-4 py-1 text-xs">
          <div className="mx-auto flex max-w-lg items-center justify-between text-stone-700">
            <span>Practice mode</span>
            <span className="tabular-nums">
              {runningScore.points} pts · {answeredCount} answered · {runningScore.penalties} penalties
            </span>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <Card
          key={currentItem.id}
          item={currentItem}
          rules={
            currentItem.ruleIds
              .map((rid) => ruleById.get(rid))
              .filter(Boolean) as never
          }
          counter=""
          minimalActions
          hideRationale={mode === "strict"}
          onSubmit={async (sub) => {
            // Record locally.
            const next: Answer = {
              itemId: currentItem.id,
              userTicks: sub.grading.userTicks,
              truth: sub.grading.truth,
              latencyMs: sub.grading.latencyMs,
            };
            setAnswers((arr) => {
              // In practice mode we may revisit items — overwrite rather
              // than append if the index already has an answer.
              const updated = [...arr];
              if (mode === "practice" && idx < updated.length) {
                updated[idx] = next;
              } else {
                updated.push(next);
              }
              answersRef.current = updated;
              return updated;
            });
          }}
          onContinue={async () => {
            if (isLast) {
              // Read from the ref so the just-submitted last answer is
              // never lost to a stale closure.
              await finalize(answersRef.current);
            } else {
              setIdx((i) => i + 1);
            }
          }}
          isLast={isLast}
        />
      </div>
      {mode === "practice" && (
        <PracticeNav
          idx={idx}
          total={items.length}
          currentAnswered={!!currentAnswer}
          onPrev={() => setIdx((i) => Math.max(0, i - 1))}
          onNext={() => setIdx((i) => Math.min(items.length - 1, i + 1))}
          onFinish={() => void finalize(answersRef.current)}
        />
      )}
      {remainingMs <= FINAL_5MIN_MS && remainingMs > 0 && <FinalMinutesIndicator />}
    </div>
  );
}

function Lobby({
  settings,
  memory,
  mockHistory,
  fellBackToRecentlySeen,
  onBegin,
  onCancel,
  onToggleAudibleTick,
}: {
  settings: ReturnType<typeof useStore.getState>["settings"];
  memory: Map<string, { due: number; reps: number }>;
  mockHistory: MockResult[];
  fellBackToRecentlySeen: boolean;
  onBegin: (mode: Mode) => void;
  onCancel: () => void;
  onToggleAudibleTick: (v: boolean) => Promise<void>;
}) {
  const [mode, setMode] = useState<Mode>("strict");
  const [recovery, setRecovery] = useState<RecoverySlot | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECOVERY_KEY);
      if (raw) setRecovery(JSON.parse(raw) as RecoverySlot);
    } catch {
      /* ignore */
    }
  }, []);

  const examIn = daysUntil(settings.examDate);
  const recentMocks = useMemo(() => mockHistory.slice(0, 5), [mockHistory]);

  // Memory size tells us the catalog we're drawing from is meaningfully sized.
  const memorySize = memory.size;

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      <header>
        <h1 className="text-2xl font-semibold">Mock exam</h1>
        <p className="mt-1 text-sm text-slate-400">
          50 questions · 45 minutes · pass at {PASS_THRESHOLD_POINTS} points and
          ≤{PASS_THRESHOLD_MAX_PENALTIES} penalties.
        </p>
      </header>

      {recovery && (
        <section className="rounded-2xl border border-amber-700/50 bg-amber-950/30 p-4 text-sm text-amber-200">
          <div className="font-medium">Previous session did not finalise cleanly</div>
          <div className="mt-1 text-xs text-amber-200/80">
            {recovery.answers.length} of {recovery.itemIds.length} answers are saved from{" "}
            {fmtDate(recovery.savedAt)}. They remain visible in Stats; delete the snapshot once you've checked.
          </div>
          <button
            className="mt-2 rounded-lg bg-amber-800/60 px-3 py-1 text-xs"
            onClick={() => {
              try {
                localStorage.removeItem(RECOVERY_KEY);
              } catch {
                /* ignore */
              }
              setRecovery(null);
            }}
          >
            Dismiss
          </button>
        </section>
      )}

      {fellBackToRecentlySeen && (
        <section className="rounded-2xl border border-sky-700/50 bg-sky-950/30 p-3 text-xs text-sky-200">
          A previous mock drew some items you saw in the last 48h because the
          eligible pool was exhausted. Add more content or take fewer mocks to
          let the cool-down work.
        </section>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm">
        <h2 className="mb-2 text-xs uppercase tracking-wide text-slate-400">
          Your settings
        </h2>
        <dl className="grid grid-cols-2 gap-y-1 text-slate-300">
          <dt className="text-slate-400">Exam date</dt>
          <dd>
            {settings.examDate ?? "—"}
            {examIn !== undefined && examIn >= 0 ? ` (in ${examIn}d)` : ""}
          </dd>
          <dt className="text-slate-400">Retention target</dt>
          <dd>{Math.round(settings.retentionTarget * 100)}%</dd>
          <dt className="text-slate-400">Catalog coverage</dt>
          <dd>{memorySize} items reviewed</dd>
        </dl>
      </section>

      {recentMocks.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm">
          <h2 className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            Last {recentMocks.length} mock{recentMocks.length === 1 ? "" : "s"}
          </h2>
          <ul className="space-y-1 text-slate-300">
            {recentMocks.map((r) => (
              <li key={r.at} className="flex items-center justify-between">
                <span className="text-slate-400">{fmtDate(r.at)}</span>
                <span>
                  {r.points} pts ·{" "}
                  <span className={r.passed ? "text-green-400" : "text-red-400"}>
                    {r.passed ? "Pass" : "Fail"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="text-xs uppercase tracking-wide text-slate-400">Mode</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            className={`rounded-xl px-3 py-3 text-sm ${
              mode === "strict"
                ? "bg-sky-600 text-white"
                : "bg-slate-800 text-slate-300"
            }`}
            onClick={() => setMode("strict")}
          >
            <div className="font-medium">Strict</div>
            <div className="text-xs opacity-80">Exam conditions · no back</div>
          </button>
          <button
            className={`rounded-xl px-3 py-3 text-sm ${
              mode === "practice"
                ? "bg-sky-600 text-white"
                : "bg-slate-800 text-slate-300"
            }`}
            onClick={() => setMode("practice")}
          >
            <div className="font-medium">Practice</div>
            <div className="text-xs opacity-80">Revisit · running score</div>
          </button>
        </div>
        <label className="mt-3 flex items-center justify-between text-sm text-slate-300">
          <span>Audible 1 Hz tick in final 5 minutes</span>
          <input
            type="checkbox"
            checked={settings.mockAudibleTick}
            onChange={(e) => void onToggleAudibleTick(e.target.checked)}
            className="h-4 w-4"
          />
        </label>
      </section>

      <button
        className="w-full rounded-xl bg-sky-600 px-4 py-4 text-base font-semibold"
        onClick={() => onBegin(mode)}
      >
        Begin {mode === "strict" ? "strict" : "practice"} mock
      </button>
      <button
        className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

function ExamTimer({
  remainingMs,
  progress,
}: {
  remainingMs: number;
  progress: string;
}) {
  const m = Math.floor(remainingMs / 60_000);
  const s = Math.floor((remainingMs % 60_000) / 1_000);
  const isLate = remainingMs <= FINAL_5MIN_MS;
  return (
    <div
      className={`safe-top sticky top-0 z-10 border-b px-4 py-2 text-sm ${
        isLate
          ? "border-red-700/40 bg-red-100 text-red-900"
          : "border-stone-300 bg-stone-50 text-stone-800"
      }`}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <span className="tabular-nums">{progress}</span>
        <span className="font-mono text-base font-semibold tabular-nums">
          {m}:{s.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function PracticeNav({
  idx,
  total,
  currentAnswered,
  onPrev,
  onNext,
  onFinish,
}: {
  idx: number;
  total: number;
  currentAnswered: boolean;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="safe-bottom border-t border-stone-300 bg-stone-50 px-4 py-2">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
        <button
          className="rounded-lg bg-stone-200 px-3 py-2 text-sm disabled:opacity-40"
          onClick={onPrev}
          disabled={idx === 0}
        >
          ← Previous
        </button>
        <button
          className="rounded-lg bg-stone-200 px-3 py-2 text-sm disabled:opacity-40"
          onClick={onNext}
          disabled={idx === total - 1}
        >
          Skip →
        </button>
        <button
          className="rounded-lg bg-stone-800 px-3 py-2 text-sm text-stone-100 disabled:opacity-40"
          onClick={onFinish}
          disabled={!currentAnswered && idx === total - 1}
        >
          Finish
        </button>
      </div>
    </div>
  );
}

function FinalMinutesIndicator() {
  // Visual "stress mirror" — subtle pulsing red border. Works in both light
  // and dark variants of the running view.
  return (
    <div className="pointer-events-none fixed inset-0 ring-4 ring-inset ring-red-700/40" />
  );
}

function Results({
  items,
  answers,
  finalizeError,
  onDone,
  onDrillRule,
}: {
  items: typeof ITEMS;
  answers: Answer[];
  finalizeError: string | null;
  onDone: () => void;
  onDrillRule: (ruleId: string) => void;
}) {
  const result = scoreExam(answers);
  const perCategory = useMemo(() => {
    const buckets = new Map<Category, { points: number; max: number; n: number }>();
    answers.forEach((_a, i) => {
      const it = items[i];
      if (!it) return;
      const cat = categoryOfItem(it);
      if (!cat) return;
      const score: QuestionScore = result.perQuestion[i] ?? { points: 0, penalties: 0 };
      const cur = buckets.get(cat) ?? { points: 0, max: 0, n: 0 };
      cur.points += score.points;
      cur.max += 3;
      cur.n += 1;
      buckets.set(cat, cur);
    });
    return Array.from(buckets.entries());
  }, [answers, items, result]);

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      {finalizeError && (
        <section className="rounded-2xl border border-amber-700/50 bg-amber-950/30 p-3 text-sm text-amber-200">
          {finalizeError}
        </section>
      )}
      <div
        className={`rounded-2xl border p-4 ${
          result.passed
            ? "border-ok bg-green-950/40 text-green-200"
            : "border-bad bg-red-950/40 text-red-200"
        }`}
      >
        <div className="text-xs uppercase tracking-wide opacity-80">Mock exam</div>
        <div className="text-2xl font-semibold">
          {result.points} / {result.maxPoints} · {result.passed ? "Pass" : "Fail"}
        </div>
        <div className="text-sm opacity-90">{result.penalties} penalties</div>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-2 text-sm font-medium">By category</h2>
        <ul className="space-y-2">
          {perCategory.map(([cat, b]) => {
            const pct = b.max ? Math.round((b.points / b.max) * 100) : 0;
            return (
              <li key={cat} className="text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>{CATEGORY_LABELS[cat]}</span>
                  <span className="text-slate-400">
                    {b.points}/{b.max} ({b.n} q)
                  </span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded bg-slate-800">
                  <div
                    className="h-full rounded bg-sky-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-2 text-sm font-medium">Per question</h2>
        <ul className="divide-y divide-slate-800">
          {answers.map((a, i) => {
            const it = items[i];
            const score: QuestionScore = result.perQuestion[i] ?? { points: 0, penalties: 0 };
            if (!it) return null;
            const ruleId = it.ruleIds[0];
            return (
              <li key={a.itemId} className="py-2">
                <details>
                  <summary className="flex cursor-pointer items-center justify-between text-sm">
                    <span>
                      {i + 1}. {it.question.slice(0, 60)}
                      {it.question.length > 60 ? "…" : ""}
                    </span>
                    <span
                      className={`text-xs ${
                        score.points === 3
                          ? "text-ok"
                          : score.points === 0
                            ? "text-bad"
                            : "text-warn"
                      }`}
                    >
                      {score.points}/3
                    </span>
                  </summary>
                  <div className="mt-2 space-y-2 text-xs text-slate-300">
                    <p>{it.rationale}</p>
                    {ruleId && (
                      <button
                        className="rounded-lg bg-sky-700/50 px-3 py-1"
                        onClick={() => onDrillRule(ruleId)}
                      >
                        Drill this rule
                      </button>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </section>

      <button
        className="w-full rounded-xl bg-sky-600 px-4 py-3 text-base font-semibold"
        onClick={onDone}
      >
        Back to Today
      </button>
    </div>
  );
}

// ---- WebAudio helpers -------------------------------------------------------

function playShortBeep(ctx: AudioContext | null): void {
  if (!ctx) return;
  try {
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch {
    /* audio is best-effort; never let it crash the exam */
  }
}
