import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBidsForProject, acceptBid } from "../api/bids";

export default function ProjectBids() {
    const { projectId } = useParams();
    const [bids, setBids] = useState([]);

    const fetchBids = async () => {
        try {
            const res = await getBidsForProject(projectId);
            setBids(res.data);
        } catch (err) {
            console.error("Failed to load bids", err);
        }
    };

    const handleAccept = async (bidId) => {
        try {
            await acceptBid(bidId);
            alert("Bid accepted!");
            fetchBids();
        } catch (err) {
            console.error("Error accepting bid", err);
        }
    };

    useEffect(() => {
        fetchBids();
    }, [projectId]);

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-semibold mb-6">
                📋 Bids for This Project
            </h2>
            {bids.map((bid) => (
                <div key={bid.id} className="border p-4 mb-4 rounded shadow">
                    <p>
                        <strong>Amount:</strong> ${bid.amount}
                    </p>
                    <p>
                        <strong>Duration:</strong> {bid.duration_days} days
                    </p>
                    <p>
                        <strong>Message:</strong> {bid.message}
                    </p>
                    <p>
                        <strong>Freelancer:</strong> {bid.freelancer.name} (
                        {bid.freelancer.email})
                    </p>
                    <p>
                        <strong>Status:</strong> {bid.status}
                    </p>
                    {bid.status !== "accepted" && (
                        <button
                            onClick={() => handleAccept(bid.id)}
                            className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            ✅ Accept Bid
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
