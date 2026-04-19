// Stats — bare-bones, honest. See §10.5.
//   - Cards reviewed per day (30-day bar chart)
//   - Accuracy per category (horizontal bars)
//   - Confidence calibration curve (only after ≥50 confidence samples)
//   - Mock exam history

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORY_LABELS, type Category } from "@/content/schema";
import { categoryOfItem, itemById } from "@/content/bundle";
import { allReviews } from "@/db";
import type { ReviewEvent } from "@/db/types";
import { fmtDate } from "@/lib/time";
import {
  CALIBRATION_SAMPLE_FLOOR,
  calibrationByCategory,
  gapSeverity,
  type CalibrationRow,
} from "@/lib/calibration";
import { useStore } from "@/store";

export default function Stats() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewEvent[]>([]);
  const mocks = useStore((s) => s.mockHistory);

  useEffect(() => {
    void (async () => {
      setReviews(await allReviews());
    })();
  }, []);

  const perDay = useMemo(() => bucketPerDay(reviews, 30), [reviews]);
  const perCategory = useMemo(() => accuracyByCategory(reviews), [reviews]);
  const calibration = useMemo(() => calibrationCurve(reviews), [reviews]);
  const samples = reviews.filter((r) => r.confidence !== undefined).length;

  // Audit §3.3: per-category calibration. The reducer is cheap but pure, so
  // memo it on the review list — it recomputes only on page load or when a
  // fresh review lands in the store (not currently — Stats hydrates once).
  const calibrationPerCategory = useMemo(
    () =>
      calibrationByCategory(reviews, (itemId) => {
        const it = itemById.get(itemId);
        return it ? categoryOfItem(it) : undefined;
      }),
    [reviews],
  );

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Stats</h1>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 text-sm font-medium">Cards / day · last 30 days</h2>
        <DailyBars data={perDay} />
        <div className="mt-1 flex justify-between text-[10px] text-slate-500">
          <span>−30d</span>
          <span>−15d</span>
          <span>today</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 text-sm font-medium">Accuracy by category</h2>
        {perCategory.length === 0 ? (
          <p className="text-sm text-slate-400">No reviews yet.</p>
        ) : (
          <ul className="space-y-2">
            {perCategory.map(([cat, b]) => {
              const pct = b.n ? Math.round((b.correct / b.n) * 100) : 0;
              return (
                <li key={cat} className="text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>{CATEGORY_LABELS[cat]}</span>
                    <span className="text-slate-400">
                      {pct}% ({b.n})
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
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 text-sm font-medium">Confidence calibration</h2>
        {samples < 50 ? (
          <p className="text-sm text-slate-400">
            Calibration appears after 50 confidence samples ({samples}/50). The
            chart is meaningless at low N.
          </p>
        ) : (
          <CalibrationChart data={calibration} />
        )}
      </section>

      {/* Audit §3.3: per-category calibration + drill CTA. Each row unlocks
          independently at CALIBRATION_SAMPLE_FLOOR samples. Tapping a flagged
          row composes a calibration-repair drill from recent
          high-confidence misses in that category. */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-1 text-sm font-medium">Calibration by category</h2>
        <p className="mb-3 text-xs text-slate-400">
          Overconfidence (said you'd get it right, didn't) is the riskiest
          metacognitive error. Tap a flagged row to drill recent misses.
        </p>
        <CalibrationCategoryTable
          rows={calibrationPerCategory}
          onDrill={(cat) =>
            navigate(`/review?mode=calib&cat=${encodeURIComponent(cat)}`)
          }
        />
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-3 text-sm font-medium">Mock exam history</h2>
        {mocks.length === 0 ? (
          <p className="text-sm text-slate-400">No mocks taken yet.</p>
        ) : (
          <ul className="divide-y divide-slate-800 text-sm">
            {mocks.map((m, i) => (
              <li
                key={i}
                className="flex items-center justify-between py-2"
              >
                <span>{fmtDate(m.at)}</span>
                <span className={m.passed ? "text-ok" : "text-bad"}>
                  {m.points}/150 · {m.passed ? "Pass" : "Fail"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function bucketPerDay(reviews: ReviewEvent[], days: number) {
  const buckets = new Array(days).fill(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const r of reviews) {
    const d = new Date(r.timestamp);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
    if (diff >= 0 && diff < days) buckets[days - 1 - diff] += 1;
  }
  return buckets;
}

function DailyBars({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  return (
    <div
      className="flex h-24 items-end gap-[2px]"
      role="img"
      aria-label={`Daily card count for the last ${data.length} days`}
    >
      {data.map((n, i) => {
        // D-12: every day gets at least a 2px ghost bar so the chart's x-axis
        // is visible even on streak-breaking days. Active days draw on top in
        // a brighter tone.
        const filledHeight = (n / max) * 100;
        return (
          <div
            key={i}
            className="relative flex-1"
            title={n > 0 ? `${n} cards` : "no cards"}
          >
            <div className="absolute inset-x-0 bottom-0 h-[2px] rounded-t bg-slate-700" />
            {n > 0 && (
              <div
                className="absolute inset-x-0 bottom-0 rounded-t bg-sky-500"
                style={{ height: `max(${filledHeight}%, 2px)` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function accuracyByCategory(reviews: ReviewEvent[]) {
  const buckets = new Map<Category, { correct: number; n: number }>();
  for (const r of reviews) {
    const item = itemById.get(r.itemId);
    if (!item) continue;
    const cat = categoryOfItem(item);
    if (!cat) continue;
    const cur = buckets.get(cat) ?? { correct: 0, n: 0 };
    cur.n += 1;
    if (r.correct) cur.correct += 1;
    buckets.set(cat, cur);
  }
  return Array.from(buckets.entries()).sort((a, b) => b[1].n - a[1].n);
}

function calibrationCurve(reviews: ReviewEvent[]) {
  // Buckets: confidence 1–4. We compute observed-correct rate per bucket.
  const buckets = new Map<number, { correct: number; n: number }>();
  for (const r of reviews) {
    if (r.confidence === undefined) continue;
    const cur = buckets.get(r.confidence) ?? { correct: 0, n: 0 };
    cur.n += 1;
    if (r.correct) cur.correct += 1;
    buckets.set(r.confidence, cur);
  }
  return [1, 2, 3, 4].map((c) => {
    const b = buckets.get(c) ?? { correct: 0, n: 0 };
    return { c, pct: b.n ? b.correct / b.n : 0, n: b.n };
  });
}

function CalibrationCategoryTable({
  rows,
  onDrill,
}: {
  rows: CalibrationRow[];
  onDrill: (cat: Category) => void;
}) {
  // Only surface buckets that have met the sample floor — anything below is
  // statistical noise and would mislead rather than inform (Koriat's
  // feedback loop breaks down at low N).
  const unlocked = rows.filter((r) => r.n >= CALIBRATION_SAMPLE_FLOOR);
  const locked = rows.filter((r) => r.n < CALIBRATION_SAMPLE_FLOOR);

  if (unlocked.length === 0) {
    const total = rows.reduce((acc, r) => acc + r.n, 0);
    return (
      <p className="text-sm text-slate-400">
        No category has {CALIBRATION_SAMPLE_FLOOR}+ confidence samples yet (
        {total} total so far). Keep answering; rows unlock per category.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {unlocked.map((r) => {
          const sev = gapSeverity(r.gapPp);
          const over = r.gapPp > 0;
          // Colour rule: amber + red are attention; green is "stay calm."
          // Positive gap = overconfident (said high, was wrong); negative
          // gap = underconfident (said low, got it right). Both are worth
          // flagging at bad severity but for different reasons.
          const pillClass =
            sev === "bad"
              ? "bg-red-950/40 border-bad text-red-200"
              : sev === "warn"
                ? "bg-yellow-950/30 border-warn text-yellow-200"
                : "bg-green-950/20 border-ok text-green-200";
          const label = over ? "overconfident" : "underconfident";
          const canDrill = over && sev !== "ok";
          return (
            <li
              key={r.category}
              className={`rounded-xl border p-3 text-sm ${pillClass}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-slate-100">
                  {CATEGORY_LABELS[r.category]}
                </span>
                <span className="text-xs text-slate-300">
                  said {Math.round(r.expectedPct * 100)}% · saw{" "}
                  {Math.round(r.observedPct * 100)}% · {r.n} samples
                </span>
              </div>
              <div className="mt-1 text-xs">
                {sev === "ok" ? (
                  <span>Well calibrated.</span>
                ) : (
                  <span>
                    {Math.round(Math.abs(r.gapPp))}pp {label}.
                  </span>
                )}
              </div>
              {canDrill && (
                <button
                  className="mt-2 min-h-[44px] w-full rounded-lg bg-sky-700/60 px-3 py-2 text-xs font-medium text-sky-50"
                  onClick={() => onDrill(r.category)}
                >
                  Drill recent misses in{" "}
                  {CATEGORY_LABELS[r.category].toLowerCase()}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {locked.length > 0 && (
        <p className="text-xs text-slate-500">
          {locked.length} more categor{locked.length === 1 ? "y" : "ies"}{" "}
          unlocking at {CALIBRATION_SAMPLE_FLOOR} samples.
        </p>
      )}
    </div>
  );
}

function CalibrationChart({
  data,
}: {
  data: Array<{ c: number; pct: number; n: number }>;
}) {
  // Crude visual: stated confidence on x (1..4 → 25/50/75/100% expectation),
  // observed accuracy on y as a coloured bar.
  const expected: Record<number, number> = { 1: 0.25, 2: 0.5, 3: 0.75, 4: 1.0 };
  return (
    <ul className="space-y-2 text-sm">
      {data.map((d) => {
        const exp = expected[d.c] ?? 0;
        const gap = d.pct - exp;
        return (
          <li key={d.c}>
            <div className="flex justify-between text-slate-300">
              <span>Confidence {d.c}</span>
              <span className="text-slate-400">
                said {Math.round(exp * 100)}% · saw {Math.round(d.pct * 100)}% ·{" "}
                {d.n} samples
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded bg-slate-800">
              <div
                className={`h-full rounded ${gap < -0.1 ? "bg-bad" : gap > 0.1 ? "bg-warn" : "bg-ok"}`}
                style={{ width: `${Math.round(d.pct * 100)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
