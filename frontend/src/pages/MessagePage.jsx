import React, { useState, useEffect } from "react";
import axios from "axios";

const MessagePage = () => {
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageContent, setMessageContent] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);
    const [file, setFile] = useState(null);

    // Fetching user projects based on their role
    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token"); // Assuming JWT token is stored in localStorage
            const response = await axios.get(
                "http://localhost:3000/messages/projects",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    // Fetching messages of a selected project
    const fetchMessages = async (projectId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:3000/messages/project/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleMessageChange = (event) => {
        setMessageContent(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleProjectSelect = async (projectId) => {
        const token = localStorage.getItem("token");
        const project = projects.find((p) => p.id === projectId);

        if (!project.client || !project.assignedFreelancer) {
            try {
                const res = await axios.get(
                    `http://localhost:3000/messages/projects`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );
                const fullProject = res.data.find((p) => p.id === projectId);
                setSelectedProject(fullProject);
                fetchMessages(projectId);
            } catch (err) {
                console.error("Error fetching full project info:", err);
            }
        } else {
            setSelectedProject(project);
            fetchMessages(projectId);
        }
    };

    const handleSendMessage = async () => {
        if (!messageContent.trim()) {
            alert("Please enter a message.");
            return;
        }

        if (
            !selectedProject ||
            !selectedProject.client ||
            !selectedProject.assignedFreelancer
        ) {
            alert("Invalid project selection or missing participant info.");
            return;
        }

        const token = localStorage.getItem("token");
        const currentUserId = JSON.parse(atob(token.split(".")[1])).sub;

        const receiverId =
            selectedProject.client.id === currentUserId
                ? selectedProject.assignedFreelancer.id
                : selectedProject.client.id;

        const formData = new FormData();
        formData.append("content", messageContent);
        formData.append("receiverId", receiverId);
        if (file) formData.append("files", file);

        try {
            await axios.post(
                `http://localhost:3000/messages/upload/${selectedProject.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setMessageContent("");
            setFile(null);
            fetchMessages(selectedProject.id);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Check console for details.");
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Project Messages</h1>

            <div style={styles.projectsList}>
                <h2 style={styles.subHeader}>Select a Project</h2>
                <ul style={styles.projectList}>
                    {projects.map((project) => (
                        <li
                            key={project.id}
                            style={styles.projectItem}
                            onClick={() => handleProjectSelect(project.id)}
                        >
                            {project.title}
                        </li>
                    ))}
                </ul>
            </div>

            {selectedProject && (
                <div style={styles.messagesContainer}>
                    <h2 style={styles.subHeader}>Messages for Project</h2>
                    <div style={styles.messagesList}>
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <div key={message.id} style={styles.message}>
                                    <p style={styles.messageSender}>
                                        {message.sender.name}:
                                    </p>
                                    <p style={styles.messageContent}>
                                        {message.content}
                                    </p>
                                    {message.fileUrls &&
                                        message.fileUrls.length > 0 && (
                                            <a
                                                href={`http://localhost:3000${message.fileUrls[0]}`}
                                                style={styles.fileLink}
                                            >
                                                Download file
                                            </a>
                                        )}
                                </div>
                            ))
                        ) : (
                            <p>No messages for this project.</p>
                        )}
                    </div>

                    <div style={styles.messageInput}>
                        <textarea
                            style={styles.textArea}
                            value={messageContent}
                            onChange={handleMessageChange}
                            placeholder="Type a message..."
                        />
                        <input
                            type="file"
                            onChange={handleFileChange}
                            style={styles.fileInput}
                        />
                        <button
                            style={styles.sendButton}
                            onClick={handleSendMessage}
                        >
                            Send Message
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
    },
    header: {
        textAlign: "center",
        color: "#333",
    },
    subHeader: {
        color: "#333",
    },
    projectsList: {
        marginBottom: "20px",
    },
    projectList: {
        listStyleType: "none",
        paddingLeft: 0,
    },
    projectItem: {
        padding: "10px",
        background: "#f1f1f1",
        marginBottom: "5px",
        cursor: "pointer",
        borderRadius: "5px",
    },
    messagesContainer: {
        marginTop: "20px",
    },
    messagesList: {
        marginBottom: "20px",
    },
    message: {
        background: "#e9f7fd",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "10px",
    },
    messageSender: {
        fontWeight: "bold",
        color: "#007bff",
    },
    messageContent: {
        marginTop: "5px",
    },
    fileLink: {
        marginTop: "10px",
        display: "inline-block",
        color: "#007bff",
        textDecoration: "none",
    },
    messageInput: {
        display: "flex",
        flexDirection: "column",
    },
    textArea: {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        resize: "vertical",
        minHeight: "100px",
        marginBottom: "10px",
    },
    fileInput: {
        marginBottom: "10px",
    },
    sendButton: {
        padding: "10px 20px",
        background: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default MessagePage;
