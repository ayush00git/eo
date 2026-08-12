import { useState, useRef } from "react";

const AdminMessageInput = ({ adminMessage, setAdminMessage }) => {
    const textAreaRef = useRef(null);

    const handleChange = (e) => {
        setAdminMessage(e.target.value);

        // Auto-expand textarea
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto"; // Reset height
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px"; // Adjust to content
        }
    };

    return (
        <textarea
            ref={textAreaRef}
            className="w-full p-2 border border-gray-300 rounded-md overflow-y-auto resize-none transition-all"
            placeholder="Enter any message..."
            value={adminMessage}
            onChange={handleChange}
            rows={3} // Starts with 3 rows
            style={{ minHeight: "60px", maxHeight: "300px" }} // Limits height to avoid excessive expansion
        />
    );
};

export default AdminMessageInput;
