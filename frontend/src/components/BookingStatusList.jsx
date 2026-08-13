import { useState } from "react";
import { Calendar, Clock, Pencil, Trash2, Inbox } from "lucide-react";
import { STATUS_BADGE } from "@/lib/status";
import { cn } from "@/lib/utils";

const BookingList = ({ filteredBookings, venuesList, handleEdit, handleDelete, handleCancel }) => {
    const [expandedBookingId, setExpandedBookingId] = useState(null);

    if (filteredBookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 py-14 text-center">
                <Inbox className="size-6 text-neutral-300" />
                <p className="text-sm font-medium text-neutral-600">No bookings here yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {filteredBookings
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((booking) => {
                    const isExpanded = expandedBookingId === booking._id;

                    return (
                        <div
                            key={booking._id}
                            className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-900">
                                        {venuesList.find((venue) => venue._id === booking.hall)?.name || "Unknown venue"}
                                    </h2>
                                    <p className="text-sm font-medium text-neutral-700">{booking.title}</p>
                                    <p className="text-sm text-neutral-500">{booking.Organization}</p>
                                </div>
                                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", STATUS_BADGE[booking.status])}>
                                    {booking.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="size-4 text-neutral-400" />
                                    {booking.startDate} &rarr; {booking.endDate}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="size-4 text-neutral-400" />
                                    {booking.startTime} &ndash; {booking.endTime}
                                </span>
                                {booking.status === "cancelled" && (
                                    <span className="text-neutral-400">
                                        Cancelled {new Date(booking.updatedAt).toDateString()}
                                    </span>
                                )}
                            </div>

                            {booking.resonForBooking && (
                                <p className="mt-3 text-sm text-neutral-500 italic">{booking.resonForBooking}</p>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                {booking.messFromAdmin && (
                                    <button
                                        className="text-sm font-medium text-amber-700 hover:underline"
                                        onClick={() => setExpandedBookingId(isExpanded ? null : booking._id)}
                                    >
                                        {isExpanded ? "Hide message" : "View message"}
                                    </button>
                                )}

                                <div className="ml-auto flex items-center gap-2">
                                    {booking.status === "pending" && (
                                        <>
                                            <button
                                                className="rounded-md p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                                                onClick={() => handleEdit(booking._id)}
                                                aria-label="Edit booking"
                                            >
                                                <Pencil className="size-4" />
                                            </button>
                                            <button
                                                className="rounded-md p-1.5 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
                                                onClick={() => handleDelete(booking._id)}
                                                aria-label="Delete booking"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </>
                                    )}
                                    {booking.status === "approved" && (
                                        <button
                                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => handleCancel(booking._id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div
                                    className="mt-3 rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-sm text-neutral-600"
                                    style={{ whiteSpace: "pre-wrap" }}
                                >
                                    {booking.messFromAdmin}
                                </div>
                            )}
                        </div>
                    );
                })}
        </div>
    );
};

export default BookingList;
