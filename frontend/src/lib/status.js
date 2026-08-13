// Shared booking-status vocabulary so every list (admin requests, a user's
// own bookings) renders the same badge colours instead of each picking its
// own ad-hoc palette.
export const STATUS_BADGE = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  cancelled: "bg-neutral-100 text-neutral-500 ring-1 ring-inset ring-neutral-200",
};
