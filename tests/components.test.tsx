// E-2: smoke tests for self-contained components.
//
// ErrorBoundary and ConfirmModal both have non-trivial behavior (error
// capture + recovery UI, focus trap + escape handling) that's easy to
// regress silently. These don't touch the global store, so they're cheap.

import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ConfirmModal from "@/components/ConfirmModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function Boom(): never {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  it("renders children when they don't throw", () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("all good")).toBeInTheDocument();
  });

  it("renders the fallback with recovery buttons when a child throws", () => {
    // Silence React's noisy error log for this intentional throw.
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText("Something broke")).toBeInTheDocument();
    expect(screen.getByText(/boom/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reload" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Export backup" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Wipe and restart" }),
    ).toBeInTheDocument();

    // The error report should be mirrored into localStorage + window.__lastError
    // so future-us can inspect it from devtools.
    const raw = localStorage.getItem("lastErrorReport");
    expect(raw).not.toBeNull();
    const report = JSON.parse(raw!);
    expect(report.message).toBe("boom");
    expect((window as unknown as { __lastError?: unknown }).__lastError).toBeTruthy();

    err.mockRestore();
  });
});

describe("ConfirmModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <ConfirmModal
        open={false}
        title="Are you sure?"
        message="This deletes everything."
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders title + message + buttons when open", () => {
    render(
      <ConfirmModal
        open
        title="Are you sure?"
        message="This deletes everything."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("This deletes everything.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("cancels on Escape key", () => {
    const onCancel = vi.fn();
    render(
      <ConfirmModal
        open
        title="t"
        message="m"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("cancels on backdrop click", () => {
    const onCancel = vi.fn();
    render(
      <ConfirmModal
        open
        title="t"
        message="m"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    );
    // The backdrop is the dialog's role=presentation parent.
    const dialog = screen.getByRole("dialog");
    const backdrop = dialog.parentElement as HTMLElement;
    fireEvent.click(backdrop);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when the confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        open
        title="t"
        message="m"
        confirmLabel="Yes"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
