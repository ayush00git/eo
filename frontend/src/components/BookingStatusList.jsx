import { useState } from "react";
import { MdModeEdit, MdDelete } from "react-icons/md";

const BookingList = ({ filteredBookings, venuesList, handleEdit, handleDelete,handleCancel }) => {
    const [expandedBookingId, setExpandedBookingId] = useState(null);

    return (
        <div className="p-6 bg-white rounded-xl drop-shadow-lg min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Booking Status</h1>

            {/* Booking List */}
            {filteredBookings.length===0&&<div className="mx-auto text-gray-400 text-xl w-full text-center mt-5">No Data</div>}
            <div className="space-y-4">
                {filteredBookings
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map((booking) => {
                        const isExpanded = expandedBookingId === booking._id;

                        return (
                            <div key={booking._id} className="relative">
                                {/* Booking Card */}
                                <div className="p-5 bg-white border-l-8 shadow-md rounded-lg flex justify-between items-center border-gray-300 transition-all hover:shadow-lg">
                                    {/* Left Section */}
                                    <div className="space-y-2">
                                        <h2 className="font-bold text-lg">
                                            {venuesList.find((venue) => venue._id === booking.hall)?.name || "Unknown Venue"}
                                        </h2>
                                        <p className="text-gray-700 font-semibold">{booking.title}</p>

                                        <div className="text-gray-600 text-sm flex items-center space-x-2">
                                            <span className="font-medium">📅 {booking.startDate} → {booking.endDate}</span>
                                            <span className="font-medium">🕒 {booking.startTime} - {booking.endTime}</span>
                                        </div>

                                        <p className="text-gray-700 font-semibold">{booking.Organization}</p>
                                        <p className="text-gray-500 italic">{booking.resonForBooking}</p>
                                    </div>

                                    {/* Right Section */}
                                    <div className="flex items-center space-x-3">
                                        {/* Admin Message Toggle */}
                                        {booking.messFromAdmin && (
                                            <button
                                                className="text-blue-500 underline hover:text-blue-700 cursor-pointer"
                                                onClick={() =>
                                                    setExpandedBookingId(isExpanded ? null : booking._id)
                                                }
                                            >
                                                {isExpanded ? "Hide Message" : "View Message"}
                                            </button>
                                        )}

                                        {/* Status Badge */}
                                       {booking.status==='cancelled'&&
                                       <>
                                        <span
                                            className={`px-3 py-1 text-sm font-semibold rounded-full bg-gray-800 text-white `}
                                        >
                                           Cancelled At:
                                        </span>
                                        <span
                                            className={`px-3 py-1 text-sm font-semibold rounded-full`}
                                        >
                                            {new Date(booking.updatedAt).toDateString()}
                                        </span>
                                        </>
                                        }
                                        <span
                                            className={`px-3 py-1 text-sm font-semibold rounded-full ${booking.status === "approved"
                                                ? "bg-green-500 text-white"
                                                : booking.status === "pending"?
                                                "bg-yellow-500 text-white":
                                                booking.status === "cancelled"?
                                                "bg-black text-white":
                                                "bg-red-500 text-white"
                                                }`}
                                        >
                                            {booking.status.toUpperCase()}
                                        </span>

                                        {/* Edit & Delete Buttons */}
                                        {booking.status === "pending" && (
                                            <><button
                                                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                                                onClick={() => handleEdit(booking._id)}
                                            >
                                                <MdModeEdit size={18} />
                                            </button>
                                                <button
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                                    onClick={() => handleDelete(booking._id)}
                                                >
                                                    <MdDelete size={18} />
                                                </button></>
                                        )}
                                        {booking.status === "approved" && (
                                            <span
                                            className={`px-3 py-1 text-sm font-semibold rounded-full bg-red-500 text-white cursor-pointer`}
                                            onClick={() => handleCancel(booking._id)}
                                        >
                                            CANCEL
                                        </span>

                                        )}


        
                                    </div>
                                </div>

                                {/* Expanded Message Below the Card */}
                                {isExpanded && (
                                    <div className="mt-2 p-4 bg-gray-100 rounded-md border border-gray-300 transition-all" style={{ whiteSpace: "pre-wrap" }}>
                                        {booking.messFromAdmin}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default BookingList;
