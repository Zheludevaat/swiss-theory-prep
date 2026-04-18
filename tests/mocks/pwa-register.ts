// Vitest stub for `virtual:pwa-register`. The real module is injected by
// vite-plugin-pwa at build time and isn't resolvable in a non-Vite context;
// re-mapping the alias here lets us import swUpdate.ts (and anything that
// transitively imports it) from tests without blowing up at module load.

type Options = {
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
};

export function registerSW(_opts: Options = {}): (reload?: boolean) => Promise<void> {
  // No-op: tests drive swUpdate state through its __triggerPendingForTests
  // and __triggerOfflineReadyForTests helpers instead of the SW lifecycle.
  return async () => {
    /* noop */
  };
}
