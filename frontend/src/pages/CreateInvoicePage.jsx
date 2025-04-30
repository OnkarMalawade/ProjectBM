// src/pages/CreateInvoicePage.jsx
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchWithAuth } from "../api"; // assumes wrapper with token

const CreateInvoicePage = () => {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState("");
    const [status, setStatus] = useState("pending");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchClientProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("User not logged in");

                const decoded = jwtDecode(token);
                const clientId = decoded.id;

                const allProjects = await fetchWithAuth("/projects");
                const filteredProjects = allProjects.filter(
                    (project) => project.client?.id === clientId,
                );

                setProjects(filteredProjects);
            } catch (err) {
                setMessage("Error loading projects: " + err.message);
            }
        };

        fetchClientProjects();
    }, []);

    const handleCreateInvoice = async () => {
        if (!projectId) {
            setMessage("Please select a project.");
            return;
        }

        try {
            const endpoint =
                status === "pending" ? "/invoices/pending" : "/invoices/accept";

            const res = await fetchWithAuth(endpoint, "POST", {
                projectId: parseInt(projectId),
            });

            setMessage(`Invoice created with status "${status}".`);
        } catch (error) {
            setMessage("Error creating invoice: " + error.message);
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Create Invoice</h2>

            <div style={{ marginBottom: "1rem" }}>
                <label>Project:</label>
                <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                >
                    <option value="">-- Select a project --</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.title} (₹{p.budget})
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label>Status:</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                </select>
            </div>

            <button onClick={handleCreateInvoice} disabled={!projectId}>
                Create Invoice
            </button>

            {message && (
                <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>
            )}
        </div>
    );
};

export default CreateInvoicePage;
