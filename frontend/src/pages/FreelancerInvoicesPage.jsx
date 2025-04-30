// src/pages/FreelancerInvoicesPage.jsx
import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../api";

const FreelancerInvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                const data = await fetchWithAuth("/invoices");
                setInvoices(data);
            } catch (err) {
                setError("Failed to fetch invoices");
            }
        };
        loadInvoices();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h2>My Invoices</h2>
            {error && <p>{error}</p>}
            {invoices.length === 0 ? (
                <p>No invoices found.</p>
            ) : (
                <ul>
                    {invoices.map((inv) => (
                        <li key={inv.id}>
                            <strong>Project:</strong> {inv.project.title} |{" "}
                            <strong>Amount:</strong> ${inv.amount} |{" "}
                            <strong>Status:</strong> {inv.status}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FreelancerInvoicesPage;
