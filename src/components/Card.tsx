// The atomic learning unit. One question, three options, multi-select,
// Submit, then an inline rationale. See DESIGN_v3 §7.1.
//
// This component is deliberately stateful but un-routed — the Review/Mock
// routes own session-level state and feed cards in.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  /**
   * Optional handler for the "End" button in the header. When provided, the
   * button is shown and clicking it ends the session (caller decides what
   * that means). When omitted (e.g. mock exam strict mode), no End button is
   * rendered.
   */
  onStop?: () => void;
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
  onStop,
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
  const [imageZoomed, setImageZoomed] = useState(false);
  const startRef = useRef<number>(performance.now());
  const continueRef = useRef<HTMLButtonElement>(null);

  // Reset on new item.
  useEffect(() => {
    setTicks([false, false, false]);
    setSubmitted(false);
    setFlagged(false);
    setConfidence(undefined);
    setImageZoomed(false);
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

  const toggle = useCallback(
    (i: 0 | 1 | 2) => {
      if (submitted) return;
      setTicks((cur) => {
        const next: [boolean, boolean, boolean] = [...cur] as [
          boolean,
          boolean,
          boolean,
        ];
        next[i] = !next[i];
        return next;
      });
    },
    [submitted],
  );

  const handleSubmit = useCallback(() => {
    if (askConfidence && confidence === undefined) return;
    const latencyMs = performance.now() - startRef.current;
    setSubmitted(true);
    onSubmit({
      grading: { userTicks: ticks, truth, latencyMs },
      flaggedConfused: flagged,
      ...(confidence !== undefined ? { confidence } : {}),
    });
  }, [askConfidence, confidence, ticks, truth, flagged, onSubmit]);

  // D-4: keyboard shortcuts. 1/2/3 toggle options; Enter submits (pre-submit);
  // Space or Enter advances (post-submit). We intentionally ignore events that
  // originate inside inputs — the confidence radios still own their own focus.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && target.closest("input, textarea, select")) return;
      if (imageZoomed) return; // Zoom modal handles its own keys.
      if (!submitted) {
        if (e.key === "1" || e.key === "2" || e.key === "3") {
          e.preventDefault();
          toggle((Number(e.key) - 1) as 0 | 1 | 2);
        } else if (e.key === "Enter") {
          e.preventDefault();
          handleSubmit();
        }
      } else {
        if (e.key === "Enter" || e.key === " ") {
          // Only trigger the shortcut if the continue button is the default
          // target (i.e. not when focus is on a nested button like Ask Claude).
          if (!target || target === document.body || target === continueRef.current) {
            e.preventDefault();
            onContinue();
          }
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [submitted, toggle, handleSubmit, onContinue, imageZoomed]);

  // D-15: pull focus to the Continue button after submit so keyboard users
  // can immediately press Enter/Space to advance without an extra Tab.
  useEffect(() => {
    if (submitted) {
      const t = window.setTimeout(() => continueRef.current?.focus(), 30);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [submitted]);

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
        {onStop ? (
          <button
            className="rounded bg-slate-800 px-2 py-1 text-slate-200"
            onClick={() => onStop()}
            title="End this session and return to Today"
          >
            End
          </button>
        ) : (
          <span />
        )}
      </div>

      {/* Image / diagram (optional). D-17: bumped max-h from 48 to 80 so signs
          are large enough to read on phones; tap to open a fullscreen zoom.
          A-15: render diagramAssetId too — diagrams live in /diagrams/, signs
          in /signs/. D-6: pull alt text from item with a deterministic
          fallback so screen readers always have something useful. */}
      {(item.imageAssetId || item.diagramAssetId) && (
        <div className="mb-3 flex justify-center">
          <button
            type="button"
            onClick={() => setImageZoomed(true)}
            className="block focus:outline-none"
            aria-label="Zoom image"
          >
            {item.imageAssetId && (
              <img
                src={`./signs/${item.imageAssetId}`}
                alt={item.imageAlt ?? `Swiss road sign ${item.imageAssetId.replace(/\.svg$/, "")}`}
                className="max-h-80 w-auto"
              />
            )}
            {item.diagramAssetId && (
              <img
                src={`./diagrams/${item.diagramAssetId}`}
                alt={item.imageAlt ?? `Scenario diagram ${item.diagramAssetId.replace(/\.svg$/, "")}`}
                className="max-h-80 w-auto"
              />
            )}
          </button>
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
              role="checkbox"
              aria-checked={checked}
              aria-disabled={submitted}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                // D-3: Space toggles per ARIA checkbox pattern. Enter falls
                // through to the global submit shortcut.
                if (e.key === " ") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              disabled={submitted}
              className={`${cls} min-h-[44px]`}
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-500"
                aria-hidden="true"
              >
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
              <span className="flex-1">
                <span className="sr-only">Option {idx + 1}: </span>
                {opt.text}
              </span>
              {submitted && isTruth && (
                <span className="text-xs text-ok">correct</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Confidence prompt (sampled). Shown before Submit. D-9: 2×2 grid on
          narrow screens, 4-up on wider, every button at least 44×44 (WCAG). */}
      {askConfidence && !submitted && (
        <div
          className="mt-4 rounded-xl border border-slate-800 p-3"
          role="radiogroup"
          aria-label="How sure are you?"
        >
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">
            How sure?
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={confidence === n}
                onClick={() => setConfidence(n as 1 | 2 | 3 | 4)}
                className={`min-h-[44px] rounded-lg px-3 py-2 text-sm ${
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
                aria-pressed={flagged}
                className={`min-h-[44px] min-w-[44px] rounded-xl px-3 py-3 text-sm ${
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
              className="min-h-[44px] flex-1 rounded-xl bg-sky-600 px-4 py-3 text-base font-semibold disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        ) : (
          <button
            type="button"
            ref={continueRef}
            onClick={onContinue}
            className="min-h-[44px] w-full rounded-xl bg-sky-600 px-4 py-3 text-base font-semibold"
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
          userTicks={ticks}
        />
      )}

      {/* D-17: fullscreen zoom modal for sign images or diagrams. */}
      {imageZoomed && (item.imageAssetId || item.diagramAssetId) && (
        <ImageZoomModal
          src={
            item.imageAssetId
              ? `./signs/${item.imageAssetId}`
              : `./diagrams/${item.diagramAssetId}`
          }
          alt={
            item.imageAlt ??
            (item.imageAssetId
              ? `Swiss road sign ${item.imageAssetId.replace(/\.svg$/, "")}`
              : `Scenario diagram ${item.diagramAssetId?.replace(/\.svg$/, "") ?? ""}`)
          }
          onClose={() => setImageZoomed(false)}
        />
      )}
    </div>
  );
}

function ImageZoomModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-full object-contain"
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-100"
      >
        Close
      </button>
    </div>
  );
}

function ResultBlock({
  result,
  item,
  rules,
  totalCorrectInTruth,
  userCorrectMatches,
  userTicks,
}: {
  result: ReturnType<typeof gradeAnswer>;
  item: Item;
  rules: Rule[];
  totalCorrectInTruth: number;
  userCorrectMatches: number;
  userTicks: [boolean, boolean, boolean];
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
      {!result.correct && (
        <AskClaudeButton item={item} userTicks={userTicks} />
      )}
    </div>
  );
}

/**
 * Pragmatic "Ask Claude" escape hatch (C-4): copies a structured prompt with
 * the question, the user's ticks vs. the truth, and the rationale, then opens
 * claude.ai in a new tab so the user can paste it. We don't have an API key in
 * the PWA — this is a clipboard handoff, not an in-app conversation. Shown
 * only on incorrect answers (so it doesn't clutter wins) and only when the
 * rationale is visible (so it's hidden in mock strict mode).
 */
function AskClaudeButton({
  item,
  userTicks,
}: {
  item: Item;
  userTicks: [boolean, boolean, boolean];
}) {
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => {
    const lines: string[] = [];
    lines.push(
      "I'm preparing for the Swiss Cat. B driving theory exam and got this multiple-choice question wrong. Please explain it clearly, in plain English, and tell me what mental rule will help me get similar questions right next time.",
      "",
      `Question: ${item.question}`,
      "",
      "Options (multi-select; any number can be correct):",
    );
    item.options.forEach((opt, i) => {
      const ticked = userTicks[i] ? "I ticked" : "I did not tick";
      const truth = opt.correct ? "actually correct" : "actually incorrect";
      lines.push(`  ${i + 1}. ${opt.text}  —  ${ticked}; ${truth}`);
    });
    lines.push("", `Official rationale: ${item.rationale}`);
    return lines.join("\n");
  }, [item, userTicks]);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Best-effort: still open Claude even if clipboard write fails.
    }
    window.open("https://claude.ai/new", "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
      title="Copy a structured prompt to your clipboard and open claude.ai so you can paste and ask"
    >
      {copied ? "Copied — paste in Claude" : "Ask Claude to explain"}
    </button>
  );
}
