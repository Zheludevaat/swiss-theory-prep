// Today screen. Biggest button: Start review. The rest is honest reporting —
// readiness, due count, last session, streak. See DESIGN_v3 §10.1.

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ITEMS, ruleById } from "@/content/bundle";
import { summarise, dailyCapacity, isInCatchUpMode, triage as triageFn, type PickContext } from "@/scheduler/pickNext";
import { selectLastSessionEndedAt, useStore } from "@/store";
import { computeStreak } from "@/lib/streak";
import { computeReadiness, READINESS_BLURB, READINESS_LABEL } from "@/lib/readiness";
import { fmtDate, fmtMinutes, daysUntil } from "@/lib/time";
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

