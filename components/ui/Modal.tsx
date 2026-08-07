"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Marks the action as destructive — swaps the accent from gold to the error tone. */
  tone?: "default" | "danger";
}

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-4xl",
};

export function Modal({ open, onClose, title, description, children, footer, size = "md", tone = "default" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-overlay-in bg-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        tabIndex={-1}
        className={cn(
          "glass glass-border relative max-h-[85vh] w-full overflow-y-auto animate-scale-in rounded-xl p-6 shadow-popover outline-none",
          sizes[size]
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-lg font-semibold text-navy-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-m-1.5 shrink-0 rounded-full p-1.5 text-navy-400 transition-colors hover:bg-navy-100 hover:text-navy-700 dark:text-navy-500 dark:hover:bg-white/10 dark:hover:text-navy-200"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        {description && (
          <p id="modal-description" className="mt-1.5 text-sm text-navy-600 dark:text-navy-300">
            {description}
          </p>
        )}
        <div className="mt-4">{children}</div>
        {footer && (
          <div className={cn("mt-6 flex flex-wrap justify-end gap-3", tone === "danger" && "[&_button:first-child]:order-2")}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  loading?: boolean;
}

/** A pre-wired Modal for yes/no confirmations — replaces window.confirm() with something on-brand and screen-reader friendly. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      tone={tone}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-card transition-all duration-300 ease-premium hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60",
              tone === "danger" ? "bg-error hover:bg-error/90" : "bg-navy-800 hover:bg-navy-700"
            )}
          >
            {loading ? "Working…" : confirmLabel}
          </button>
        </>
      }
    />
  );
}
