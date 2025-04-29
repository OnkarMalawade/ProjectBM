"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const FileUploads = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [files, setFiles] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch project details
                const projectResponse = await axios.get(
                    `/projects/${projectId}`,
                );
                setProject(projectResponse.data);

                // Fetch files for this project
                const filesResponse = await axios.get(
                    `/files/project/${projectId}`,
                );
                setFiles(filesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setError("");
        setSuccess("");
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("projectId", projectId);

            await axios.post("/files", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess("File uploaded successfully");
            setSelectedFile(null);

            // Reset file input
            const fileInput = document.getElementById("file");
            if (fileInput) fileInput.value = "";

            // Refresh files
            const filesResponse = await axios.get(
                `/files/project/${projectId}`,
            );
            setFiles(filesResponse.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = (filePath, filename) => {
        // Create a temporary link to download the file
        const link = document.createElement("a");
        link.href = `http://localhost:3000${filePath}`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        marginBottom: "24px",
    };

    const cardHeaderStyle = {
        padding: "16px",
        borderBottom: "1px solid #eee",
    };

    const cardTitleStyle = {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "4px",
    };

    const cardDescriptionStyle = {
        fontSize: "14px",
        color: "#666",
    };

    const cardContentStyle = {
        padding: "16px",
    };

    const cardFooterStyle = {
        padding: "16px",
        borderTop: "1px solid #eee",
    };

    const uploadContainerStyle = {
        border: "2px dashed #ddd",
        borderRadius: "8px",
        padding: "24px",
        textAlign: "center",
    };

    const fileIconStyle = {
        fontSize: "48px",
        color: "#666",
        marginBottom: "16px",
    };

    const uploadInstructionStyle = {
        color: "#666",
        marginBottom: "16px",
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

    const selectedFileStyle = {
        marginTop: "16px",
        fontSize: "14px",
    };

    const buttonStyle = {
        padding: "10px 16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        width: "100%",
        marginTop: "16px",
    };

    const outlineButtonStyle = {
        padding: "8px 16px",
        backgroundColor: "transparent",
        border: "1px solid #ddd",
        color: "#333",
        borderRadius: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
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

    const sectionTitleStyle = {
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "16px",
        marginTop: "32px",
    };

    const emptyCardStyle = {
        ...cardStyle,
        padding: "24px",
        textAlign: "center",
    };

    if (loading) {
        return <div style={containerStyle}>Loading files...</div>;
    }

    if (!project) {
        return <div style={containerStyle}>Project not found</div>;
    }

    // Check if project has a freelancer assigned
    if (!project.freelancer && user?.role === "client") {
        return (
            <div style={containerStyle}>
                <div style={emptyCardStyle}>
                    <p>No freelancer has been assigned to this project yet.</p>
                    <p>You'll be able to share files once you accept a bid.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div>
                <h1 style={headingStyle}>Files</h1>
                <p style={subheadingStyle}>Project: {project.title}</p>
            </div>

            {error && <div style={errorAlertStyle}>{error}</div>}

            {success && <div style={successAlertStyle}>{success}</div>}

            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <h2 style={cardTitleStyle}>Upload File</h2>
                    <div style={cardDescriptionStyle}>
                        Share documents, images, and other files with the
                        project team
                    </div>
                </div>
                <div style={cardContentStyle}>
                    <div style={uploadContainerStyle}>
                        <input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <div style={fileIconStyle}>📄</div>
                            <p style={uploadInstructionStyle}>
                                Drag and drop your file here, or click to browse
                            </p>
                            <label htmlFor="file" style={uploadButtonStyle}>
                                Select File
                            </label>
                        </div>
                        {selectedFile && (
                            <div style={selectedFileStyle}>
                                Selected: {selectedFile.name} (
                                {Math.round(selectedFile.size / 1024)} KB)
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        style={{
                            ...buttonStyle,
                            opacity: !selectedFile || uploading ? 0.7 : 1,
                        }}
                    >
                        {uploading ? "Uploading..." : "Upload File"}
                    </button>
                </div>
            </div>

            <div>
                <h2 style={sectionTitleStyle}>Project Files</h2>
                {files.length === 0 ? (
                    <div style={emptyCardStyle}>
                        <p>No files have been uploaded to this project yet.</p>
                    </div>
                ) : (
                    <div>
                        {files.map((file) => (
                            <div key={file.id} style={cardStyle}>
                                <div style={cardHeaderStyle}>
                                    <h3 style={cardTitleStyle}>
                                        {file.filename}
                                    </h3>
                                    <div style={cardDescriptionStyle}>
                                        Type: {file.file_type} • Uploaded by:{" "}
                                        {file.uploaded_by.name}
                                    </div>
                                </div>
                                <div style={cardContentStyle}>
                                    <p>
                                        Uploaded:{" "}
                                        {new Date(
                                            file.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div style={cardFooterStyle}>
                                    <button
                                        onClick={() =>
                                            handleDownload(
                                                file.file_path,
                                                file.filename,
                                            )
                                        }
                                        style={outlineButtonStyle}
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploads;
