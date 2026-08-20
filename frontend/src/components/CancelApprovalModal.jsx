"use client";
import React, { useState } from "react";
import { Building2, Calendar, Clock, Users, Ban } from "lucide-react";
import AdminMessageInput from "./AdminMessInput";
import ModalShell from "@/components/adminModals/ModalShell";

const CancelApprovalModal = ({ isOpen, onClose, selectedEvent, onSubmit, venues }) => {
    const [loading, setLoading] = useState(false);
    const [adminMessage, setAdminMessage] = useState("");

    if (!isOpen || !selectedEvent) return null;

    const handleConfirm = () => {
        setLoading(true);
        onSubmit(selectedEvent._id, "cancelled", false, adminMessage);
        setAdminMessage("");
        setLoading(false);
        onClose();
    };

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Cancel approval" loading={loading}>
            <p className="text-sm text-neutral-600">
                This will cancel the already-approved booking below. The requester will be notified by email.
            </p>

            <div className="mt-3 space-y-2 text-sm text-neutral-700">
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

            <label className="mt-4 mb-1 block text-sm font-medium text-neutral-700">
                Message to requester (optional)
            </label>
            <AdminMessageInput adminMessage={adminMessage} setAdminMessage={setAdminMessage} />

            <button
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                onClick={handleConfirm}
            >
                <Ban className="size-4" />
                Confirm cancellation
            </button>
        </ModalShell>
    );
};

export default CancelApprovalModal;
