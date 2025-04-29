"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Milestones = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [milestones, setMilestones] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("milestones");

    // Form state for creating milestone
    const [title, setTitle] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch project details
                const projectResponse = await axios.get(
                    `/projects/${projectId}`,
                );
                setProject(projectResponse.data);

                // Fetch milestones for this project
                const milestonesResponse = await axios.get(
                    `/milestones/project/${projectId}`,
                );
                setMilestones(milestonesResponse.data);

                // Fetch invoices for this project
                const invoicesResponse = await axios.get(
                    `/invoices/project/${projectId}`,
                );
                setInvoices(invoicesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    const handleCreateMilestone = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            await axios.post("/milestones", {
                title,
                due_date: dueDate,
                amount: Number.parseFloat(amount),
                projectId: Number.parseInt(projectId),
            });

            setSuccess("Milestone created successfully");

            // Reset form
            setTitle("");
            setDueDate("");
            setAmount("");

            // Refresh milestones
            const milestonesResponse = await axios.get(
                `/milestones/project/${projectId}`,
            );
            setMilestones(milestonesResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create milestone",
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateInvoice = async (
        milestoneId,
        milestoneTitle,
        milestoneAmount,
    ) => {
        setError("");
        setSuccess("");

        try {
            await axios.post("/invoices", {
                title: milestoneTitle,
                amount: milestoneAmount,
                projectId: Number.parseInt(projectId),
            });

            setSuccess("Invoice created successfully");

            // Refresh invoices
            const invoicesResponse = await axios.get(
                `/invoices/project/${projectId}`,
            );
            setInvoices(invoicesResponse.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create invoice");
        }
    };

    const handlePayInvoice = async (invoiceId) => {
        setError("");
        setSuccess("");

        try {
            await axios.put(`/invoices/${invoiceId}`, {
                status: "paid",
            });

            setSuccess("Invoice marked as paid");

            // Refresh invoices
            const invoicesResponse = await axios.get(
                `/invoices/project/${projectId}`,
            );
            setInvoices(invoicesResponse.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update invoice");
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

    const tabsContainerStyle = {
        display: "flex",
        borderBottom: "1px solid #ddd",
        marginBottom: "24px",
    };

    const tabStyle = {
        padding: "12px 24px",
        cursor: "pointer",
        borderBottom: "2px solid transparent",
    };

    const activeTabStyle = {
        ...tabStyle,
        borderBottom: "2px solid #4CAF50",
        fontWeight: "bold",
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

    const buttonStyle = {
        padding: "10px 16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    };

    const outlineButtonStyle = {
        padding: "8px 16px",
        backgroundColor: "transparent",
        border: "1px solid #ddd",
        color: "#333",
        borderRadius: "4px",
        cursor: "pointer",
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

    const paidStatusStyle = {
        display: "flex",
        alignItems: "center",
        color: "#155724",
    };

    const emptyCardStyle = {
        ...cardStyle,
        padding: "24px",
        textAlign: "center",
    };

    if (loading) {
        return <div style={containerStyle}>Loading milestones...</div>;
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
                    <p>
                        You'll be able to create milestones once you accept a
                        bid.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div>
                <h1 style={headingStyle}>Milestones & Invoices</h1>
                <p style={subheadingStyle}>Project: {project.title}</p>
            </div>

            {error && <div style={errorAlertStyle}>{error}</div>}

            {success && <div style={successAlertStyle}>{success}</div>}

            <div style={tabsContainerStyle}>
                <div
                    style={
                        activeTab === "milestones" ? activeTabStyle : tabStyle
                    }
                    onClick={() => setActiveTab("milestones")}
                >
                    Milestones
                </div>
                <div
                    style={activeTab === "invoices" ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab("invoices")}
                >
                    Invoices
                </div>
            </div>

            {activeTab === "milestones" && (
                <div>
                    {user?.role === "client" && (
                        <div style={cardStyle}>
                            <div style={cardHeaderStyle}>
                                <h2 style={cardTitleStyle}>Create Milestone</h2>
                                <div style={cardDescriptionStyle}>
                                    Break down your project into manageable
                                    milestones
                                </div>
                            </div>
                            <div style={cardContentStyle}>
                                <form
                                    onSubmit={handleCreateMilestone}
                                    style={formStyle}
                                >
                                    <div style={inputGroupStyle}>
                                        <label
                                            htmlFor="title"
                                            style={labelStyle}
                                        >
                                            Title
                                        </label>
                                        <input
                                            id="title"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="e.g., Initial Design, Backend Development"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label
                                            htmlFor="dueDate"
                                            style={labelStyle}
                                        >
                                            Due Date
                                        </label>
                                        <input
                                            id="dueDate"
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) =>
                                                setDueDate(e.target.value)
                                            }
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label
                                            htmlFor="amount"
                                            style={labelStyle}
                                        >
                                            Amount (USD)
                                        </label>
                                        <input
                                            id="amount"
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                            placeholder="e.g., 200"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        style={{
                                            ...buttonStyle,
                                            opacity: submitting ? 0.7 : 1,
                                        }}
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? "Creating..."
                                            : "Create Milestone"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {milestones.length === 0 ? (
                        <div style={emptyCardStyle}>
                            <p>
                                No milestones have been created for this project
                                yet.
                            </p>
                        </div>
                    ) : (
                        <div>
                            {milestones.map((milestone) => (
                                <div key={milestone.id} style={cardStyle}>
                                    <div style={cardHeaderStyle}>
                                        <h3 style={cardTitleStyle}>
                                            {milestone.title}
                                        </h3>
                                        <div style={cardDescriptionStyle}>
                                            Due:{" "}
                                            {new Date(
                                                milestone.due_date,
                                            ).toLocaleDateString()}{" "}
                                            • Amount: ${milestone.amount} •
                                            Status: {milestone.status}
                                        </div>
                                    </div>
                                    <div style={cardContentStyle}>
                                        <p>
                                            Created:{" "}
                                            {new Date(
                                                milestone.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {user?.role === "client" && (
                                        <div style={cardFooterStyle}>
                                            <button
                                                onClick={() =>
                                                    handleCreateInvoice(
                                                        milestone.id,
                                                        milestone.title,
                                                        milestone.amount,
                                                    )
                                                }
                                                style={outlineButtonStyle}
                                            >
                                                Create Invoice
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "invoices" && (
                <div>
                    {invoices.length === 0 ? (
                        <div style={emptyCardStyle}>
                            <p>
                                No invoices have been created for this project
                                yet.
                            </p>
                        </div>
                    ) : (
                        <div>
                            {invoices.map((invoice) => (
                                <div key={invoice.id} style={cardStyle}>
                                    <div style={cardHeaderStyle}>
                                        <h3 style={cardTitleStyle}>
                                            {invoice.title}
                                        </h3>
                                        <div style={cardDescriptionStyle}>
                                            Amount: ${invoice.amount} • Status:{" "}
                                            {invoice.status}
                                        </div>
                                    </div>
                                    <div style={cardContentStyle}>
                                        <p>
                                            Created:{" "}
                                            {new Date(
                                                invoice.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {user?.role === "client" &&
                                        invoice.status === "pending" && (
                                            <div style={cardFooterStyle}>
                                                <button
                                                    onClick={() =>
                                                        handlePayInvoice(
                                                            invoice.id,
                                                        )
                                                    }
                                                    style={outlineButtonStyle}
                                                >
                                                    Mark as Paid
                                                </button>
                                            </div>
                                        )}
                                    {invoice.status === "paid" && (
                                        <div style={cardFooterStyle}>
                                            <div style={paidStatusStyle}>
                                                ✓ Paid
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Milestones;
