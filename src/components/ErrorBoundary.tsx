// D-1: app-root error boundary. Anything that throws during render lands here
// instead of the white-screen-of-death. We deliberately give the user three
// recovery paths so they're never stuck:
//   - Reload (most fixes are transient)
//   - Export backup (preserve their progress before the next, scarier step)
//   - Wipe and restart (last resort if state is corrupt)
//
// We also persist the error to IDB best-effort so future-us can inspect it
// from the developer console (window.__lastError) — a much smaller commitment
// than wiring a real telemetry pipeline.

import { Component, type ErrorInfo, type ReactNode } from "react";
import { exportBackup, wipeAll } from "@/db";
import { reportReactError } from "@/lib/errorReporter";

type Props = { children: ReactNode };
type State = { error: Error | null; info: ErrorInfo | null };

const STORAGE_KEY = "lastErrorReport";

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ info });
    try {
      const report = {
        at: Date.now(),
        message: error.message,
        stack: error.stack ?? "",
        componentStack: info.componentStack ?? "",
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
      // Expose for console-debugging without leaking a global API surface.
      (window as unknown as { __lastError?: typeof report }).__lastError = report;
    } catch {
      /* localStorage may be full or blocked; we still render the fallback */
    }
    // E-4: mirror the boundary's capture into the IDB error log so it
    // appears alongside any uncaught-exception reports in Settings.
    void reportReactError(error, info.componentStack ?? "");
    console.error("ErrorBoundary:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleExport = async () => {
    try {
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
    } catch (err) {
      console.error("Backup export failed:", err);
      alert("Backup export failed. Try Reload instead.");
    }
  };

  handleWipe = async () => {
    if (
      !window.confirm(
        "Wipe all local review state and reload? This cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await wipeAll();
    } catch (err) {
      console.error("Wipe failed:", err);
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="mx-auto flex min-h-full max-w-lg flex-col gap-3 p-6 text-slate-200">
        <h1 className="text-2xl font-semibold text-red-300">Something broke</h1>
        <p className="text-sm text-slate-400">
          The app hit an unexpected error. Your progress is still on this device
          — try a reload first; if the problem keeps coming back, export a backup
          before wiping.
        </p>
        <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-red-200">
          {this.state.error.message}
        </pre>
        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => void this.handleExport()}
            className="rounded-xl bg-slate-800 px-4 py-3 text-sm"
          >
            Export backup
          </button>
          <button
            type="button"
            onClick={() => void this.handleWipe()}
            className="rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200"
          >
            Wipe and restart
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
