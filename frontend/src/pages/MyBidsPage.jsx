import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBidsPage = () => {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRemainingBids = async () => {
        try {
            const token = localStorage.getItem("token"); // 👈 Make sure token is stored at login
            if (!token) {
                setError("You are not logged in");
                return;
            }

            const response = await axios.get(
                "http://localhost:3000/bids/freelancer/remaining",
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 👈 JWT token here
                    },
                },
            );

            setBids(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bids");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRemainingBids();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h1>My Remaining Bids</h1>
            {bids.length === 0 ? (
                <p>No remaining bids found.</p>
            ) : (
                <ul>
                    {bids.map((bid) => (
                        <li key={bid.id}>
                            <strong>Project:</strong> {bid.project.title} <br />
                            <strong>Amount:</strong> ${bid.amount} <br />
                            <strong>Status:</strong> {bid.status} <br />
                            <strong>Message:</strong> {bid.message} <br />
                            <strong>Submitted:</strong>{" "}
                            {new Date(bid.created_at).toLocaleString()}
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyBidsPage;
