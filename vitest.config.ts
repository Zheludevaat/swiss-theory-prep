// Vitest config split out of vite.config.ts so the production build doesn't
// load test-only dependencies (jsdom, fake-indexeddb, RTL). Keeps the alias
// in sync with the main config.
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // The `virtual:pwa-register` module is provided by vite-plugin-pwa at
      // build time. In vitest we stub it so swUpdate.ts — and anything that
      // imports UpdateToast / App — can load without a real SW runtime.
      "virtual:pwa-register": path.resolve(
        __dirname,
        "tests/mocks/pwa-register.ts",
      ),
    },
  },
  // Mirror vite.config.ts's define block so code that reads __APP_VERSION__
  // or __GIT_SHA__ (e.g. Settings footer) renders in tests without throwing.
  define: {
    __APP_VERSION__: JSON.stringify("test"),
    __GIT_SHA__: JSON.stringify("testsha"),
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./tests/setup.ts"],
    // Coverage is opt-in via `npm test -- --coverage`. We don't enforce a
    // threshold here yet — Chunk 11's DoD asks for >=80% on scheduler/exam/
    // store; that's tracked manually for now.
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    // We use forks (instead of threads) because some CI sandboxes don't
    // allow worker threads (vitest hangs indefinitely on a threaded pool).
    // Each test file still runs in its own fork so module-level state
    // (cached IDB connection, zustand store) is fresh per file.
    pool: "forks",
  },
});
