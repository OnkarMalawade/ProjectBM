import React, { useState } from "react";
import axios from "axios";

const MessageForm = ({ projectId, receiverId, onMessageSent }) => {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [isSending, setIsSending] = useState(false); // Added isSending state to prevent double submit

    const handleFileChange = (e) => setFiles([...e.target.files]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && files.length === 0) return; // Prevent submitting empty message

        const formData = new FormData();
        formData.append("content", content);
        formData.append("receiverId", receiverId);
        files.forEach((file) => formData.append("files", file));

        try {
            setIsSending(true); // Prevent further submissions while sending
            await axios.post(
                `http://localhost:3000/messages/upload/${projectId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token",
                        )}`,
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setContent(""); // Clear the content after sending
            setFiles([]); // Clear file input
            onMessageSent(); // Trigger message refresh
        } catch (err) {
            console.error("Send message error:", err);
        } finally {
            setIsSending(false); // Allow new submissions
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a message..."
                rows={3}
                required
                style={{ width: "100%", padding: "8px", borderRadius: "8px" }}
            />
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ marginTop: "8px" }}
            />
            <button
                type="submit"
                style={{ marginTop: "10px" }}
                disabled={isSending} // Disable the button while sending
            >
                {isSending ? "Sending..." : "Send"}
            </button>
        </form>
    );
};

export default MessageForm;
