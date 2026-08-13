"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";
import ModalShell, { Field, fieldClass, submitButtonClass } from "@/components/adminModals/ModalShell";

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

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Edit booking request" loading={loading}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Venue">
                    <select
                        id="hall"
                        value={BookingData.hall}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    >
                        <option value="">Select venue</option>
                        {venueList.map((venue) => (
                            <option key={venue._id} value={venue._id}>
                                {venue.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Event title">
                    <input
                        type="text"
                        id="title"
                        value={BookingData.title}
                        onChange={handleChange}
                        placeholder="Event title"
                        className={fieldClass}
                        required
                    />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Start date">
                        <input
                            type="date"
                            id="startDate"
                            value={BookingData.startDate}
                            onChange={handleChange}
                            className={fieldClass}
                            required
                        />
                    </Field>
                    <Field label="End date">
                        <input
                            type="date"
                            id="endDate"
                            value={BookingData.endDate}
                            onChange={handleChange}
                            className={fieldClass}
                            required
                        />
                    </Field>
                    <Field label="Start time">
                        <input
                            type="time"
                            id="startTime"
                            value={BookingData.startTime}
                            onChange={handleChange}
                            className={fieldClass}
                            required
                        />
                    </Field>
                    <Field label="End time">
                        <input
                            type="time"
                            id="endTime"
                            value={BookingData.endTime}
                            onChange={handleChange}
                            className={fieldClass}
                            required
                        />
                    </Field>
                </div>
                <Field label="Organization">
                    <input
                        type="text"
                        id="Organization"
                        value={BookingData.Organization}
                        onChange={handleChange}
                        placeholder="Organization name"
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Reason for booking">
                    <input
                        type="text"
                        id="resonForBooking"
                        value={BookingData.resonForBooking}
                        onChange={handleChange}
                        placeholder="Reason for booking"
                        className={fieldClass}
                    />
                </Field>

                {BookingData.document && (
                    <a
                        href={BookingData.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:underline"
                    >
                        <FileText className="size-4" />
                        View current document
                    </a>
                )}
                <Field label="Replace document">
                    <input
                        type="file"
                        id="image"
                        onChange={handleChange}
                        className={fieldClass}
                        accept="image/*,application/pdf"
                    />
                </Field>

                <button type="submit" className={submitButtonClass}>
                    Update booking
                </button>
            </form>
        </ModalShell>
    );
}


export default BookingEditModal;
