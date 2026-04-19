// Read-only browse of the catalog. No reviews happen here. See §10.4.
//
// Two tabs: Rules (grouped by category) and Signs (grouped by sign family).

import { useMemo, useState } from "react";
import { CATEGORY_LABELS, type Category, type Item, type Rule } from "@/content/schema";
import { ITEMS, RULES } from "@/content/bundle";
import { SIGN_FAMILY_LABELS, SIGN_MANIFEST, type SignManifestEntry } from "@/content/signs";
import { useStore } from "@/store";
import { isGraduated } from "@/scheduler/fsrs";
import type { FsrsState, MemoryState } from "@/db/types";

type Tab = "rules" | "signs";

export default function Library() {
  const [tab, setTab] = useState<Tab>("rules");
  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-3 text-2xl font-semibold">Library</h1>
      <div className="mb-4 flex gap-2">
        <TabButton active={tab === "rules"} onClick={() => setTab("rules")}>
          Rules
        </TabButton>
        <TabButton active={tab === "signs"} onClick={() => setTab("signs")}>
          Signs
        </TabButton>
      </div>
      {tab === "rules" ? <RulesView /> : <SignsView />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl px-3 py-2 text-sm ${
        active ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function RulesView() {
  const memory = useStore((s) => s.memory);
  const [allOpen, setAllOpen] = useState(false);
  const grouped = useMemo(() => {
    const buckets = new Map<Category, Rule[]>();
    for (const r of RULES) {
      const arr = buckets.get(r.category) ?? [];
      arr.push(r);
      buckets.set(r.category, arr);
    }
    return Array.from(buckets.entries());
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 text-xs">
        <button
          className="rounded-lg bg-slate-800 px-2 py-1 text-slate-300"
          onClick={() => setAllOpen(true)}
        >
          Expand all
        </button>
        <button
          className="rounded-lg bg-slate-800 px-2 py-1 text-slate-300"
          onClick={() => setAllOpen(false)}
        >
          Collapse all
        </button>
      </div>
      {grouped.map(([cat, rules]) => (
        <section
          key={cat}
          className="rounded-2xl border border-slate-800 bg-slate-900"
        >
          <div className="border-b border-slate-800 px-4 py-2 text-xs uppercase tracking-wide text-slate-400">
            {CATEGORY_LABELS[cat]}
          </div>
          <ul className="divide-y divide-slate-800">
            {rules.map((r) => {
              const items = ITEMS.filter((it) => it.ruleIds.includes(r.id));
              const grad = items.filter((it) => {
                const m = memory.get(it.id);
                return m && isGraduated(m);
              }).length;
              return (
                <li key={r.id} className="px-4 py-3">
                  <details open={allOpen}>
                    <summary className="flex cursor-pointer items-center justify-between text-sm">
                      <span className="font-medium">{r.title}</span>
                      <span className="text-xs text-slate-400">
                        {grad}/{items.length}
                      </span>
                    </summary>
                    <div className="mt-2 space-y-2 text-xs text-slate-300">
                      <p>{r.statement}</p>
                      {r.legalRefs.length > 0 && (
                        <p className="text-slate-400">
                          Refs: {r.legalRefs.join(", ")}
                        </p>
                      )}
                      {r.workedExamples.length > 0 && (
                        <ul className="ml-4 list-disc space-y-1">
                          {r.workedExamples.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      )}
                      {items.length > 0 && (
                        <div>
                          <div className="mt-2 text-slate-400">Items</div>
                          <ul className="mt-1 space-y-1">
                            {items.map((it) => {
                              const m = memory.get(it.id);
                              const mastery = describeMastery(m);
                              return (
                                <li
                                  key={it.id}
                                  className="flex items-center justify-between gap-2 rounded bg-slate-950/40 px-2 py-1"
                                >
                                  <span className="truncate">
                                    {it.question.length > 60
                                      ? `${it.question.slice(0, 60)}…`
                                      : it.question}
                                  </span>
                                  <span
                                    className={`shrink-0 rounded px-2 py-0.5 text-[10px] uppercase tracking-wide ${mastery.cls}`}
                                    title={mastery.detail}
                                  >
                                    {mastery.label}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

const MASTERY_STATE_LABEL: Record<FsrsState, string> = {
  new: "new",
  learning: "learning",
  review: "review",
  relearning: "relearning",
};

function describeMastery(m: MemoryState | undefined): {
  label: string;
  cls: string;
  detail: string;
} {
  if (!m) {
    return {
      label: "new",
      cls: "bg-slate-800 text-slate-400",
      detail: "Not yet reviewed",
    };
  }
  if (isGraduated(m)) {
    return {
      label: "graduated",
      cls: "bg-green-950 text-green-300",
      detail: `${m.reps} reviews · ${m.lapses} lapses`,
    };
  }
  const stateLabel = MASTERY_STATE_LABEL[m.state];
  const cls =
    m.state === "relearning"
      ? "bg-red-950 text-red-300"
      : m.state === "learning"
        ? "bg-yellow-950 text-yellow-300"
        : m.state === "review"
          ? "bg-sky-950 text-sky-300"
          : "bg-slate-800 text-slate-400";
  return {
    label: stateLabel,
    cls,
    detail: `${m.reps} reviews · ${m.lapses} lapses`,
  };
}

// A-13: Signs tab grouped by family (warning / prohibition / mandatory /
// priority / supplementary). The full SIGN_MANIFEST drives the grid even when
// no item references a sign yet — so the Library is browsable as a reference
// while item content is still being authored.
//
// Per-sign mastery: aggregate FSRS state across every item that references
// the sign. "Graduated" means at least one item is graduated. Otherwise show
// the highest-engagement state (review > learning > relearning > new).
function SignsView() {
  const memory = useStore((s) => s.memory);

  const signItemsByCode = useMemo(() => {
    const m = new Map<string, Item[]>();
    for (const it of ITEMS) {
      if (!it.imageAssetId) continue;
      const code = it.imageAssetId.replace(/\.svg$/, "");
      const arr = m.get(code) ?? [];
      arr.push(it);
      m.set(code, arr);
    }
    return m;
  }, []);

  const grouped = useMemo(() => {
    const buckets = new Map<SignManifestEntry["family"], SignManifestEntry[]>();
    for (const s of SIGN_MANIFEST) {
      const arr = buckets.get(s.family) ?? [];
      arr.push(s);
      buckets.set(s.family, arr);
    }
    // Stable family order regardless of manifest insertion order.
    const order: SignManifestEntry["family"][] = [
      "warning",
      "prohibition",
      "mandatory",
      "priority",
      "supplementary",
    ];
    return order
      .filter((f) => buckets.has(f))
      .map((f) => [f, buckets.get(f)!] as const);
  }, []);

  if (SIGN_MANIFEST.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
        No sign manifest entries. Add to <code>src/content/signs.ts</code>.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grouped.map(([family, signs]) => {
        const familyLabel = SIGN_FAMILY_LABELS[family];
        return (
          <section
            key={family}
            className="rounded-2xl border border-slate-800 bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs uppercase tracking-wide text-slate-400">
              <span>{familyLabel}</span>
              <span>{signs.length}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 p-3">
              {signs.map((s) => {
                const items = signItemsByCode.get(s.code) ?? [];
                const mastery = aggregateSignMastery(items, memory);
                return (
                  <div
                    key={s.code}
                    className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950/40 p-2"
                    title={`${s.code} — ${s.label}${s.nameDe ? ` · ${s.nameDe}` : ""}`}
                  >
                    <img
                      src={`./signs/${s.code}.svg`}
                      alt={`${s.label} (Swiss sign ${s.code})`}
                      className="h-16 w-16 object-contain"
                    />
                    <div className="mt-1 text-center text-[10px] leading-tight text-slate-300">
                      {s.label}
                    </div>
                    <div className="mt-0.5 text-center text-[9px] text-slate-500">
                      {s.code}
                    </div>
                    {mastery && (
                      <span
                        className={`mt-1 rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wide ${mastery.cls}`}
                        title={mastery.detail}
                      >
                        {mastery.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function aggregateSignMastery(
  items: Item[],
  memory: Map<string, MemoryState>,
): { label: string; cls: string; detail: string } | null {
  if (items.length === 0) return null;
  const states = items.map((it) => memory.get(it.id));
  const anyGrad = states.some((m) => m && isGraduated(m));
  if (anyGrad) {
    return {
      label: "graduated",
      cls: "bg-green-950 text-green-300",
      detail: `${items.length} item(s); at least one graduated`,
    };
  }
  const anyRelearning = states.some((m) => m?.state === "relearning");
  if (anyRelearning) {
    return {
      label: "relearn",
      cls: "bg-red-950 text-red-300",
      detail: `${items.length} item(s); has relearning`,
    };
  }
  const anyLearning = states.some((m) => m?.state === "learning");
  if (anyLearning) {
    return {
      label: "learning",
      cls: "bg-yellow-950 text-yellow-300",
      detail: `${items.length} item(s); in learning`,
    };
  }
  return null;
}
