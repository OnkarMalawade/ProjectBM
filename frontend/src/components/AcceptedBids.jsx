import { useEffect, useState } from "react";
import { getFreelancerAcceptedBids } from "../api/bids";

export default function AcceptedBids() {
    const [bids, setBids] = useState([]);

    useEffect(() => {
        getFreelancerAcceptedBids()
            .then((res) => setBids(res.data))
            .catch((err) =>
                console.error("Failed to fetch accepted bids", err),
            );
    }, []);

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">✅ Your Accepted Bids</h2>
            {bids.map((bid) => (
                <div key={bid.id} className="border p-4 rounded shadow mb-4">
                    <p>
                        <strong>Project:</strong> {bid.project.title}
                    </p>
                    <p>
                        <strong>Amount:</strong> ${bid.amount}
                    </p>
                    <p>
                        <strong>Message:</strong> {bid.message}
                    </p>
                    <p>
                        <strong>Status:</strong> {bid.status}
                    </p>
                    <p>
                        <strong>Accepted On:</strong>{" "}
                        {new Date(bid.created_at).toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    );
}
