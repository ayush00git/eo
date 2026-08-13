"use client";
import React, { useEffect, useState } from "react";
import ModalShell, { Field, fieldClass, submitButtonClass } from "@/components/adminModals/ModalShell";


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

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Update staff details" loading={loading}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Name">
                    <input
                        type="text"
                        id="name"
                        placeholder="Full name"
                        value={staffData.name}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Email">
                    <input
                        type="text"
                        id="email"
                        placeholder="Email address"
                        value={staffData.email}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Phone number">
                    <input
                        type="number"
                        id="phoneNumber"
                        placeholder="Phone number"
                        value={staffData.phoneNumber}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    />
                </Field>
                <Field label="Designation">
                    <input
                        id="designation"
                        placeholder="Designation"
                        value={staffData.designation}
                        onChange={handleChange}
                        className={fieldClass}
                    />
                </Field>
                <Field label="Venue">
                    <select
                        id="venue"
                        value={staffData.venue}
                        onChange={handleChange}
                        className={fieldClass}
                        required
                    >
                        <option value="">Select venue</option>
                        {venues.map((hall) => (
                            <option key={hall._id} value={hall._id}>
                                {hall.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <button type="submit" className={submitButtonClass}>
                    Update staff
                </button>
            </form>
        </ModalShell>
    );
}


export default StaffUpdateModal;
