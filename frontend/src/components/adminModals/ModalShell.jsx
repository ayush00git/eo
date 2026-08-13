"use client";
import { X } from "lucide-react";
import { Field, fieldClass, submitButtonClass } from "@/components/ui/form-field";

// Re-exported for existing importers (`import { Field } from ".../ModalShell"`).
export { Field, fieldClass, submitButtonClass };

/** Shared chrome for the admin add/update modals (venue & staff). */
export default function ModalShell({ isOpen, onClose, title, loading, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="size-6 animate-spin rounded-full border-2 border-neutral-300 border-t-amber-600" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
