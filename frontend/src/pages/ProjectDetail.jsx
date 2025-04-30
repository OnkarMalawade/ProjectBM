import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProjectById, deleteProject } from "../api/projects";
import { getBidsForProject, submitBid, acceptBid } from "../api/bids";

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidForm, setBidForm] = useState({
        amount: "",
        duration_days: "",
        message: "",
    });

    const isClient = user?.role === "client";
    const isFreelancer = user?.role === "freelancer";
    const isOwner = user?.id === project?.client?.id;

    // Fetch project details
    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await getProjectById(id);
                setProject(res.data);
            } catch (err) {
                console.error("Failed to fetch project", err);
            }
        }

        fetchProject();
    }, [id]);

    // Fetch bids for clients only
    useEffect(() => {
        async function fetchBids() {
            if (isClient && project) {
                try {
                    const res = await getBidsForProject(id);
                    setBids(Array.isArray(res.data) ? res.data : []);
                } catch (err) {
                    console.error("Failed to fetch bids", err);
                }
            }
        }

        fetchBids();
    }, [isClient, project, id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteProject(id);
                alert("Project deleted!");
                navigate("/projects");
            } catch (err) {
                alert("Failed to delete project");
            }
        }
    };

    const handleBidChange = (e) => {
        const { name, value } = e.target;
        setBidForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitBid({
                ...bidForm,
                amount: parseFloat(bidForm.amount),
                duration_days: parseInt(bidForm.duration_days),
                projectId: parseInt(id),
            });
            alert("Bid submitted successfully!");
            setBidForm({ amount: "", duration_days: "", message: "" });
        } catch (err) {
            console.error("Bid submission failed", err);
        }
    };

    const handleAcceptBid = async (bidId) => {
        try {
            await acceptBid(bidId);
            alert("Bid accepted!");
            const res = await getBidsForProject(id);
            setBids(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Bid acceptance failed", err);
        }
    };

    if (!project)
        return (
            <div className="text-center mt-10 text-lg">Loading project...</div>
        );

    return (
        <div className="max-w-5xl mx-auto p-6 mt-6 bg-white rounded shadow">
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <p className="mb-3 text-gray-600">
                <strong>Description:</strong> {project.description}
            </p>
            <p className="mb-3">
                <strong>Budget:</strong> ${project.budget}
            </p>
            <p className="mb-3">
                <strong>Duration:</strong> {project.duration_days} days
            </p>
            <p className="mb-3">
                <strong>Posted by:</strong> {project.client?.name}
            </p>

            {isOwner && (
                <button
                    onClick={handleDelete}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    🗑️ Delete Project
                </button>
            )}

            {/* Freelancer: Bid submission form */}
            {isFreelancer && (
                <form
                    onSubmit={handleBidSubmit}
                    className="mt-10 p-4 bg-gray-50 rounded shadow"
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Submit Your Bid
                    </h2>
                    <div className="grid gap-4">
                        <input
                            type="number"
                            name="amount"
                            placeholder="Bid Amount"
                            value={bidForm.amount}
                            onChange={handleBidChange}
                            required
                            className="border p-2 rounded"
                        />
                        <input
                            type="number"
                            name="duration_days"
                            placeholder="Duration (days)"
                            value={bidForm.duration_days}
                            onChange={handleBidChange}
                            required
                            className="border p-2 rounded"
                        />
                        <textarea
                            name="message"
                            placeholder="Your message"
                            value={bidForm.message}
                            onChange={handleBidChange}
                            required
                            className="border p-2 rounded"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Submit Bid
                        </button>
                    </div>
                </form>
            )}

            {/* Client: View and accept bids */}
            {isOwner && bids.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Bids Received</h2>
                    {bids.map((bid) => (
                        <div key={bid.id} className="border p-4 mb-4 rounded">
                            <p>
                                <strong>Freelancer:</strong>{" "}
                                {bid.freelancer?.name} ({bid.freelancer?.email})
                            </p>
                            <p>
                                <strong>Amount:</strong> ${bid.amount}
                            </p>
                            <p>
                                <strong>Duration:</strong> {bid.duration_days}{" "}
                                days
                            </p>
                            <p>
                                <strong>Message:</strong> {bid.message}
                            </p>
                            <p>
                                <strong>Status:</strong> {bid.status}
                            </p>
                            {bid.status !== "accepted" && (
                                <button
                                    onClick={() => handleAcceptBid(bid.id)}
                                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    ✅ Accept Bid
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
