"use client";
import React, { useState } from "react";
import { Building2, Calendar, Clock, User, X } from "lucide-react";

const EventDetails = ({ isOpen, onClose, selectedEvent, venues }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-opacity-50 p-4 backdrop-blur-xs"
            onClick={onClose}
        >
            {loading ? (
                <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                    <div>Loading...</div>
                </div>
            ) : (
                <div
                    className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl sm:max-w-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-3 right-3 rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </button>

                    {/* Event Details */}
                    <h2 className="mb-4 pr-8 text-xl font-bold text-gray-800 sm:text-2xl">{selectedEvent.title}</h2>

                    <div className="space-y-3">
                        <p className="flex items-center text-gray-700">
                            <Building2 className="size-4 shrink-0 text-gray-500" />
                            <span className="ml-2 font-medium">
                                {venues.find(v => v._id === selectedEvent.extendedProps.venueId)?.name || 'Unknown'}
                            </span>
                        </p>
                        <p className="flex items-center text-gray-700">
                            <Calendar className="size-4 shrink-0 text-gray-500" />
                            <span className="ml-2">{new Date(selectedEvent.start).toLocaleString()}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                            <Clock className="size-4 shrink-0 text-gray-500" />
                            <span className="ml-2">{new Date(selectedEvent.end || selectedEvent.start).toLocaleString()}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                            <User className="size-4 shrink-0 text-gray-500" />
                            <span className="ml-2 font-semibold">{selectedEvent.extendedProps.org}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                            <User className="size-4 shrink-0 text-gray-500" />
                            <span className="ml-2 font-semibold">{selectedEvent.extendedProps.user}</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}


export default EventDetails;
