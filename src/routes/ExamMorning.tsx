// Exam-morning prep walkthrough (Audit §3.1).
//
// Sequence, all in one screen but with three gated sub-views so the user
// can't skip ahead on autopilot:
//
//   1. Reappraisal — a short paragraph explaining that arousal ≠ anxiety
//      (Jamieson, Mendes & Nock 2013; "reappraise it as fuel"). No
//      interaction beyond "continue."
//
//   2. Expressive writing — a 10-minute un-pauseable timer over a
//      textarea. The user is invited to dump worries, doubts, and
//      ruminations on paper (Ramirez & Beilock 2011). Drafts persist to
//      localStorage so a mid-session reload doesn't wipe the pad, but
//      are cleared on completion — the point is the act of writing,
//      not the artefact.
//
//   3. Anchors — the three anchor statements the user pre-wrote (from
//      Settings). This is the retrieval moment: the point of writing
//      them earlier was that you read them under pressure now. If any
//      are missing we degrade gracefully — a blank anchor is obviously
//      less useful than a pre-written one, but better than blocking the
//      walkthrough.
//
// No timers, no surveys, no "how do you feel now" check-ins. The evidence
// base for each mechanism is the intervention, not the measurement.

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store";

type Step = "reappraisal" | "writing" | "anchors" | "done";

const WRITING_DURATION_MS = 10 * 60 * 1000;
const DRAFT_KEY = "examMorningDraft";
const DRAFT_START_KEY = "examMorningDraftStartedAt";

export default function ExamMorning() {
  const navigate = useNavigate();
  const settings = useStore((s) => s.settings);
  const [step, setStep] = useState<Step>("reappraisal");

  function advance(next: Step) {
    setStep(next);
    // Scroll to the top on step change so the user always sees the new
    // heading first rather than whatever the previous step pushed below.
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      <header>
        <button
          className="text-sm text-slate-400 hover:text-slate-200"
          onClick={() => navigate("/")}
          aria-label="Back to Today"
        >
          ← Today
        </button>
        <h1 className="mt-2 text-2xl font-semibold">Exam-morning prep</h1>
        <p className="text-sm text-slate-400">
          A 15-minute walkthrough before you leave for the test centre.
          Three parts. Do them in order.
        </p>
      </header>

      <StepIndicator step={step} />

      {step === "reappraisal" && (
        <ReappraisalStep onContinue={() => advance("writing")} />
      )}
      {step === "writing" && (
        <WritingStep onContinue={() => advance("anchors")} />
      )}
      {step === "anchors" && (
        <AnchorsStep
          settings={settings}
          onContinue={() => advance("done")}
        />
      )}
      {step === "done" && (
        <DoneStep onBack={() => navigate("/")} />
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const order: Step[] = ["reappraisal", "writing", "anchors", "done"];
  const current = order.indexOf(step);
  return (
    <div
      className="flex gap-2 text-[11px] uppercase tracking-wide text-slate-400"
      aria-label={`Step ${current + 1} of ${order.length}`}
    >
      {order.map((s, i) => (
        <div
          key={s}
          className={`flex-1 rounded-full border px-2 py-1 text-center ${
            i === current
              ? "border-sky-500 bg-sky-950/40 text-sky-200"
              : i < current
                ? "border-emerald-700/40 bg-emerald-950/30 text-emerald-300"
                : "border-slate-800 bg-slate-900"
          }`}
        >
          {s === "done" ? "Go" : s}
        </div>
      ))}
    </div>
  );
}

function ReappraisalStep({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm leading-relaxed text-slate-200">
      <h2 className="text-lg font-semibold text-slate-50">
        Your pulse is the resource, not the enemy.
      </h2>
      <p>
        The racing heart, the dry mouth, the restlessness — that's your
        body prepping blood and attention for something that matters. It's
        the same response that helps an athlete stick a landing. It is
        not a sign that something is wrong.
      </p>
      <p>
        People who <em>reinterpret</em> pre-exam arousal as fuel instead
        of fighting it consistently do better under pressure. You are not
        trying to feel nothing. You are trying to point what you already
        feel at the thing in front of you.
      </p>
      <p className="text-xs text-slate-400">
        Based on Jamieson et al., <em>Mind over matter</em> (2013).
      </p>
      <button
        className="mt-2 min-h-[44px] w-full rounded-xl bg-sky-600 px-3 py-3 font-semibold"
        onClick={onContinue}
      >
        I get it — continue
      </button>
    </section>
  );
}

function WritingStep({ onContinue }: { onContinue: () => void }) {
  // Restore any prior draft. If the timer already expired while the user
  // was away, we don't retroactively force them back into it — we just
  // show the pad with the old text and let them continue if they want.
  const [text, setText] = useState<string>(() => {
    try {
      return localStorage.getItem(DRAFT_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const startRef = useRef<number>(0);
  const [remainingMs, setRemainingMs] = useState<number>(WRITING_DURATION_MS);

  useEffect(() => {
    let start: number;
    try {
      const stored = localStorage.getItem(DRAFT_START_KEY);
      if (stored) {
        start = Number(stored);
        if (!Number.isFinite(start)) start = Date.now();
      } else {
        start = Date.now();
        localStorage.setItem(DRAFT_START_KEY, String(start));
      }
    } catch {
      start = Date.now();
    }
    startRef.current = start;

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      setRemainingMs(Math.max(0, WRITING_DURATION_MS - elapsed));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Persist the draft on every keystroke, but debounced via requestIdleCallback
  // when available so we don't thrash localStorage during a typing burst.
  useEffect(() => {
    const write = () => {
      try {
        localStorage.setItem(DRAFT_KEY, text);
      } catch {
        /* quota / private-mode — non-fatal */
      }
    };
    const ric = (
      window as Window & {
        requestIdleCallback?: (cb: () => void) => number;
      }
    ).requestIdleCallback;
    if (typeof ric === "function") {
      const id = ric(write);
      return () => {
        // cancelIdleCallback is optional; if the browser lacks it the
        // stale callback will fire harmlessly.
        const c = (
          window as Window & {
            cancelIdleCallback?: (id: number) => void;
          }
        ).cancelIdleCallback;
        if (typeof c === "function") c(id);
      };
    }
    const t = window.setTimeout(write, 250);
    return () => window.clearTimeout(t);
  }, [text]);

  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const done = remainingMs === 0;
  const ready = done && text.trim().length > 0;

  function handleContinue() {
    // Clear the draft on completion. The writing is the intervention; the
    // artefact isn't something we want sitting in localStorage forever.
    try {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(DRAFT_START_KEY);
    } catch {
      /* non-fatal */
    }
    onContinue();
  }

  return (
    <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-200">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-slate-50">
          Offload the worries — 10 minutes.
        </h2>
        <span
          className={`text-xs tabular-nums ${
            done ? "text-emerald-300" : "text-slate-400"
          }`}
          aria-live="polite"
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
      <p>
        Write whatever is cluttering your head about the exam — doubts,
        what-ifs, questions you're afraid you'll see. No structure, no
        editing. The point is to get them out so they stop hogging your
        working memory once the questions start.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start writing. Nobody reads this but you."
        rows={12}
        className="w-full resize-y rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-[13px] leading-snug"
      />
      <p className="text-xs text-slate-400">
        Based on Ramirez & Beilock, <em>Writing about testing worries
        boosts exam performance</em> (2011). The timer doesn't pause — keep
        the pen moving.
      </p>
      <button
        className="min-h-[44px] w-full rounded-xl bg-sky-600 px-3 py-3 font-semibold disabled:opacity-50"
        onClick={handleContinue}
        disabled={!ready}
        title={
          done
            ? text.trim().length === 0
              ? "Write at least a sentence before continuing."
              : "Continue"
            : "Keep writing — the timer must run out."
        }
      >
        {done
          ? text.trim().length === 0
            ? "Write something, then continue"
            : "Done — continue"
          : "Keep writing…"}
      </button>
    </section>
  );
}

function AnchorsStep({
  settings,
  onContinue,
}: {
  settings: {
    anchorWhy?: string;
    anchorFallback?: string;
    anchorGoodEnough?: string;
  };
  onContinue: () => void;
}) {
  const anchors = useMemo(
    () =>
      [
        { key: "why", label: "Why I want this", text: settings.anchorWhy },
        {
          key: "fallback",
          label: "If I fail, what I'll actually do",
          text: settings.anchorFallback,
        },
        {
          key: "goodEnough",
          label: "What 'good enough' looks like",
          text: settings.anchorGoodEnough,
        },
      ] as const,
    [settings.anchorWhy, settings.anchorFallback, settings.anchorGoodEnough],
  );

  const filled = anchors.filter((a) => a.text && a.text.trim().length > 0);

  return (
    <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-200">
      <h2 className="text-lg font-semibold text-slate-50">
        Read your anchors.
      </h2>
      <p>
        You wrote these when you were calm. They are more honest than
        anything you'd improvise right now. Read each one slowly.
      </p>
      {filled.length === 0 ? (
        <p className="rounded-xl border border-amber-700/40 bg-amber-950/30 p-3 text-sm text-amber-200">
          You didn't pre-write any anchors. That's fine for today — take a
          minute now to think through each of these on your own:
        </p>
      ) : null}
      <ul className="space-y-2">
        {anchors.map((a) => (
          <li
            key={a.key}
            className="rounded-xl border border-slate-700 bg-slate-950 p-3"
          >
            <div className="text-xs uppercase tracking-wide text-slate-400">
              {a.label}
            </div>
            <p className="mt-1 whitespace-pre-wrap text-sm">
              {a.text && a.text.trim().length > 0 ? (
                a.text
              ) : (
                <span className="text-slate-500">
                  (not written — think of one and hold it in mind)
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
      <button
        className="min-h-[44px] w-full rounded-xl bg-sky-600 px-3 py-3 font-semibold"
        onClick={onContinue}
      >
        Ready — finish prep
      </button>
    </section>
  );
}

function DoneStep({ onBack }: { onBack: () => void }) {
  return (
    <section className="space-y-3 rounded-2xl border border-emerald-700/40 bg-emerald-950/30 p-5 text-sm text-emerald-100">
      <h2 className="text-lg font-semibold text-emerald-50">
        Go write the exam.
      </h2>
      <p>
        You've done the preparation that actually moves the needle on
        exam day. Travel, hydrate, breathe. Your pulse is fuel.
      </p>
      <button
        className="min-h-[44px] w-full rounded-xl bg-slate-800 px-3 py-3 font-semibold text-slate-100"
        onClick={onBack}
      >
        Back to Today
      </button>
    </section>
  );
}
