// Mock exam — 50 items, 45-minute countdown, exact ASA scoring.
// See DESIGN_v3 §8.
//
// Stress mirroring (§8.3): timer always visible; final-5-minute audible tick;
// no pause; strict navigation (no back).
//
// Each answer is also a real ReviewEvent — the exam IS the most important
// review session, so it feeds FSRS.

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import { CATEGORY_LABELS, type Category } from "@/content/schema";
import { ITEMS, categoryOfItem, ruleById } from "@/content/bundle";
import { allReviews } from "@/db";
import { composeMockExam, truthOf } from "@/exam/compose";
import {
  DEFAULT_EXAM_LENGTH,
  PASS_THRESHOLD_MAX_PENALTIES,
  PASS_THRESHOLD_POINTS,
  scoreExam,
  type QuestionScore,
  type TickTriple,
} from "@/exam/scoring";
import { useStore } from "@/store";

const EXAM_DURATION_MS = 45 * 60 * 1000;
const FINAL_5MIN_MS = 5 * 60 * 1000;

type Phase = "lobby" | "running" | "results";

type Answer = {
  itemId: string;
  userTicks: TickTriple;
  truth: TickTriple;
  latencyMs: number;
};

export default function Mock() {
  const navigate = useNavigate();
  const memory = useStore((s) => s.memory);
  const startReview = useStore((s) => s.startReview);
  const finishSession = useStore((s) => s.finishSession);
  const recordReview = useStore((s) => s.recordReview);

  const [phase, setPhase] = useState<Phase>("lobby");
  const [items, setItems] = useState<typeof ITEMS>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [now, setNow] = useState<number>(Date.now());

  // Mirror of `answers` kept as a ref so async/timer code paths can always
  // read the latest list without closure staleness. This matters for the
  // very last card: if the user submits and then the timer fires (or they
  // click Finish) before React has re-rendered the parent, we still have
  // the new answer.
  const answersRef = useRef<Answer[]>([]);

  // Countdown timer.
  useEffect(() => {
    if (phase !== "running") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const remainingMs = phase === "running"
    ? Math.max(0, EXAM_DURATION_MS - (now - startedAt))
    : EXAM_DURATION_MS;

  // Auto-finish on timeout. Use the ref — `answers` in closure may be stale
  // if the user answered the last card moments before the clock hit zero.
  useEffect(() => {
    if (phase === "running" && remainingMs === 0) {
      void finalize(answersRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, phase]);

  const currentItem = items[idx];
  const isLast = idx === items.length - 1;

  async function begin() {
    const reviews = await allReviews();
    const composed = composeMockExam(
      ITEMS,
      categoryOfItem,
      reviews,
      memory,
      Date.now(),
      DEFAULT_EXAM_LENGTH,
    );
    setItems(composed);
    setIdx(0);
    setAnswers([]);
    answersRef.current = [];
    setStartedAt(Date.now());
    setNow(Date.now());
    await startReview("mock");
    setPhase("running");
  }

  async function finalize(finalAnswers: Answer[]) {
    if (phase === "results") return;
    setPhase("results");

    // Record each answer as a normal ReviewEvent so FSRS state advances.
    for (const a of finalAnswers) {
      try {
        await recordReview(
          a.itemId,
          { userTicks: a.userTicks, truth: a.truth, latencyMs: a.latencyMs },
          {},
        );
      } catch {
        /* ignore — session may have ended */
      }
    }
    await finishSession();

    // Append to mock history (small, lives in localStorage).
    const result = scoreExam(finalAnswers);
    try {
      const raw = localStorage.getItem("mockHistory");
      const prev = raw ? (JSON.parse(raw) as Array<unknown>) : [];
      const next = [
        { points: result.points, passed: result.passed, at: Date.now() },
        ...prev,
      ].slice(0, 30);
      localStorage.setItem("mockHistory", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  // ---------- render ----------

  if (phase === "lobby") {
    return <Lobby onBegin={begin} onCancel={() => navigate("/")} />;
  }

  if (phase === "results") {
    return (
      <Results
        items={items}
        answers={answers}
        onDone={() => navigate("/")}
        onDrillRule={(ruleId: string) => navigate(`/teach/${encodeURIComponent(ruleId)}`)}
      />
    );
  }

  if (!currentItem) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <ExamTimer
        remainingMs={remainingMs}
        progress={`${idx + 1} / ${items.length}`}
      />
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
          hideRationale
          onSubmit={async (sub) => {
            // Record locally; do not show feedback.
            const next: Answer = {
              itemId: currentItem.id,
              userTicks: sub.grading.userTicks,
              truth: sub.grading.truth,
              latencyMs: sub.grading.latencyMs,
            };
            setAnswers((arr) => {
              const updated = [...arr, next];
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
      {remainingMs <= FINAL_5MIN_MS && remainingMs > 0 && <FinalMinutesIndicator />}
    </div>
  );
}

function Lobby({ onBegin, onCancel }: { onBegin: () => void; onCancel: () => void }) {
  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold">Mock exam</h1>
      <p className="mt-2 text-sm text-slate-400">
        50 questions · 45 minutes · pass at {PASS_THRESHOLD_POINTS} points and
        ≤{PASS_THRESHOLD_MAX_PENALTIES} penalties.
      </p>
      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
        <p className="font-medium">Strict mode</p>
        <p className="text-slate-400">
          No pause, no back-navigation, no rationale until results. Designed
          to mirror exam conditions.
        </p>
      </div>
      <button
        className="mt-6 w-full rounded-xl bg-sky-600 px-4 py-4 text-base font-semibold"
        onClick={onBegin}
      >
        Begin
      </button>
      <button
        className="mt-2 w-full rounded-xl bg-slate-800 px-4 py-3 text-sm"
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
      className={`safe-top sticky top-0 z-10 border-b border-slate-800 px-4 py-2 text-sm ${
        isLate ? "bg-red-950 text-red-200" : "bg-slate-900 text-slate-200"
      }`}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between">
        <span>{progress}</span>
        <span className="font-mono tabular-nums">
          {m}:{s.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function FinalMinutesIndicator() {
  // Visual "stress mirror" — subtle pulsing red border.
  return (
    <div className="pointer-events-none fixed inset-0 ring-4 ring-inset ring-red-700/40" />
  );
}

function Results({
  items,
  answers,
  onDone,
  onDrillRule,
}: {
  items: typeof ITEMS;
  answers: Answer[];
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

// Use the truthOf helper to keep the import tidy (and silence unused-warn if we ever stop using it).
void truthOf;
