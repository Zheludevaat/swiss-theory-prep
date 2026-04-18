// Chunk 8 F-1/F-2: service-worker update orchestration. Two jobs:
//   1. Manage the "new version available" prompt so the user opts in rather
//      than being hot-swapped mid-session — especially during a 45-minute
//      mock exam, where a forced reload would destroy hard-earned answers.
//   2. Capture offline-ready once, so we can show a one-time confirmation
//      toast after first install.
//
// The module is a tiny event store: components subscribe via the
// `useSyncExternalStore` hook in UpdateToast and re-render on state changes.
// Tests can drive the state directly via the __triggerPendingForTests +
// __resetSWForTests helpers (the real `registerSW` is mocked under vitest).

import { registerSW } from "virtual:pwa-register";

type Listener = () => void;
type UpdateSW = (reloadPage?: boolean) => Promise<void>;

let installed = false;
let pendingUpdate: UpdateSW | null = null;
let offlineReady = false;
let mockActive = false;
const listeners = new Set<Listener>();

function notify(): void {
  for (const fn of listeners) fn();
}

/**
 * Register the service worker with prompt-based updates. Idempotent.
 * Safe to call from main.tsx at boot — does nothing in non-browser envs.
 */
export function installSWRegistration(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;
  try {
    const updateSW = registerSW({
      onNeedRefresh() {
        pendingUpdate = updateSW;
        notify();
      },
      onOfflineReady() {
        offlineReady = true;
        notify();
        // Auto-dismiss after 4s — this is a "nice to know" signal, not
        // something requiring user action.
        setTimeout(() => {
          offlineReady = false;
          notify();
        }, 4000);
      },
    });
  } catch {
    /* SW registration can fail in dev / non-HTTPS — non-fatal */
  }
}

/** Subscribe to changes in update / offline / mock state. Returns unsubscribe. */
export function subscribeToSWState(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function hasPendingUpdate(): boolean {
  return pendingUpdate !== null;
}

export function isOfflineReady(): boolean {
  return offlineReady;
}

export function dismissOfflineReady(): void {
  offlineReady = false;
  notify();
}

/**
 * Activate the pending service worker and reload. No-op when nothing
 * pending. The toast UI gates this on `!isMockActive()` already, but we
 * also bail here defensively — if we somehow get called mid-mock the
 * answer is still "do nothing".
 */
export async function applyUpdate(): Promise<void> {
  if (!pendingUpdate || mockActive) return;
  const sw = pendingUpdate;
  pendingUpdate = null;
  notify();
  await sw(true);
}

/**
 * F-1: mark a mock exam as active/inactive. The UpdateToast respects this
 * flag and refuses to prompt the user for a reload while a mock is running.
 * We still receive and stash the pending update — when the mock ends and
 * the flag flips back, the toast re-evaluates and shows it.
 */
export function setMockActive(active: boolean): void {
  if (mockActive === active) return;
  mockActive = active;
  notify();
}

export function isMockActive(): boolean {
  return mockActive;
}

// --- test helpers -----------------------------------------------------------

export function __resetSWForTests(): void {
  installed = false;
  pendingUpdate = null;
  offlineReady = false;
  mockActive = false;
  listeners.clear();
}

export function __triggerPendingForTests(fn: UpdateSW): void {
  pendingUpdate = fn;
  notify();
}

export function __triggerOfflineReadyForTests(): void {
  offlineReady = true;
  notify();
}
