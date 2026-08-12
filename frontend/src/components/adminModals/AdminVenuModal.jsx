"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const VenueFormModal = ({ isOpen, onClose, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [venueData, setVenueData] = useState({
        name: "",
        location: "",
        capacity: "",
        description: "",
    });
    const [image, setImage] = useState(null);


    const handleChange = (e) => {
        const { id, value, files } = e.target;
        if (files && files[0]) {
            setImage(files[0]);
        }
        else
            setVenueData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedFormData = venueData;
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "trails");
            setLoading(true);
            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/dy0fshunc/image/upload", data)
                setLoading(false);
                updatedFormData = { ...venueData, image: res.data.secure_url }
                onSubmit(updatedFormData)
                onClose();
            }
            catch (error) {
                setLoading(false);
                console.log(error);
                toast.error("Error in Uploading Data")

            }
            
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
                    <h2 className="text-xl font-bold mb-4">Add New Venue</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            id="name"
                            placeholder="Venue Name"
                            value={venueData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            id="location"
                            placeholder="Location"
                            value={venueData.location}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="file"
                            id="image"
                            placeholder="Image"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            id="capacity"
                            placeholder="Capacity"
                            value={venueData.capacity}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <textarea
                            id="description"
                            placeholder="Description"
                            value={venueData.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows="3"
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Add Venue
                        </button>
                    </form>
                </div>}
        </div>
    );
}


export default VenueFormModal;
