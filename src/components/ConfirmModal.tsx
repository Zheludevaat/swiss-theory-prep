// D-8: custom confirm modal. Native `confirm()` is unstyled, intercepts focus
// poorly on iOS PWAs, and gets auto-dismissed by some browser chrome. This is
// a small, dependency-free replacement with proper focus management:
//   - Focus lands on the cancel button when opened (safe default).
//   - Tab cycles between Cancel and Confirm (focus trap inside the dialog).
//   - Escape cancels.
//   - aria-modal + aria-labelledby so screen readers announce it correctly.

import { useEffect, useRef } from "react";

export type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Move focus to the safe (non-destructive) default.
    const t = window.setTimeout(() => cancelRef.current?.focus(), 0);
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Tab") {
        // Two-button focus trap — easy to reason about.
        const active = document.activeElement;
        if (active === confirmRef.current && !e.shiftKey) {
          e.preventDefault();
          cancelRef.current?.focus();
        } else if (active === cancelRef.current && e.shiftKey) {
          e.preventDefault();
          confirmRef.current?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={(e) => {
        // Click on backdrop (not the dialog itself) cancels.
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-body"
        className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-2xl"
      >
        <h2
          id="confirm-modal-title"
          className="text-lg font-semibold text-slate-100"
        >
          {title}
        </h2>
        <p id="confirm-modal-body" className="mt-2 text-sm text-slate-300">
          {message}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 rounded-xl bg-slate-800 px-3 py-3 text-sm"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmRef}
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-3 py-3 text-sm font-semibold ${
              destructive
                ? "bg-red-700 text-red-50"
                : "bg-sky-600 text-white"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
