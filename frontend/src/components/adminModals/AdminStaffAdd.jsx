"use client";
import React, { useState } from "react";
import ModalShell, { Field, fieldClass, submitButtonClass } from "./ModalShell";


const AdminModalStaff = ({ isOpen, onClose, onSubmit ,venues}) => {
    const [loading, setLoading] = useState(false);
    const [staffData, setstaffData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        designation: "",
        venue: ""
    });



    const handleChange = (e) => {

        const { id, value } = e.target;
        setstaffData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        onSubmit(staffData)
        setLoading(false);
        setstaffData({
            name: "",
            email: "",
            phoneNumber: "",
            designation: "",
            venue: ""
        });




    };

    return (
        <ModalShell isOpen={isOpen} onClose={onClose} title="Add new staff" loading={loading}>
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
                    Add staff
                </button>
            </form>
        </ModalShell>
    );
}


export default AdminModalStaff;
