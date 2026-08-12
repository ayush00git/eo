"use client";
import React, { useState } from "react";

const EventDetails = ({ isOpen, onClose, selectedEvent,venues }) => {
    const [loading, setLoading] = useState(false);






    if (!isOpen) return null;

    return (


        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-xs bg-opacity-50 z-100">
            {loading ?
                <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
                    <div>Loading...</div>
                </div>
                :
                <div className="bg-white p-6 rounded-lg shadow-xl w-1/3 relative ">


                    {/* Close Button */}
                    <button
                        className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl"
                        onClick={onClose}
                    >
                        ✖
                    </button>

                    {/* Event Details */}
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedEvent.title}</h2>
                    <p className="text-gray-700 flex items-center">
                        🏢 <span className="ml-2 font-medium">{venues.find(v => v._id === selectedEvent.extendedProps.venueId)?.name || 'Unknown'}</span>
                    </p>
                    <p className="text-gray-700 flex items-center">
                        📅 <span className="ml-2">{new Date(selectedEvent.start).toLocaleString()}</span>
                    </p>
                    <p className="text-gray-700 flex items-center">
                        ⌛ <span className="ml-2">{new Date(selectedEvent.end||selectedEvent.start).toLocaleString()}</span>
                    </p>
                    <p className="text-gray-700 flex items-center">
                        🤵 <span className="ml-2 font-semibold">{selectedEvent.extendedProps.org}</span>
                    </p>
                    <p className="text-gray-700 flex items-center">
                        🤵 <span className="ml-2 font-semibold">{selectedEvent.extendedProps.user}</span>
                    </p>


                </div>}
        </div>
    );
}


export default EventDetails;
