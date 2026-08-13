"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ModalShell, { Field, fieldClass, submitButtonClass } from "@/components/adminModals/ModalShell";


const VenueUpdateFormModal = ({ isOpen, onClose, onSubmit,initialData={} }) => {
    const [loading, setLoading] = useState(false);
    const [venueData, setVenueData] = useState({
        name: "",
        location: "",
        capacity: "",
        description: "",
        image: "",
    });

    useEffect(() => {
        setVenueData({
            name: initialData.name || "",
            location: initialData.location || "",
            capacity: initialData.capacity || "",
            description: initialData.description || "",
            image: initialData.image||null
        });
    }, [initialData]);
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
                updatedFormData = { ...venueData, image: res.data.secure_url }

            }
            catch (error) {
                setLoading(false);
                toast.error("Error in Uploading Data")

            }

        }
        setLoading(false);
        onSubmit(updatedFormData,initialData._id)
        onClose();

    };

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Update venue details" loading={loading}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Venue name">
                    <input
                        type="text"
                        id="name"
                        placeholder="Venue name"
                        value={venueData.name}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Location">
                    <input
                        type="text"
                        id="location"
                        placeholder="Location"
                        value={venueData.location}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Current image">
                    <img
                        src={venueData.image}
                        className="h-40 w-full rounded-md object-cover"
                        alt={venueData.name}
                    />
                </Field>
                <Field label="Replace image">
                    <input
                        type="file"
                        id="image"
                        onChange={handleChange}
                        className={fieldClass}
                    />
                </Field>
                <Field label="Capacity">
                    <input
                        type="number"
                        id="capacity"
                        placeholder="Capacity"
                        value={venueData.capacity}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Description">
                    <textarea
                        id="description"
                        placeholder="Description"
                        value={venueData.description}
                        onChange={handleChange}
                        className={fieldClass}
                        rows="3"
                    />
                </Field>
                <button type="submit" className={submitButtonClass}>
                    Update venue
                </button>
            </form>
        </ModalShell>
    );
}


export default VenueUpdateFormModal;
