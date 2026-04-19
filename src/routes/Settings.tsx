// Settings. See §10.6.
//   - Daily target minutes
//   - Retention target (0.80–0.95)
//   - Confidence sampling frequency
//   - LLM on/off + API key (stored locally)
//   - Exam date
//   - Export / import backup
//   - Reset (destructive)

import { useEffect, useRef, useState } from "react";
import { CONTENT_VERSION, ITEMS, RULES } from "@/content/bundle";
import ConfirmModal from "@/components/ConfirmModal";
import {
  allErrorReports,
  clearErrorReports,
  exportBackup,
  importBackup,
  wipeAll,
} from "@/db";
import type { Backup } from "@/db/types";
import { IF_THEN_CUES, IF_THEN_PLACES } from "@/lib/ifThen";
import { useStore } from "@/store";

export default function Settings() {
  const settings = useStore((s) => s.settings);
  const save = useStore((s) => s.saveSettings);
  const init = useStore((s) => s.init);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState<string>(settings.anthropicKey ?? "");

  // Keep the draft in sync if settings.anthropicKey changes externally
  // (e.g. backup import). We don't overwrite while the user is mid-edit if
  // their draft already differs — checking equality below avoids that.
  useEffect(() => {
    setApiKeyDraft((cur) => (cur === "" ? settings.anthropicKey ?? "" : cur));
  }, [settings.anthropicKey]);

  async function doExport() {
    const backup = await exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `theory-prep-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Exported.");
  }

  async function doImport(file: File) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Backup;
      await importBackup(parsed);
      await init(); // reload into store
      setMsg("Imported.");
    } catch (err) {
      setMsg(`Import failed: ${(err as Error).message}`);
    }
  }

  async function doReset() {
    setConfirmReset(false);
    await wipeAll();
    await init();
    setMsg("Wiped.");
  }

  async function saveApiKey() {
    const trimmed = apiKeyDraft.trim();
    await save({ anthropicKey: trimmed === "" ? undefined : trimmed });
    setMsg("API key saved.");
  }

  async function doExportErrors() {
    const errs = await allErrorReports();
    if (errs.length === 0) {
      setMsg("No errors logged.");
      return;
    }
    const blob = new Blob([JSON.stringify(errs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `theory-prep-errors-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg(`Exported ${errs.length} error${errs.length === 1 ? "" : "s"}.`);
  }

  async function doClearErrors() {
    await clearErrorReports();
    setMsg("Error log cleared.");
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Field label="Daily target (minutes)">
        <input
          type="number"
          min={5}
          max={60}
          value={settings.dailyTargetMinutes}
          onChange={(e) =>
            void save({ dailyTargetMinutes: Number(e.target.value) })
          }
          className="w-full rounded-lg bg-slate-800 px-3 py-2"
        />
      </Field>

      <Field
        label={`Retention target (${Math.round(settings.retentionTarget * 100)}%)`}
      >
        <input
          type="range"
          min={0.8}
          max={0.95}
          step={0.01}
          value={settings.retentionTarget}
          onChange={(e) => void save({ retentionTarget: Number(e.target.value) })}
          className="w-full"
        />
        <p className="mt-1 text-xs text-slate-400">
          0.90 aligns with the exam's pass threshold and sits in the
          desirable-difficulty sweet spot.
        </p>
      </Field>

      <Field
        label={`Confidence sampling (every ${settings.sampleConfidenceEvery || "off"})`}
      >
        <select
          value={settings.sampleConfidenceEvery}
          onChange={(e) =>
            void save({ sampleConfidenceEvery: Number(e.target.value) })
          }
          className="w-full rounded-lg bg-slate-800 px-3 py-2"
        >
          <option value={0}>Off</option>
          <option value={3}>Every 3rd card</option>
          <option value={5}>Every 5th card (default)</option>
          <option value={10}>Every 10th card</option>
        </select>
      </Field>

      <Field label="Exam date">
        <input
          type="date"
          value={settings.examDate ?? ""}
          onChange={(e) => void save({ examDate: e.target.value || undefined })}
          className="w-full rounded-lg bg-slate-800 px-3 py-2"
        />
      </Field>

      <Field label="Question language">
        <select
          value={settings.contentLang}
          onChange={(e) =>
            void save({ contentLang: e.target.value as "en" | "de" })
          }
          className="w-full rounded-lg bg-slate-800 px-3 py-2"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
        <p className="mt-1 text-xs text-slate-400">
          The real Swiss exam is delivered in DE / FR / IT. Training in the
          exam language helps you parse legalese under time pressure. Items
          without a German translation fall back to English with an{" "}
          <span className="rounded bg-slate-800 px-1 text-[10px] uppercase tracking-wide text-slate-400">
            EN
          </span>{" "}
          badge in Library.
        </p>
      </Field>

      <Field label="Overlearn mastered items">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.overlearnMastered}
            onChange={(e) => void save({ overlearnMastered: e.target.checked })}
          />
          Keep surfacing mastered items at long intervals
        </label>
      </Field>

      {/* Audit §3.2: implementation-intention plan. Editable after the
          first-run onboarding; clearing either field silently hides the
          Today cue tile until a cue is set again. */}
      <Field label="When I'll review (if-then plan)">
        <div className="space-y-2">
          <input
            type="text"
            list="ifThenCueOptions"
            value={settings.ifThenCue ?? ""}
            placeholder="cue (e.g. after morning coffee)"
            onChange={(e) =>
              void save({
                ifThenCue: e.target.value.trim() || undefined,
              })
            }
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <datalist id="ifThenCueOptions">
            {IF_THEN_CUES.filter((c) => c !== "other").map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <input
            type="text"
            list="ifThenPlaceOptions"
            value={settings.ifThenPlace ?? ""}
            placeholder="place (optional)"
            onChange={(e) =>
              void save({
                ifThenPlace: e.target.value.trim() || undefined,
              })
            }
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <datalist id="ifThenPlaceOptions">
            {IF_THEN_PLACES.filter((p) => p !== "other").map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Today surfaces a gentle reminder when the cue window opens and
          you haven't reviewed in a while. Leaving both blank hides the
          tile — no nagging.
        </p>
      </Field>

      {/* Audit §3.1: anchor statements for exam-morning reappraisal. */}
      <Field label="Exam-day anchors (pre-write when calm)">
        <div className="space-y-2">
          <textarea
            value={settings.anchorWhy ?? ""}
            placeholder="Why I want this (one sentence)"
            rows={2}
            onChange={(e) =>
              void save({
                anchorWhy: e.target.value.trim() || undefined,
              })
            }
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <textarea
            value={settings.anchorFallback ?? ""}
            placeholder="If I fail: what I'll actually do (one sentence)"
            rows={2}
            onChange={(e) =>
              void save({
                anchorFallback: e.target.value.trim() || undefined,
              })
            }
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
          <textarea
            value={settings.anchorGoodEnough ?? ""}
            placeholder="What 'good enough' looks like for me"
            rows={2}
            onChange={(e) =>
              void save({
                anchorGoodEnough: e.target.value.trim() || undefined,
              })
            }
            className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Written now, re-read on exam morning. Keep each one short and
          specific — abstract anchors don't bite when adrenaline hits.
        </p>
      </Field>

      <Field label="Claude helper (optional)">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.useLLM}
            onChange={(e) => void save({ useLLM: e.target.checked })}
          />
          Enable
        </label>
        {settings.useLLM && (
          <div className="mt-2 space-y-2">
            <input
              type="password"
              placeholder="Anthropic API key (stored on device)"
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.target.value)}
              className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm"
            />
            {/* D-13: explicit Save button. onBlur saves were ambiguous —
                users couldn't tell if the key had actually persisted. */}
            <button
              type="button"
              onClick={() => void saveApiKey()}
              disabled={apiKeyDraft === (settings.anthropicKey ?? "")}
              className="rounded-lg bg-sky-700 px-3 py-2 text-xs disabled:opacity-50"
            >
              Save key
            </button>
          </div>
        )}
        <p className="mt-1 text-xs text-slate-400">
          Without a key, the "Ask Claude" button copies a prompt to clipboard
          and opens claude.ai — zero API setup required.
        </p>
      </Field>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-2 text-sm font-medium">Backup</h2>
        <div className="flex gap-2">
          <button
            className="flex-1 rounded-lg bg-sky-600 px-3 py-2 text-sm"
            onClick={doExport}
          >
            Export
          </button>
          <button
            className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm"
            onClick={() => fileRef.current?.click()}
          >
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.target.value = "";
            }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <h2 className="mb-2 text-sm font-medium">Diagnostics</h2>
        <p className="mb-3 text-xs text-slate-400">
          The app records uncaught errors locally so we can investigate
          crashes after the fact. Nothing is sent anywhere.
        </p>
        <div className="flex gap-2">
          <button
            className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm"
            onClick={() => void doExportErrors()}
          >
            Export error log
          </button>
          <button
            className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-sm"
            onClick={() => void doClearErrors()}
          >
            Clear log
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-red-900/50 bg-red-950/20 p-4">
        <h2 className="mb-2 text-sm font-medium text-red-200">Danger zone</h2>
        <button
          className="w-full rounded-lg bg-red-700 px-3 py-2 text-sm"
          onClick={() => setConfirmReset(true)}
        >
          Reset local state
        </button>
      </section>

      <ConfirmModal
        open={confirmReset}
        title="Wipe all local state?"
        message="This erases every review, session, flag, mock, and setting on this device. It cannot be undone. Export a backup first if you want to keep your progress."
        confirmLabel="Wipe"
        cancelLabel="Cancel"
        destructive
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => void doReset()}
      />

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-400">
        <div>
          Content version: <b>{CONTENT_VERSION}</b> · {RULES.length} rules ·{" "}
          {ITEMS.length} items
        </div>
        <div>
          App version: <b>{__APP_VERSION__}</b> · build {__GIT_SHA__} ({import.meta.env.MODE})
        </div>
      </section>

      {msg && (
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200">
          {msg}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-2 text-xs uppercase tracking-wide text-slate-400">
        {label}
      </div>
      {children}
    </label>
  );
}
