"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ProjectCreation = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if not a client
    if (user?.role !== "client") {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await axios.post("/projects", {
                title,
                description,
                budget: Number.parseFloat(budget),
            });

            navigate(`/projects/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create project");
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle = {
        maxWidth: "800px",
        margin: "0 auto",
    };

    const headingStyle = {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "24px",
    };

    const cardStyle = {
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
    };

    const cardHeaderStyle = {
        padding: "20px",
        borderBottom: "1px solid #eee",
    };

    const cardTitleStyle = {
        fontSize: "20px",
        fontWeight: "bold",
        marginBottom: "4px",
    };

    const cardDescriptionStyle = {
        color: "#666",
    };

    const cardContentStyle = {
        padding: "20px",
    };

    const formStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    };

    const inputGroupStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    };

    const labelStyle = {
        fontWeight: "500",
    };

    const inputStyle = {
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "16px",
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: "200px",
        resize: "vertical",
    };

    const buttonStyle = {
        padding: "10px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
    };

    const alertStyle = {
        padding: "10px",
        backgroundColor: "#f8d7da",
        color: "#721c24",
        borderRadius: "4px",
        marginBottom: "16px",
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Create a New Project</h1>

            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <h2 style={cardTitleStyle}>Project Details</h2>
                    <p style={cardDescriptionStyle}>
                        Provide details about your project to attract the right
                        freelancers
                    </p>
                </div>
                <div style={cardContentStyle}>
                    {error && <div style={alertStyle}>{error}</div>}

                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputGroupStyle}>
                            <label htmlFor="title" style={labelStyle}>
                                Project Title
                            </label>
                            <input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Website Redesign, Mobile App Development"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="description" style={labelStyle}>
                                Project Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your project requirements, goals, and expectations"
                                style={textareaStyle}
                                required
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="budget" style={labelStyle}>
                                Budget (USD)
                            </label>
                            <input
                                id="budget"
                                type="number"
                                min="1"
                                step="0.01"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="e.g., 500"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                ...buttonStyle,
                                opacity: isLoading ? 0.7 : 1,
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Project"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectCreation;
