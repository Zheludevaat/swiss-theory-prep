// Test environment setup. Runs before each suite.
//
// We swap in fake-indexeddb so the IDB layer can round-trip data without a
// real browser. RTL's matchers come in via @testing-library/jest-dom.
//
// matchMedia and a few other browser APIs aren't on jsdom by default. We
// stub the ones our components touch so smoke tests don't blow up.

import "@testing-library/jest-dom/vitest";
import "fake-indexeddb/auto";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { __resetDbForTests } from "@/db";

// Reset IDB between tests so suites stay isolated. fake-indexeddb persists
// state across the module's lifetime by default — fine for a single suite,
// disastrous when multiple suites compete for the same store names.
beforeEach(async () => {
  // Drop the module-level cached db connection so the next db() reopens
  // against the fresh store below. Without this our cached Promise would
  // point at a connection to the about-to-be-deleted database and any
  // operation against it would hang.
  await __resetDbForTests();
  // Delete every database so each test starts clean. indexedDB.databases is
  // available in fake-indexeddb v6+.
  const dbs = await indexedDB.databases();
  await Promise.all(
    dbs.map((d) => {
      if (!d.name) return Promise.resolve();
      return new Promise<void>((resolve, reject) => {
        const req = indexedDB.deleteDatabase(d.name!);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
        req.onblocked = () => resolve();
      });
    }),
  );
  // Wipe localStorage so previousData / install-prompt flags etc. don't leak.
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

afterEach(() => {
  cleanup();
});

// jsdom doesn't ship matchMedia. The Today install-prompt + reduced-motion
// CSS use it; without a stub we'd see undefined-method errors in smoke tests.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// jsdom doesn't ship the IntersectionObserver, ResizeObserver, or AudioContext
// surfaces our chart/sticky/mock components touch indirectly. Tiny no-op
// stubs keep them out of the way without changing component behaviour.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (typeof globalThis !== "undefined") {
  const g = globalThis as unknown as Record<string, unknown>;
  g.IntersectionObserver ??= NoopObserver as unknown;
  g.ResizeObserver ??= NoopObserver as unknown;
}
