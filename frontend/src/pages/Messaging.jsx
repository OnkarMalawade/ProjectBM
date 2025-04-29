"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Messaging = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [project, setProject] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Fetch project details to get the other party's ID
                const projectResponse = await axios.get(
                    `/projects/${projectId}`,
                );
                setProject(projectResponse.data);

                // Fetch messages for this project
                const messagesResponse = await axios.get(
                    `/messages/project/${projectId}`,
                );
                setMessages(messagesResponse.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        // Set up polling for new messages
        const interval = setInterval(() => {
            fetchMessages();
        }, 5000);

        return () => clearInterval(interval);
    }, [projectId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !project) return;

        setSending(true);

        try {
            // Determine receiver ID based on user role
            const receiverId =
                user?.role === "client"
                    ? project.freelancer?.id
                    : project.client.id;

            if (!receiverId) {
                console.error("No receiver found");
                return;
            }

            await axios.post("/messages", {
                receiverId,
                projectId: Number.parseInt(projectId),
                content: newMessage,
            });

            // Refresh messages
            const messagesResponse = await axios.get(
                `/messages/project/${projectId}`,
            );
            setMessages(messagesResponse.data);

            // Clear input
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    const containerStyle = {
        padding: "20px",
    };

    const headingStyle = {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "8px",
    };

    const subheadingStyle = {
        color: "#666",
        marginBottom: "24px",
    };

    const cardStyle = {
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "70vh",
    };

    const cardHeaderStyle = {
        padding: "16px",
        borderBottom: "1px solid #eee",
    };

    const cardTitleStyle = {
        fontSize: "18px",
        fontWeight: "bold",
    };

    const messagesContainerStyle = {
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    };

    const messageStyle = (isOwn) => ({
        maxWidth: "80%",
        alignSelf: isOwn ? "flex-end" : "flex-start",
        backgroundColor: isOwn ? "#4CAF50" : "#f1f1f1",
        color: isOwn ? "white" : "black",
        borderRadius: "8px",
        padding: "12px",
    });

    const messageTimeStyle = {
        fontSize: "12px",
        marginTop: "4px",
        opacity: 0.7,
    };

    const inputContainerStyle = {
        padding: "16px",
        borderTop: "1px solid #eee",
        display: "flex",
        gap: "8px",
    };

    const textareaStyle = {
        flex: 1,
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "16px",
        resize: "none",
    };

    const buttonStyle = {
        padding: "10px 16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    };

    const emptyMessageStyle = {
        textAlign: "center",
        color: "#666",
        margin: "auto",
    };

    if (loading) {
        return <div style={containerStyle}>Loading messages...</div>;
    }

    if (!project) {
        return <div style={containerStyle}>Project not found</div>;
    }

    // Check if project has a freelancer assigned
    if (!project.freelancer && user?.role === "client") {
        return (
            <div style={containerStyle}>
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        padding: "24px",
                    }}
                >
                    <p>No freelancer has been assigned to this project yet.</p>
                    <p>You'll be able to message once you accept a bid.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div>
                <h1 style={headingStyle}>Messages</h1>
                <p style={subheadingStyle}>Project: {project.title}</p>
            </div>

            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <h2 style={cardTitleStyle}>
                        {user?.role === "client"
                            ? `Conversation with ${project.freelancer?.name}`
                            : `Conversation with ${project.client.name}`}
                    </h2>
                </div>
                <div style={messagesContainerStyle}>
                    {messages.length === 0 ? (
                        <p style={emptyMessageStyle}>
                            No messages yet. Start the conversation!
                        </p>
                    ) : (
                        messages.map((message) => (
                            <div
                                key={message.id}
                                style={messageStyle(
                                    message.sender.id === user?.id,
                                )}
                            >
                                <p>{message.content}</p>
                                <p style={messageTimeStyle}>
                                    {new Date(
                                        message.created_at,
                                    ).toLocaleTimeString()}{" "}
                                    by {message.sender.name}
                                </p>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div style={inputContainerStyle}>
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        style={textareaStyle}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={sending || !newMessage.trim()}
                        style={{
                            ...buttonStyle,
                            opacity: sending || !newMessage.trim() ? 0.7 : 1,
                        }}
                    >
                        {sending ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Messaging;
