import React, { useEffect, useState } from "react";
import axios from "axios";

const MessageList = ({ projectId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `http://localhost:3000/messages/project/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token",
                        )}`,
                    },
                },
            );
            setMessages(res.data);
        } catch (err) {
            console.error("Fetch messages error:", err);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [projectId]);

    if (loading) return <div>Loading messages...</div>; // Show loading state

    return (
        <div style={{ maxHeight: "60vh", overflowY: "auto", padding: "1rem" }}>
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    style={{
                        textAlign:
                            msg.sender.id === currentUserId ? "right" : "left",
                        marginBottom: "12px",
                        background:
                            msg.sender.id === currentUserId
                                ? "#d1f7c4"
                                : "#f1f1f1",
                        padding: "10px",
                        borderRadius: "10px",
                        maxWidth: "75%",
                        marginLeft:
                            msg.sender.id === currentUserId ? "auto" : 0,
                    }}
                >
                    <div>
                        <strong>{msg.sender.name}</strong>
                    </div>
                    <div>{msg.content}</div>
                    {msg.fileUrls?.length > 0 && (
                        <ul style={{ marginTop: "6px" }}>
                            {msg.fileUrls.map((fileUrl, idx) => (
                                <li key={idx}>
                                    <a
                                        href={`http://localhost:3000${fileUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download File {idx + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div style={{ fontSize: "0.75rem", marginTop: "4px" }}>
                        {new Date(msg.created_at).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
