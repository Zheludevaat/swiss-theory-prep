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
  type PickContext,
} from "@/scheduler/pickNext";
import { useStore } from "@/store";

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
  const startReview = useStore((s) => s.startReview);
  const finishSession = useStore((s) => s.finishSession);
  const recordReview = useStore((s) => s.recordReview);
  const flagRule = useStore((s) => s.flagRule);

  const [queue, setQueue] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  // Compose the queue once per session.
  useEffect(() => {
    let cancelled = false;
    async function run() {
      await startReview(mode === "blast5" ? "blast5" : mode === "teach" ? "teach" : "review");
      const ctx: PickContext = {
        catalog,
        memory,
        settings,
        now: Date.now(),
      };
      let ids: string[] = [];
      if (mode === "blast5") ids = composeBlastSession(ctx, BLAST_LENGTH);
      else if (mode === "teach" && ruleId) {
        ids = ITEMS.filter((it) => it.ruleIds.includes(ruleId))
          .slice(0, TEACH_LENGTH)
          .map((i) => i.id);
      } else {
        ids = composeNormalSession(ctx, NORMAL_LENGTH);
      }
      if (!cancelled) setQueue(ids);
    }
    void run();
    return () => {
      cancelled = true;
    };
    // We only want this to run once per route entry; do not refresh on memory tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    return (
      <div className="mx-auto max-w-lg p-6 text-center text-slate-300">
        <h1 className="mb-2 text-xl font-semibold">Nothing to review</h1>
        <p className="text-sm text-slate-400">
          You're caught up. Want to introduce some new items?
        </p>
        <button
          className="mt-4 rounded-xl bg-sky-600 px-4 py-3"
          onClick={() => navigate("/")}
        >
          Back to Today
        </button>
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
