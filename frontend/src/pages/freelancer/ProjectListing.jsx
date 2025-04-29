"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ProjectListing = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [maxBudget, setMaxBudget] = useState(1000);
    const [budgetFilter, setBudgetFilter] = useState(1000);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        if (user?.role !== "freelancer") {
            setAccessDenied(true);
        } else {
            setAccessDenied(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("/projects");
                setProjects(response.data);
                setFilteredProjects(response.data);

                // Find the maximum budget to set the slider range
                const maxProjectBudget = Math.max(
                    ...response.data.map((p) => p.budget),
                    1000,
                );
                setMaxBudget(maxProjectBudget);
                setBudgetFilter(maxProjectBudget);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        // Filter projects based on search term and budget
        const filtered = projects.filter((project) => {
            const matchesSearch =
                project.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                project.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesBudget = project.budget <= budgetFilter;

            return matchesSearch && matchesBudget;
        });

        setFilteredProjects(filtered);
    }, [searchTerm, budgetFilter, projects]);

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

    const gridContainerStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 3fr",
        gap: "24px",
    };

    const cardStyle = {
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
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

    const cardContentStyle = {
        padding: "16px",
    };

    const inputGroupStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "16px",
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

    const sliderContainerStyle = {
        marginBottom: "16px",
    };

    const sliderStyle = {
        width: "100%",
    };

    const projectCardStyle = {
        ...cardStyle,
        marginBottom: "16px",
    };

    const projectCardHeaderStyle = {
        ...cardHeaderStyle,
    };

    const projectCardTitleStyle = {
        ...cardTitleStyle,
    };

    const projectCardDescriptionStyle = {
        fontSize: "14px",
        color: "#666",
    };

    const projectCardContentStyle = {
        ...cardContentStyle,
    };

    const projectCardFooterStyle = {
        padding: "16px",
        borderTop: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };

    const dateStyle = {
        fontSize: "14px",
        color: "#666",
    };

    const buttonStyle = {
        padding: "8px 16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-block",
    };

    const emptyCardStyle = {
        ...cardStyle,
        padding: "24px",
        textAlign: "center",
    };

    if (accessDenied) {
        return (
            <div style={containerStyle}>
                Access denied. Only freelancers can view this page.
            </div>
        );
    }

    if (loading) {
        return <div style={containerStyle}>Loading projects...</div>;
    }

    return (
        <div style={containerStyle}>
            <div>
                <h1 style={headingStyle}>Available Projects</h1>
                <p style={subheadingStyle}>
                    Browse and bid on projects that match your skills
                </p>
            </div>

            <div style={gridContainerStyle}>
                <div>
                    <div style={cardStyle}>
                        <div style={cardHeaderStyle}>
                            <h2 style={cardTitleStyle}>Filters</h2>
                        </div>
                        <div style={cardContentStyle}>
                            <div style={inputGroupStyle}>
                                <label htmlFor="search" style={labelStyle}>
                                    Search
                                </label>
                                <input
                                    id="search"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    style={inputStyle}
                                />
                            </div>

                            <div style={sliderContainerStyle}>
                                <label htmlFor="budget" style={labelStyle}>
                                    Maximum Budget: ${budgetFilter}
                                </label>
                                <input
                                    type="range"
                                    id="budget"
                                    min="0"
                                    max={maxBudget}
                                    step="10"
                                    value={budgetFilter}
                                    onChange={(e) =>
                                        setBudgetFilter(Number(e.target.value))
                                    }
                                    style={sliderStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    {filteredProjects.length === 0 ? (
                        <div style={emptyCardStyle}>
                            <p>No projects match your filters.</p>
                        </div>
                    ) : (
                        <div>
                            {filteredProjects.map((project) => (
                                <div key={project.id} style={projectCardStyle}>
                                    <div style={projectCardHeaderStyle}>
                                        <h3 style={projectCardTitleStyle}>
                                            {project.title}
                                        </h3>
                                        <div
                                            style={projectCardDescriptionStyle}
                                        >
                                            Budget: ${project.budget} • Posted
                                            by: {project.client.name}
                                        </div>
                                    </div>
                                    <div style={projectCardContentStyle}>
                                        <p
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical",
                                            }}
                                        >
                                            {project.description}
                                        </p>
                                    </div>
                                    <div style={projectCardFooterStyle}>
                                        <p style={dateStyle}>
                                            Posted:{" "}
                                            {new Date(
                                                project.created_at,
                                            ).toLocaleDateString()}
                                        </p>
                                        <Link
                                            to={`/projects/${project.id}`}
                                            style={buttonStyle}
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectListing;
