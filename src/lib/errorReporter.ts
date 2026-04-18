// E-4: install global listeners for uncaught errors and unhandled promise
// rejections, and persist a bounded ring of reports to IDB so the user can
// export them from Settings. This is strictly local — nothing leaves the
// device unless the user explicitly exports the file.
//
// Works alongside ErrorBoundary: the boundary catches *render* errors and
// keeps its own snapshot in localStorage; this file catches everything
// *else* (setTimeout callbacks, promise chains, event handlers) and
// preserves a full history.

import { reportError } from "@/db";
import type { ErrorReport } from "@/db/types";
import { uuid } from "@/lib/uuid";

function makeReport(
  kind: string,
  message: string,
  stack: string | undefined,
): ErrorReport {
  return {
    id: uuid(),
    at: Date.now(),
    kind,
    route: typeof location !== "undefined" ? location.hash : "",
    message,
    stack: stack ?? "",
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
}

/**
 * Record a report from the ErrorBoundary's componentDidCatch. Kept separate
 * so the boundary doesn't need to reach into the db layer directly.
 */
export async function reportReactError(
  error: Error,
  componentStack: string,
): Promise<void> {
  await reportError(
    makeReport("react", error.message, `${error.stack ?? ""}\n${componentStack}`),
  );
}

/**
 * Wire up window.onerror and window.onunhandledrejection. Safe to call
 * multiple times — we guard with a module-level flag.
 */
let installed = false;
export function installGlobalErrorReporter(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (ev) => {
    // ErrorEvent.error may be missing in some browsers; fall back to message.
    const err = ev.error as Error | undefined;
    void reportError(
      makeReport(
        "error",
        err?.message ?? ev.message ?? "(unknown error)",
        err?.stack,
      ),
    );
  });

  window.addEventListener("unhandledrejection", (ev) => {
    const reason = ev.reason as unknown;
    const message =
      reason instanceof Error
        ? reason.message
        : typeof reason === "string"
          ? reason
          : JSON.stringify(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;
    void reportError(makeReport("unhandledrejection", message, stack));
  });
}
