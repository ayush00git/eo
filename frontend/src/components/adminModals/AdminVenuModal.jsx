"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ModalShell, { Field, fieldClass, submitButtonClass } from "./ModalShell";

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

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Add new venue" loading={loading}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Venue name">
                    <input
                        type="text"
                        id="name"
                        placeholder="e.g. Conference Hall II"
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
                        placeholder="e.g. 1st Floor, Auditorium"
                        value={venueData.location}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Image">
                    <input
                        type="file"
                        id="image"
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Capacity">
                    <input
                        type="number"
                        id="capacity"
                        placeholder="e.g. 120"
                        value={venueData.capacity}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Description">
                    <textarea
                        id="description"
                        placeholder="Short description of the venue"
                        value={venueData.description}
                        onChange={handleChange}
                        className={fieldClass}
                        rows="3"
                    />
                </Field>
                <button type="submit" className={submitButtonClass}>
                    Add venue
                </button>
            </form>
        </ModalShell>
    );
}


export default VenueFormModal;
