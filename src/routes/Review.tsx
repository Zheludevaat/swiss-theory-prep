// The review loop. Drives one card at a time using the scheduler.
//
// Modes (param `?mode=blast5` or default):
//   - normal: composeNormalSession with new-item budget
//   - blast5: composeBlastSession (no new items)
//   - teach:  shows 3 items for a single ruleId (param ?rule=...)

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "@/components/Card";
import { ITEMS, RULES, ruleById } from "@/content/bundle";
import {
  composeBlastSession,
  composeNormalSession,
  summarise,
  triage as triageFn,
  type PickContext,
} from "@/scheduler/pickNext";
import { selectLastSessionEndedAt, useStore } from "@/store";

const NORMAL_LENGTH = 20;
const BLAST_LENGTH = 10;
const TEACH_LENGTH = 3;

export default function Review() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mode = (params.get("mode") ?? "normal") as
    | "normal"
    | "blast5"
    | "teach";
  const ruleId = params.get("rule") ?? undefined;

  const memory = useStore((s) => s.memory);
  const settings = useStore((s) => s.settings);
  const catalog = useStore((s) => s.catalog);
  const reviews24h = useStore((s) => s.reviews24h);
  const lastSessionEndedAt = useStore(selectLastSessionEndedAt);
  const startReview = useStore((s) => s.startReview);
  const finishSession = useStore((s) => s.finishSession);
  const recordReview = useStore((s) => s.recordReview);
  const flagRule = useStore((s) => s.flagRule);
  const deferItems = useStore((s) => s.deferItems);

  const [queue, setQueue] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  // Compose the queue when the route entry changes (mode or ruleId). We do
  // *not* recompose on memory ticks during a session — that would shuffle the
  // user's queue mid-flow.
  useEffect(() => {
    let cancelled = false;
    setIdx(0);
    setQueue([]);
    async function run() {
      await startReview(mode === "blast5" ? "blast5" : mode === "teach" ? "teach" : "review");
      const ctx: PickContext = {
        catalog,
        memory,
        settings,
        now: Date.now(),
        recentReviews: reviews24h,
        ...(lastSessionEndedAt !== undefined ? { lastSessionEndedAt } : {}),
      };
      let ids: string[] = [];
      if (mode === "blast5") {
        ids = composeBlastSession(ctx, BLAST_LENGTH);
      } else if (mode === "teach" && ruleId) {
        ids = ITEMS.filter((it) => it.ruleIds.includes(ruleId))
          .slice(0, TEACH_LENGTH)
          .map((i) => i.id);
      } else {
        // Honour triage (DESIGN_v3 §6.6): when due ≫ capacity, restrict the
        // pool to the highest-priority items so we don't avalanche the user.
        // Learning + relearning items always stay in scope — they must
        // stabilise regardless of the backlog.
        //
        // Side effect: write back the deferred ids to IndexedDB so the next
        // session doesn't reconsider them (otherwise triage repeats forever).
        const summary = summarise(ctx);
        const tri = triageFn(summary, ctx);
        const opts = tri.triaged
          ? {
              restrictTo: new Set<string>([
                ...summary.relearning,
                ...summary.learning,
                ...tri.keep,
              ]),
            }
          : {};
        if (tri.triaged && tri.defer.length > 0) {
          await deferItems(tri.defer);
        }
        ids = composeNormalSession(ctx, NORMAL_LENGTH, opts);
      }
      if (!cancelled) setQueue(ids);
    }
    void run();
    return () => {
      cancelled = true;
    };
    // We intentionally exclude memory/settings/catalog from deps: we want one
    // queue per route entry. Mode/ruleId changes (user navigates from Today →
    // 5-min blast, etc.) DO recompose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, ruleId]);

  const totalToServe = queue.length;
  const currentId = queue[idx];
  const item = currentId ? catalog.itemById.get(currentId) : undefined;
  const sampleEvery = settings.sampleConfidenceEvery;
  const askConfidence = sampleEvery > 0 && (idx + 1) % sampleEvery === 0;

  const ruleObjects = useMemo(
    () =>
      item
        ? (item.ruleIds
            .map((rid) => ruleById.get(rid))
            .filter(Boolean) as typeof RULES)
        : [],
    [item],
  );

  if (queue.length === 0) {
    // D-10: when the normal queue is empty but new items are still available,
    // offer a direct path into a 5-minute blast rather than bouncing the user
    // back to Today with nothing to show for the trip.
    const ctx: PickContext = {
      catalog,
      memory,
      settings,
      now: Date.now(),
      recentReviews: reviews24h,
      ...(lastSessionEndedAt !== undefined ? { lastSessionEndedAt } : {}),
    };
    const summaryNow = summarise(ctx);
    const hasNew = summaryNow.newAvailable.length > 0;
    return (
      <div className="mx-auto max-w-lg p-6 text-center text-slate-300">
        <h1 className="mb-2 text-xl font-semibold">Nothing to review</h1>
        <p className="text-sm text-slate-400">
          {hasNew
            ? `You're caught up on review. ${summaryNow.newAvailable.length} new item${summaryNow.newAvailable.length === 1 ? "" : "s"} waiting.`
            : "You're caught up. Come back tomorrow when more cards are due."}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {hasNew && (
            <button
              className="min-h-[44px] rounded-xl bg-sky-600 px-4 py-3 font-semibold"
              onClick={() => navigate("/review?mode=blast5")}
            >
              Start new items (5-min blast)
            </button>
          )}
          <button
            className="min-h-[44px] rounded-xl bg-slate-800 px-4 py-3"
            onClick={() => navigate("/")}
          >
            Back to Today
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    // Either finished or queue id no longer in catalog.
    return (
      <SessionFinished
        onDone={async () => {
          await finishSession();
          navigate("/");
        }}
      />
    );
  }

  return (
    <Card
      key={currentId}
      item={item}
      rules={ruleObjects}
      lang={settings.contentLang}
      counter={`${idx + 1} / ${totalToServe}`}
      askConfidence={askConfidence}
      isLast={idx === totalToServe - 1}
      onSubmit={async (sub) => {
        await recordReview(item.id, sub.grading, {
          ...(sub.confidence !== undefined ? { confidence: sub.confidence } : {}),
          ...(sub.flaggedConfused ? { flaggedConfused: true } : {}),
        });
        if (sub.flaggedConfused && item.ruleIds[0]) {
          await flagRule(item.ruleIds[0]);
        }
      }}
      onContinue={async () => {
        if (idx + 1 < totalToServe) {
          setIdx((i) => i + 1);
        } else {
          await finishSession();
          navigate("/");
        }
      }}
      onStop={async () => {
        await finishSession();
        navigate("/");
      }}
    />
  );
}

function SessionFinished({ onDone }: { onDone: () => void | Promise<void> }) {
  useEffect(() => {
    void onDone();
  }, [onDone]);
  return (
    <div className="p-6 text-center text-slate-400">Wrapping up…</div>
  );
}
