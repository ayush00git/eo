"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";


const StaffUpdateModal = ({ isOpen, onClose, onSubmit, initialData = {} ,venues}) => {
    const [loading, setLoading] = useState(false);
    const [staffData, setstaffData] = useState({
        name: "",
        location: "",
        capacity: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        if(initialData) {
        setstaffData({
            name: initialData.name || "",
            designation: initialData.designation || "",
            email: initialData.email || "",
            phoneNumber: initialData.phoneNumber || "",
            venue: initialData.venue || "",

        });
    }
    }, [initialData]);



    const handleChange = (e) => {
        const { id, value } = e.target;
        setstaffData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedFormData = staffData;
        setLoading(true);
        onSubmit(updatedFormData, initialData._id)
        setLoading(false);
        onClose();

    };

    if (!isOpen) return null;

    return (


        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs bg-opacity-50 z-100">
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
                    <h2 className="text-xl font-bold mb-4">Update Staff Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            value={staffData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            id="email"
                            placeholder="Email"
                            value={staffData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            id="phoneNumber"
                            placeholder="phone Number"
                            value={staffData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            id="designation"
                            placeholder="Designation"
                            value={staffData.designation}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows="3"
                        />
                        
                            <select
                                id="venue"
                                value={staffData.venue}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            >
                                <option value="">Select Venue</option>
                                {venues.map((hall) => (
                                    <option key={hall._id} value={hall._id}>
                                        {hall.name}
                                    </option>
                                ))}
                            </select>
                        
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Update Venue
                        </button>
                    </form>
                </div>}
        </div>
    );
}


export default StaffUpdateModal;
