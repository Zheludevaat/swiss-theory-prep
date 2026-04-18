// F-1/F-2: verify the service-worker update orchestration obeys its two
// non-negotiables:
//   1. The update toast must suppress itself during a mock exam.
//   2. applyUpdate() must no-op when a mock is active, even if called directly.

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  __resetSWForTests,
  __triggerOfflineReadyForTests,
  __triggerPendingForTests,
  applyUpdate,
  dismissOfflineReady,
  hasPendingUpdate,
  isMockActive,
  isOfflineReady,
  setMockActive,
  subscribeToSWState,
} from "@/lib/swUpdate";

beforeEach(() => {
  __resetSWForTests();
});

describe("swUpdate state machine", () => {
  it("starts clean", () => {
    expect(hasPendingUpdate()).toBe(false);
    expect(isOfflineReady()).toBe(false);
    expect(isMockActive()).toBe(false);
  });

  it("notifies subscribers on pending update", () => {
    const spy = vi.fn();
    const unsub = subscribeToSWState(spy);
    __triggerPendingForTests(async () => {});
    expect(spy).toHaveBeenCalled();
    expect(hasPendingUpdate()).toBe(true);
    unsub();
  });

  it("setMockActive flips the flag and notifies", () => {
    const spy = vi.fn();
    subscribeToSWState(spy);
    setMockActive(true);
    expect(isMockActive()).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    // Same-value set should be a no-op.
    setMockActive(true);
    expect(spy).toHaveBeenCalledTimes(1);
    setMockActive(false);
    expect(isMockActive()).toBe(false);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("applyUpdate refuses to run while a mock is active", async () => {
    const reload = vi.fn(async () => {});
    __triggerPendingForTests(reload);
    setMockActive(true);
    await applyUpdate();
    expect(reload).not.toHaveBeenCalled();
    // Pending update is preserved — we want to apply it once the exam ends.
    expect(hasPendingUpdate()).toBe(true);
  });

  it("applyUpdate runs the pending reload when no mock is active", async () => {
    const reload = vi.fn(async () => {});
    __triggerPendingForTests(reload);
    await applyUpdate();
    expect(reload).toHaveBeenCalledWith(true);
    expect(hasPendingUpdate()).toBe(false);
  });

  it("offline-ready can be dismissed manually", () => {
    __triggerOfflineReadyForTests();
    expect(isOfflineReady()).toBe(true);
    dismissOfflineReady();
    expect(isOfflineReady()).toBe(false);
  });
});
