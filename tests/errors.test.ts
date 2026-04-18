// E-4: error reporter tests. Verifies the IDB store ring-buffer behaviour
// and that the global handlers persist captured errors.

import { describe, expect, it } from "vitest";
import {
  allErrorReports,
  clearErrorReports,
  reportError,
} from "@/db";
import { installGlobalErrorReporter } from "@/lib/errorReporter";
import type { ErrorReport } from "@/db/types";

const sample = (overrides: Partial<ErrorReport> = {}): ErrorReport => ({
  id: Math.random().toString(36).slice(2),
  at: Date.now(),
  kind: "error",
  route: "#/today",
  message: "boom",
  stack: "stack frames",
  userAgent: "test",
  ...overrides,
});

describe("error reporter store", () => {
  it("persists and reads back error reports newest-first", async () => {
    await reportError(sample({ id: "a", at: 1000, message: "first" }));
    await reportError(sample({ id: "b", at: 2000, message: "second" }));

    const all = await allErrorReports();
    // by-at index, "prev" cursor → newest first.
    expect(all.map((e) => e.id)).toEqual(["b", "a"]);
    expect(all[0]?.message).toBe("second");
  });

  it("trims to the last 50 reports", async () => {
    // Write 60. The store should retain only the most recent 50 by `at`.
    for (let i = 0; i < 60; i++) {
      await reportError(sample({ id: `e${i}`, at: 1000 + i, message: `e${i}` }));
    }
    const all = await allErrorReports();
    expect(all.length).toBe(50);
    // Newest first: id "e59" down to "e10".
    expect(all[0]?.id).toBe("e59");
    expect(all[49]?.id).toBe("e10");
  });

  it("clearErrorReports empties the store", async () => {
    await reportError(sample({ id: "a", at: 1 }));
    await clearErrorReports();
    expect(await allErrorReports()).toHaveLength(0);
  });
});

describe("global error reporter", () => {
  it("captures uncaught errors via window.error event", async () => {
    installGlobalErrorReporter();
    const err = new Error("uncaught oops");
    window.dispatchEvent(
      new ErrorEvent("error", { error: err, message: err.message }),
    );
    // The handler dispatches an async write; give it a tick to flush.
    await new Promise((r) => setTimeout(r, 10));
    const all = await allErrorReports();
    expect(all.some((e) => e.message === "uncaught oops" && e.kind === "error")).toBe(
      true,
    );
  });
});
