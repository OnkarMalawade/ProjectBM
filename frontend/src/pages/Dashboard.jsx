"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.role === "client") {
                    // Fetch client's projects
                    const projectsResponse = await axios.get(
                        "/projects/client",
                    );
                    setProjects(projectsResponse.data);
                } else if (user?.role === "freelancer") {
                    // Fetch freelancer's bids
                    const bidsResponse = await axios.get("/bids/freelancer");
                    setBids(bidsResponse.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const containerStyle = {
        padding: "20px",
    };

    const headingStyle = {
        fontSize: "28px",
        fontWeight: "bold",
        marginBottom: "8px",
    };

    const subheadingStyle = {
        color: "#666",
        marginBottom: "24px",
    };

    const statsContainerStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "32px",
    };

    const statCardStyle = {
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    };

    const statTitleStyle = {
        fontSize: "14px",
        color: "#666",
        marginBottom: "8px",
    };

    const statValueStyle = {
        fontSize: "24px",
        fontWeight: "bold",
    };

    const sectionTitleStyle = {
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "16px",
    };

    const cardGridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "16px",
    };

    const cardStyle = {
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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

    const linkStyle = {
        color: "#4CAF50",
        textDecoration: "none",
        display: "inline-block",
        marginTop: "8px",
    };

    const emptyCardStyle = {
        ...cardStyle,
        padding: "24px",
        textAlign: "center",
    };

    if (loading) {
        return <div style={containerStyle}>Loading dashboard...</div>;
    }

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Dashboard</h1>
            <p style={subheadingStyle}>Welcome back, {user?.name}!</p>

            {user?.role === "client" && (
                <>
                    <div style={statsContainerStyle}>
                        <div style={statCardStyle}>
                            <div style={statTitleStyle}>Total Projects</div>
                            <div style={statValueStyle}>{projects.length}</div>
                        </div>
                        <div style={statCardStyle}>
                            <div style={statTitleStyle}>Active Projects</div>
                            <div style={statValueStyle}>
                                {
                                    projects.filter(
                                        (p) => p.status === "active",
                                    ).length
                                }
                            </div>
                        </div>
                        <div style={statCardStyle}>
                            <div style={statTitleStyle}>Completed Projects</div>
                            <div style={statValueStyle}>
                                {
                                    projects.filter(
                                        (p) => p.status === "completed",
                                    ).length
                                }
                            </div>
                        </div>
                        <div style={statCardStyle}>
                            <div style={statTitleStyle}>Total Spent</div>
                            <div style={statValueStyle}>
                                $
                                {projects.reduce(
                                    (acc, project) => acc + project.budget,
                                    0,
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 style={sectionTitleStyle}>Your Projects</h2>
                        {projects.length === 0 ? (
                            <div style={emptyCardStyle}>
                                <p>You haven't created any projects yet.</p>
                                <Link to="/projects/create" style={linkStyle}>
                                    Create your first project
                                </Link>
                            </div>
                        ) : (
                            <div style={cardGridStyle}>
                                {projects.map((project) => (
                                    <div key={project.id} style={cardStyle}>
                                        <div style={cardHeaderStyle}>
                                            <h3 style={cardTitleStyle}>
                                                {project.title}
                                            </h3>
                                            <div style={cardDescriptionStyle}>
                                                Budget: ${project.budget} •
                                                Status: {project.status}
                                            </div>
                                        </div>
                                        <div style={cardContentStyle}>
                                            <p
                                                style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                            >
                                                {project.description}
                                            </p>
                                            <Link
                                                to={`/projects/${project.id}`}
                                                style={linkStyle}
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {user?.role === "freelancer" && (
                <>
                    <div style={statsContainerStyle}>
                        <div style={statCardStyle}>
                            <div style={statTitleStyle}>Total Bids</div>
                            <div style={statValueStyle}>{bids.length}</div>
                        </div>
                        <div style={statCardStyle}>
                            <div style={statTitleStyle}>Active Projects</div>
                            <div style={statValueStyle}>
                                {
                                    bids.filter((b) => b.status === "accepted")
                                        .length
                                }
                            </div>
                        </div>
                        <div style={statCardStyle}>
                            <div style={statTitleStyle}>Pending Bids</div>
                            <div style={statValueStyle}>
                                {
                                    bids.filter((b) => b.status === "pending")
                                        .length
                                }
                            </div>
                        </div>
                        <div style={statCardStyle}>
                            <div style={statTitleStyle}>Potential Earnings</div>
                            <div style={statValueStyle}>
                                $
                                {bids.reduce((acc, bid) => acc + bid.amount, 0)}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 style={sectionTitleStyle}>Your Bids</h2>
                        {bids.length === 0 ? (
                            <div style={emptyCardStyle}>
                                <p>You haven't placed any bids yet.</p>
                                <Link to="/projects/list" style={linkStyle}>
                                    Browse available projects
                                </Link>
                            </div>
                        ) : (
                            <div style={cardGridStyle}>
                                {bids.map((bid) => (
                                    <div key={bid.id} style={cardStyle}>
                                        <div style={cardHeaderStyle}>
                                            <h3 style={cardTitleStyle}>
                                                {bid.project.title}
                                            </h3>
                                            <div style={cardDescriptionStyle}>
                                                Bid: ${bid.amount} • Status:{" "}
                                                {bid.status}
                                            </div>
                                        </div>
                                        <div style={cardContentStyle}>
                                            <p>
                                                Duration: {bid.duration_days}{" "}
                                                days
                                            </p>
                                            <Link
                                                to={`/projects/${bid.project.id}`}
                                                style={linkStyle}
                                            >
                                                View Project
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
