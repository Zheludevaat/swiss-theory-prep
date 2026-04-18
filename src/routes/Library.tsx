// Read-only browse of the catalog. No reviews happen here. See §10.4.
//
// Two tabs: Rules (grouped by category) and Signs (grid). Signs tab is empty
// in seed mode — drop SVGs into public/signs and reference them from items
// to populate it.

import { useMemo, useState } from "react";
import { CATEGORY_LABELS, type Category, type Rule } from "@/content/schema";
import { ITEMS, RULES } from "@/content/bundle";
import { useStore } from "@/store";
import { isGraduated } from "@/scheduler/fsrs";

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
                  <details>
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

function SignsView() {
  const signs = ITEMS.filter((i) => !!i.imageAssetId);
  if (signs.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
        No sign images yet. Drop SVGs into <code>public/signs/</code> and set
        <code> imageAssetId </code>on items to populate this grid.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      {signs.map((i) => (
        <div
          key={i.id}
          className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900 p-2"
        >
          <img src={`./signs/${i.imageAssetId}`} alt="" className="h-16 w-16" />
          <div className="mt-1 text-center text-[10px] text-slate-400">
            {i.imageAssetId}
          </div>
        </div>
      ))}
    </div>
  );
}
