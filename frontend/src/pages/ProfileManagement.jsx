"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProfileManagement = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setBio(user.bio || "");
            if (user.profile_image) {
                setPreviewUrl(user.profile_image);
            }
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("bio", bio);
            if (profileImage) {
                formData.append("profile_image", profileImage);
            }

            await updateProfile(formData);
            setSuccess("Profile updated successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
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
        minHeight: "120px",
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
        borderRadius: "4px",
        marginBottom: "16px",
    };

    const errorAlertStyle = {
        ...alertStyle,
        backgroundColor: "#f8d7da",
        color: "#721c24",
    };

    const successAlertStyle = {
        ...alertStyle,
        backgroundColor: "#d4edda",
        color: "#155724",
    };

    const imageContainerStyle = {
        display: "flex",
        alignItems: "flex-start",
        gap: "16px",
    };

    const imagePreviewStyle = {
        width: "96px",
        height: "96px",
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const uploadButtonStyle = {
        padding: "8px 16px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ddd",
        borderRadius: "4px",
        cursor: "pointer",
        display: "inline-block",
        marginBottom: "8px",
    };

    const helperTextStyle = {
        fontSize: "12px",
        color: "#666",
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Profile Management</h1>

            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <h2 style={cardTitleStyle}>Your Profile</h2>
                    <p style={cardDescriptionStyle}>
                        Update your personal information and profile picture
                    </p>
                </div>
                <div style={cardContentStyle}>
                    {error && <div style={errorAlertStyle}>{error}</div>}

                    {success && <div style={successAlertStyle}>{success}</div>}

                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputGroupStyle}>
                            <label htmlFor="name" style={labelStyle}>
                                Full Name
                            </label>
                            <input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="bio" style={labelStyle}>
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself"
                                style={textareaStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="profileImage" style={labelStyle}>
                                Profile Image
                            </label>
                            <div style={imageContainerStyle}>
                                <div style={imagePreviewStyle}>
                                    {previewUrl ? (
                                        <img
                                            src={
                                                previewUrl || "/placeholder.svg"
                                            }
                                            alt="Profile preview"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <span style={{ color: "#666" }}>
                                            {user?.name?.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div>
                                        <input
                                            id="profileImage"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: "none" }}
                                        />
                                        <label
                                            htmlFor="profileImage"
                                            style={uploadButtonStyle}
                                        >
                                            Upload Image
                                        </label>
                                    </div>
                                    <p style={helperTextStyle}>
                                        Recommended: Square image, at least
                                        200x200px
                                    </p>
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
                            {isLoading ? "Updating..." : "Update Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileManagement;
