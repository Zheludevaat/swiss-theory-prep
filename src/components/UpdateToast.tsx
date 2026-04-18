// Chunk 8 F-2: PWA status toast. Shows two transient messages:
//   - "App updated — tap to reload" when a new SW is available AND no mock
//     exam is running (F-1 — never interrupt an exam with a forced reload).
//   - "Ready to use offline" on first successful install.
//
// The update toast is sticky until the user acts. The offline-ready toast
// auto-dismisses after a few seconds (the swUpdate module handles the timer).

import { useSyncExternalStore } from "react";
import {
  applyUpdate,
  dismissOfflineReady,
  hasPendingUpdate,
  isMockActive,
  isOfflineReady,
  subscribeToSWState,
} from "@/lib/swUpdate";

type Snapshot = { pending: boolean; offline: boolean; mock: boolean };

// useSyncExternalStore requires getSnapshot to return a *stable* reference
// between calls when the underlying data hasn't changed. Cache the last
// object and return it unchanged unless a field flipped.
let cached: Snapshot = { pending: false, offline: false, mock: false };

function getSnapshot(): Snapshot {
  const next: Snapshot = {
    pending: hasPendingUpdate(),
    offline: isOfflineReady(),
    mock: isMockActive(),
  };
  if (
    next.pending === cached.pending &&
    next.offline === cached.offline &&
    next.mock === cached.mock
  ) {
    return cached;
  }
  cached = next;
  return cached;
}

function subscribe(fn: () => void): () => void {
  return subscribeToSWState(fn);
}

export default function UpdateToast() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Update prompt takes precedence — it's actionable; offline-ready is
  // informational. Never show during a mock exam, per F-1.
  if (state.pending && !state.mock) {
    return (
      <button
        type="button"
        className="safe-bottom fixed bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-xl border border-sky-700 bg-sky-900/95 px-4 py-2 text-sm font-medium text-sky-100 shadow-lg backdrop-blur"
        onClick={() => void applyUpdate()}
      >
        App updated — tap to reload
      </button>
    );
  }

  if (state.offline) {
    return (
      <button
        type="button"
        className="safe-bottom fixed bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-xl border border-emerald-700 bg-emerald-900/95 px-4 py-2 text-sm text-emerald-100 shadow-lg"
        onClick={() => dismissOfflineReady()}
      >
        Ready to use offline
      </button>
    );
  }

  return null;
}
