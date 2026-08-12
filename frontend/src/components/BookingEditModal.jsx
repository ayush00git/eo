"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BookingEditModal = ({ initalData,isOpen, onClose, onSubmit,venueList=[] }) => {
    const [loading, setLoading] = useState(false);
    const [BookingData, setBookingData] = useState({
        title: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        hall: "",
        Organization: "",
        resonForBooking: "",
        document: "",
        image: "",
    });
    
    useEffect(() => {
        if (initalData) {
            setBookingData({
                title: initalData.title||"",
                startDate: initalData.startDate||"",
                endDate: initalData.endDate||"",
                startTime: initalData.startTime||"",
                endTime: initalData.endTime||"",
                hall: initalData.hall||"",
                Organization: initalData.Organization||"",
                resonForBooking: initalData.resonForBooking||"",
                document: initalData.document||"",
            });
        }
    }, [initalData]);

    const [image, setImage] = useState(null);
    const handleChange = (e) => {
        const { id, value, files } = e.target;
        if (files && files[0]) {
            setImage(files[0]);
        }
        else
            setBookingData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedFormData = BookingData;

        if (image) {
            if(image.type!=='application/pdf'&&image.type!=='image/jpeg'&&image.type!=='image/png'&&image.type!=='image/jpg'){
                toast.error('Only PDF, png, jpeg, jpg are allowed')
                setLoading(false);
                return; 
              }
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "trails");
            setLoading(true);
            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/dy0fshunc/image/upload", data)
                setLoading(false);
                updatedFormData = { ...BookingData, document: res.data.secure_url }
                onSubmit(initalData._id,updatedFormData)
                onClose();
            }
            catch (error) {
                setLoading(false);
                console.log(error);
                if (error.response && error.response.data.error.message.includes("File size")) {
                    toast.error("File Is too large")
                  }
                toast.error("Error in Uploading Data")

            }
            
        }
        else {
            onSubmit(initalData._id,BookingData)
            onClose();
        }

    };

    if (!isOpen) return null;

    return (


        <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-xs bg-opacity-50 z-100">
            {loading ?
                <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
                    <div>Loading...</div>
                </div>
                :
                <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
                    <button
                        className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                    <h2 className="text-xl font-bold mb-4">Edit Booking Request</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <select
                            id="hall"
                            value={BookingData.hall}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Venue</option>
                            {venueList.map((venue) => (
                                <option key={venue._id} value={venue._id}>
                                    {venue.name}
                                </option>
                            ))}
                        </select> 
                        <input
                            type="text"
                            id="title"
                            value={BookingData.title}
                            onChange={handleChange}
                            placeholder="Event Title"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="date"
                            id="startDate"
                            value={BookingData.startDate}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="date"
                            id="endDate"
                            value={BookingData.endDate}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="time"
                            id="startTime"
                            value={BookingData.startTime}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="time"
                            id="endTime"
                            value={BookingData.endTime}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            id="Organization"
                            value={BookingData.Organization}
                            onChange={handleChange}
                            placeholder="Organization Name"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            id="resonForBooking"
                            value={BookingData.resonForBooking}
                            onChange={handleChange}
                            placeholder="Reason for Booking"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            
                        />

                        <a href={BookingData.document} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Document</a>
                        <input
                            type="file"
                            id="image"
                            value={BookingData.image}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            accept="image/*,application/pdf"
                            
                        />
                    
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Update Booking
                        </button>
                    </form>
                </div>}
        </div>
    );
}


export default BookingEditModal;
