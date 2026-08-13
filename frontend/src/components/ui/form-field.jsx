/** Shared input styling used across the app's forms (admin modals, booking
 * form, etc.) so every field looks and behaves the same way. */
export const fieldClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 placeholder:text-neutral-400";

export function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
      {children}
    </div>
  );
}

export const submitButtonClass =
  "flex w-full items-center justify-center gap-1.5 rounded-md bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-neutral-300";
