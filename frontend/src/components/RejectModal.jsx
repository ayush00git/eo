"use client";
import React, { useState } from "react";
import AdminMessageInput from "./AdminMessInput";
import toast from "react-hot-toast";

const RejectModal = ({ isOpen, onClose, selectedEvent, onSubmit, venues,approvedBookings }) => {
    const [loading, setLoading] = useState(false);
    const [adminMessage, setAdminMessage] = useState("");
    const [ConflictReason, setConflictReason] = useState(false);
    const venue = venues.find((v) => v._id === selectedEvent.hall)?.name;

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
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-30 backdrop-blur-sm z-100 ">
            <div className="bg-white p-6 rounded-lg shadow-xl w-1/3 relative">
                {loading ? (
                    <div className="text-center rounded-lg text-lg font-semibold">Processing...</div>
                ) : (
                    <div className="w-full">
                        {/* Close Button */}
                        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl" onClick={onClose}>
                            ✖
                        </button>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Reject Booking</h2>

                        {/* Booking Details */}
                        <p className="text-gray-700">
                            <strong>🏢 Venue:</strong> {venues.find((venue) => venue._id === selectedEvent.hall)?.name || "Unknown"}
                        </p>
                        <p className="text-gray-700">
                            <strong>📅 Date:</strong> {selectedEvent.startDate} To {selectedEvent.endDate}
                        </p>
                        <p className="text-gray-700">
                            <strong>⌛ Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}
                        </p>
                        <p className="text-gray-700">
                            <strong>🤵 Organization:</strong> {selectedEvent.Organization}
                        </p>
                        {conflicts.length>0&&<div className="flex mt-4 gap-3 items-center">
                        <input
                                type="checkbox"
                                id="check2"
                                className="w-5 h-5 cursor-pointer mt-2"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setConflictReason(true);
                                    } else {
                                        setConflictReason(false);
                                    }
                                }}
                            />
                            <label htmlFor="check2" className="text-gray-700 cursor-pointer mr-2">
                                Use Conflicts As Reason 
                            </label>
                        </div>}


                        {/* Admin Message Field */}
                       {!ConflictReason&&<> <label className="block mt-4 text-gray-700 font-medium">Reason of Rejection:</label>
                        <AdminMessageInput adminMessage={adminMessage}  setAdminMessage={setAdminMessage} /></>}

                        {/* Approve Button */}
                        <div className="flex justify-center mt-4 gap-3 items-center">
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                onClick={handleSubmit}
                            >
                                ❌ Reject Booking with {adminMessage ? "Above Reason" : "Reason"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RejectModal;
