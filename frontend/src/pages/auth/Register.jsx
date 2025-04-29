"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("client");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await register(name, email, password, role);
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Registration failed. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
    };

    const cardStyle = {
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
    };

    const cardHeaderStyle = {
        padding: "20px",
        borderBottom: "1px solid #eee",
    };

    const cardTitleStyle = {
        fontSize: "24px",
        fontWeight: "bold",
        margin: "0 0 8px 0",
    };

    const cardDescriptionStyle = {
        color: "#666",
        margin: "0",
    };

    const cardContentStyle = {
        padding: "20px",
    };

    const formStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
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

    const radioGroupStyle = {
        display: "flex",
        gap: "16px",
    };

    const radioItemStyle = {
        display: "flex",
        alignItems: "center",
        gap: "8px",
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

    const cardFooterStyle = {
        padding: "20px",
        borderTop: "1px solid #eee",
        textAlign: "center",
    };

    const linkStyle = {
        color: "#4CAF50",
        textDecoration: "none",
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
            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <h2 style={cardTitleStyle}>Register</h2>
                    <p style={cardDescriptionStyle}>
                        Create an account to get started
                    </p>
                </div>
                <div style={cardContentStyle}>
                    {error && <div style={alertStyle}>{error}</div>}
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputGroupStyle}>
                            <label htmlFor="name" style={labelStyle}>
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={inputGroupStyle}>
                            <label htmlFor="email" style={labelStyle}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={inputGroupStyle}>
                            <label htmlFor="password" style={labelStyle}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={inputGroupStyle}>
                            <label htmlFor="confirmPassword" style={labelStyle}>
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Account Type</label>
                            <div style={radioGroupStyle}>
                                <div style={radioItemStyle}>
                                    <input
                                        type="radio"
                                        id="client"
                                        name="role"
                                        value="client"
                                        checked={role === "client"}
                                        onChange={() => setRole("client")}
                                    />
                                    <label htmlFor="client">Client</label>
                                </div>
                                <div style={radioItemStyle}>
                                    <input
                                        type="radio"
                                        id="freelancer"
                                        name="role"
                                        value="freelancer"
                                        checked={role === "freelancer"}
                                        onChange={() => setRole("freelancer")}
                                    />
                                    <label htmlFor="freelancer">
                                        Freelancer
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            style={{
                                ...buttonStyle,
                                opacity: isLoading ? 0.7 : 1,
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
                <div style={cardFooterStyle}>
                    <p style={{ color: "#666" }}>
                        Already have an account?{" "}
                        <Link to="/login" style={linkStyle}>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
