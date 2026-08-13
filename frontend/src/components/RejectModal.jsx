"use client";
import React, { useState } from "react";
import { Building2, Calendar, Clock, Users, AlertTriangle, X } from "lucide-react";
import AdminMessageInput from "./AdminMessInput";
import ModalShell from "@/components/adminModals/ModalShell";
import toast from "react-hot-toast";

const RejectModal = ({ isOpen, onClose, selectedEvent, onSubmit, venues,approvedBookings }) => {
    const [loading, setLoading] = useState(false);
    const [adminMessage, setAdminMessage] = useState("");
    const [ConflictReason, setConflictReason] = useState(false);

    if (!isOpen || !selectedEvent) return null;

    const getDateTime = (date, time) => new Date(`${date}T${time}:00`);

    // Find conflicts: same venue + overlapping time
    const conflicts = approvedBookings.filter(booking => {
        if (booking.hall !== selectedEvent.hall) return false; // Different halls, no conflict

        const selectedStart = getDateTime(selectedEvent.startDate, selectedEvent.startTime);
        const selectedEnd = getDateTime(selectedEvent.endDate, selectedEvent.endTime);

        const approvedStart = getDateTime(booking.startDate, booking.startTime);
        const approvedEnd = getDateTime(booking.endDate, booking.endTime);
        return selectedStart < approvedEnd && selectedEnd > approvedStart; // Overlapping condition
    });

    const handleSubmit = () => {
        setLoading(true)
        if(!adminMessage && !ConflictReason){
            toast.error("Please provide a reason for rejection");
            setLoading(false);
            return;
        }
        onSubmit(selectedEvent._id, 'rejected',!ConflictReason, adminMessage,conflicts)
        setAdminMessage("");
        setLoading(false)
        onClose()

    }

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Reject booking" loading={loading}>
            <div className="space-y-2 text-sm text-neutral-700">
                <p className="flex items-center gap-2">
                    <Building2 className="size-4 shrink-0 text-neutral-400" />
                    {venues.find((venue) => venue._id === selectedEvent.hall)?.name || "Unknown venue"}
                </p>
                <p className="flex items-center gap-2">
                    <Calendar className="size-4 shrink-0 text-neutral-400" />
                    {selectedEvent.startDate} to {selectedEvent.endDate}
                </p>
                <p className="flex items-center gap-2">
                    <Clock className="size-4 shrink-0 text-neutral-400" />
                    {selectedEvent.startTime} &ndash; {selectedEvent.endTime}
                </p>
                <p className="flex items-center gap-2">
                    <Users className="size-4 shrink-0 text-neutral-400" />
                    {selectedEvent.Organization}
                </p>
            </div>

            {conflicts.length > 0 && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-red-700">
                        <AlertTriangle className="size-4" />
                        Conflict detected
                    </p>
                    <ul className="mt-1.5 space-y-1">
                        {conflicts.map((conflict, index) => (
                            <li key={index} className="text-sm text-red-600">
                                {conflict.title} ({conflict.startTime} &ndash; {conflict.endTime})
                            </li>
                        ))}
                    </ul>

                    <label className="mt-3 flex items-center gap-2 text-sm text-neutral-700">
                        <input
                            type="checkbox"
                            id="check2"
                            className="size-4 cursor-pointer accent-amber-600"
                            onChange={(e) => setConflictReason(e.target.checked)}
                        />
                        Use conflicts as reason
                    </label>
                </div>
            )}

            {!ConflictReason && (
                <>
                    <label className="mt-4 mb-1 block text-sm font-medium text-neutral-700">
                        Reason for rejection
                    </label>
                    <AdminMessageInput adminMessage={adminMessage} setAdminMessage={setAdminMessage} />
                </>
            )}

            <button
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                onClick={handleSubmit}
            >
                <X className="size-4" />
                Reject with {adminMessage ? "above reason" : "reason"}
            </button>
        </ModalShell>
    );
};

export default RejectModal;
