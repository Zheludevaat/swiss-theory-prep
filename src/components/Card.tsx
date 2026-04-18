// The atomic learning unit. One question, three options, multi-select,
// Submit, then an inline rationale. See DESIGN_v3 §7.1.
//
// This component is deliberately stateful but un-routed — the Review/Mock
// routes own session-level state and feed cards in.

import { useEffect, useMemo, useRef, useState } from "react";
import type { Item, Rule } from "@/content/schema";
import type { GradingInput } from "@/scheduler/grading";
import { gradeAnswer } from "@/scheduler/grading";

export type CardSubmission = {
  grading: GradingInput;
  flaggedConfused: boolean;
  confidence?: 1 | 2 | 3 | 4;
};

type Props = {
  item: Item;
  rules: Rule[];
  /** When true, gate the answer reveal — used by mock exam (§8). */
  hideRationale?: boolean;
  /** When true, ask for confidence before Submit (§7.2). */
  askConfidence?: boolean;
  /** Hide flag/skip secondary actions (mock mode). */
  minimalActions?: boolean;
  onSubmit: (s: CardSubmission) => void;
  onContinue: () => void;
  /** Header counter, e.g. "6 / 10". */
  counter?: string;
  /** Whether this is the last card of the session. */
  isLast?: boolean;
};

export default function Card({
  item,
  rules,
  hideRationale = false,
  askConfidence = false,
  minimalActions = false,
  onSubmit,
  onContinue,
  counter,
  isLast = false,
}: Props) {
  const [ticks, setTicks] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | undefined>(
    undefined,
  );
  const startRef = useRef<number>(performance.now());

  // Reset on new item.
  useEffect(() => {
    setTicks([false, false, false]);
    setSubmitted(false);
    setFlagged(false);
    setConfidence(undefined);
    startRef.current = performance.now();
  }, [item.id]);

  const truth: [boolean, boolean, boolean] = useMemo(
    () => [
      item.options[0].correct,
      item.options[1].correct,
      item.options[2].correct,
    ],
    [item],
  );

  function toggle(i: 0 | 1 | 2) {
    if (submitted) return;
    const next: [boolean, boolean, boolean] = [...ticks] as [boolean, boolean, boolean];
    next[i] = !next[i];
    setTicks(next);
  }

  function handleSubmit() {
    const latencyMs = performance.now() - startRef.current;
    setSubmitted(true);
    onSubmit({
      grading: { userTicks: ticks, truth, latencyMs },
      flaggedConfused: flagged,
      ...(confidence !== undefined ? { confidence } : {}),
    });
  }

  // Result preview after Submit (we recompute locally to colour the buttons).
  const result = submitted
    ? gradeAnswer({ userTicks: ticks, truth, latencyMs: 0 })
    : null;

  const totalCorrectInTruth = truth.filter(Boolean).length;
  const userCorrectMatches = ticks.filter((t, idx) => t && truth[idx]).length;

  return (
    <div className="mx-auto flex max-w-lg flex-col px-4 pb-4 pt-3">
      {/* Tiny header */}
      <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
        <span>{counter ?? ""}</span>
        <button
          className="rounded bg-slate-800 px-2 py-1 text-slate-200"
          onClick={() => onContinue()}
        >
          Stop
        </button>
      </div>

      {/* Image / diagram (optional). Plain <img> — no asset bundle in MVP. */}
      {item.imageAssetId && (
        <div className="mb-3 flex justify-center">
          <img
            src={`./signs/${item.imageAssetId}`}
            alt=""
            className="max-h-48 w-auto"
          />
        </div>
      )}

      <h2 className="mb-3 text-lg font-medium leading-snug">{item.question}</h2>

      {/* Options */}
      <div className="space-y-2">
        {item.options.map((opt, idx) => {
          const i = idx as 0 | 1 | 2;
          const checked = ticks[i];
          const isTruth = truth[i];
          const wasChecked = checked;
          let cls =
            "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-base font-normal transition-colors";
          if (!submitted) {
            cls += checked
              ? " border-sky-500 bg-sky-950/40"
              : " border-slate-700 bg-slate-900";
          } else {
            if (isTruth && wasChecked) cls += " border-ok bg-green-950/40";
            else if (isTruth && !wasChecked)
              cls += " border-ok/60 bg-green-950/20";
            else if (!isTruth && wasChecked)
              cls += " border-bad bg-red-950/40";
            else cls += " border-slate-700 bg-slate-900";
          }
          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggle(i)}
              disabled={submitted}
              className={cls}
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-500">
                {checked && (
                  <svg viewBox="0 0 20 20" className="h-4 w-4">
                    <path
                      d="M4 10l4 4 8-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                )}
              </span>
              <span className="flex-1">{opt.text}</span>
              {submitted && isTruth && (
                <span className="text-xs text-ok">correct</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Confidence prompt (sampled). Shown before Submit. */}
      {askConfidence && !submitted && (
        <div className="mt-4 rounded-xl border border-slate-800 p-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            How sure?
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setConfidence(n as 1 | 2 | 3 | 4)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                  confidence === n
                    ? "bg-sky-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                {n === 1 ? "Guess" : n === 2 ? "Unsure" : n === 3 ? "Likely" : "Sure"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action row */}
      <div className="mt-4">
        {!submitted ? (
          <div className="flex items-center gap-2">
            {!minimalActions && (
              <button
                type="button"
                onClick={() => setFlagged((v) => !v)}
                className={`rounded-xl px-3 py-3 text-sm ${
                  flagged
                    ? "bg-amber-600 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
                title="Flag this rule as confusing — queues a teach session"
              >
                {flagged ? "Flagged" : "?"}
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={askConfidence && confidence === undefined}
              className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-base font-semibold disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-xl bg-sky-600 px-4 py-3 text-base font-semibold"
          >
            {isLast ? "Finish" : "Continue"}
          </button>
        )}
      </div>

      {/* Result + rationale (hidden in mock mode) */}
      {submitted && !hideRationale && result && (
        <ResultBlock
          result={result}
          item={item}
          rules={rules}
          totalCorrectInTruth={totalCorrectInTruth}
          userCorrectMatches={userCorrectMatches}
        />
      )}
    </div>
  );
}

function ResultBlock({
  result,
  item,
  rules,
  totalCorrectInTruth,
  userCorrectMatches,
}: {
  result: ReturnType<typeof gradeAnswer>;
  item: Item;
  rules: Rule[];
  totalCorrectInTruth: number;
  userCorrectMatches: number;
}) {
  const banner = result.correct
    ? { cls: "bg-green-950/50 border-ok text-green-200", label: `${result.matched} of 3 points` }
    : result.partiallyCorrect
      ? { cls: "bg-yellow-950/50 border-warn text-yellow-200", label: `${result.matched} of 3 points` }
      : { cls: "bg-red-950/50 border-bad text-red-200", label: `${result.matched} of 3 points` };

  const ruleSummaries = item.ruleIds
    .map((rid) => rules.find((r) => r.id === rid))
    .filter(Boolean) as Rule[];

  return (
    <div className="mt-4 space-y-3">
      <div className={`rounded-xl border p-3 text-sm ${banner.cls}`}>
        <div className="font-medium">{banner.label}</div>
        <div className="text-xs opacity-80">
          {userCorrectMatches} of {totalCorrectInTruth} correct option
          {totalCorrectInTruth === 1 ? "" : "s"} ticked
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-200">
        <p className="leading-relaxed">{item.rationale}</p>
        {ruleSummaries.length > 0 && (
          <div className="mt-2 text-xs text-slate-400">
            Tests: {ruleSummaries.map((r) => r.title).join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}
