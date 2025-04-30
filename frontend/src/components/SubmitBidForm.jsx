import { useState } from "react";
import { useParams } from "react-router-dom";
import { submitBid } from "../api/bids";

export default function SubmitBidForm() {
    const { projectId } = useParams();
    const [form, setForm] = useState({
        amount: "",
        duration_days: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitBid({
                ...form,
                amount: parseFloat(form.amount),
                duration_days: parseInt(form.duration_days),
                projectId: parseInt(projectId),
            });
            alert("Bid submitted successfully!");
        } catch (err) {
            console.error("Bid submission failed", err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8"
        >
            <h2 className="text-xl font-bold mb-4">📨 Submit a Bid</h2>
            <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="Bid Amount"
                required
                className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <input
                name="duration_days"
                type="number"
                value={form.duration_days}
                onChange={handleChange}
                placeholder="Duration (Days)"
                required
                className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your message"
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Submit Bid
            </button>
        </form>
    );
}
