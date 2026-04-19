// Teach screen — worked examples first, then 3 drill items on the rule.
// See DESIGN_v3 §10.7 + §6.7.
//
// This is Cognitive-Load-Theory in action: present fully-explained examples
// before the learner attempts to produce their own answers.

import { useNavigate, useParams } from "react-router-dom";
import { ruleById } from "@/content/bundle";
import { localizeRule } from "@/content/localize";
import { useStore } from "@/store";

export default function Teach() {
  const { ruleId = "" } = useParams();
  const navigate = useNavigate();
  const rule = ruleById.get(ruleId);
  const lang = useStore((s) => s.settings.contentLang);
  const clearFlag = useStore((s) => s.clearFlag);

  if (!rule) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Unknown rule: {ruleId}
        <div>
          <button
            onClick={() => navigate("/")}
            className="mt-3 rounded-lg bg-sky-600 px-3 py-2"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Chunk 13: resolve user-visible strings to the active language with
  // English fallback. Computed after the early-return so TS knows `rule`
  // is non-null.
  const lr = localizeRule(rule, lang);

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      <button
        className="text-sm text-slate-400"
        onClick={() => navigate(-1)}
      >
        ← back
      </button>
      <h1 className="text-xl font-semibold">{lr.title}</h1>
      {rule.legalRefs.length > 0 && (
        <p className="text-xs text-slate-400">
          {rule.legalRefs.join(", ")}
        </p>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-2 text-sm font-medium">The rule</h2>
        <p className="text-sm text-slate-200">{lr.statement}</p>
      </section>

      {lr.workedExamples.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-2 text-sm font-medium">Worked examples</h2>
          <ol className="ml-4 list-decimal space-y-2 text-sm text-slate-200">
            {lr.workedExamples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ol>
        </section>
      )}

      <button
        className="w-full rounded-xl bg-sky-600 px-4 py-3 text-base font-semibold"
        onClick={async () => {
          await clearFlag(rule.id);
          navigate(`/review?mode=teach&rule=${encodeURIComponent(rule.id)}`);
        }}
      >
        I got it — show me 3 drill items
      </button>
    </div>
  );
}
