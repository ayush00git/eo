"use client";
import React, { useState } from "react";
import AdminMessageInput from "./AdminMessInput";

const ApproveModal = ({ isOpen, onClose, selectedEvent, onSubmit, venues, approvedBookings }) => {
    const [loading, setLoading] = useState(false);
    const [adminMessage, setAdminMessage] = useState("");


    if (!isOpen || !selectedEvent) return null;

    // Find venue details
    const venue = venues.find(v => v._id === selectedEvent.hall)?.name;

    // Convert date & time to Date objects for comparison
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
        
        onSubmit(selectedEvent._id, 'approved',!!adminMessage ,adminMessage,conflicts)
            
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
                        <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl" onClick={() => {
                            onClose()
                            setAdminMessage("");
                        }}>
                            ✖
                        </button>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Approve Booking</h2>

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

                        {/* Conflict Warning */}
                        {conflicts.length > 0 && (
                            <div className="mt-4 p-3 border border-red-500 bg-red-100 rounded-md">
                                <p className="text-red-600 font-semibold">⚠️ Conflict Detected!</p>
                                {conflicts.map((conflict, index) => (
                                    <p key={index} className="text-sm text-red-700">
                                        ❌ {conflict.title} at {venue?.name} ({conflict.startTime} - {conflict.endTime})
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Admin Message Field */}
                        <label className="block mt-4 text-gray-700 font-medium">Attach Message (Optional):</label>
                        <AdminMessageInput adminMessage={adminMessage} setAdminMessage={setAdminMessage}/>

                        {/* Approve Button */}
                        <div className="flex justify-center mt-4 gap-3 items-center">
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                onClick={handleSubmit}
                            >
                                ✅ Approve Booking with {adminMessage ? "Attach Message" : "Auto Message"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApproveModal;
