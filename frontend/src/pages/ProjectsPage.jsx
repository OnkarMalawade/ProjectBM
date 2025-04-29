import { useEffect, useState } from "react";
import { getAllProjects } from "../api/projects";
import { Link } from "react-router-dom";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getAllProjects().then((res) => setProjects(res.data));
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Available Projects
            </h2>
            {projects.map((p) => (
                <div
                    key={p.id}
                    className="bg-white border border-gray-200 p-4 rounded mb-4 shadow"
                >
                    <h3 className="text-xl font-semibold text-blue-700">
                        {p.title}
                    </h3>
                    <p className="text-gray-700">Budget: ${p.budget}</p>
                    <Link
                        to={`/projects/${p.id}`}
                        className="text-blue-500 hover:underline"
                    >
                        View Details
                    </Link>
                </div>
            ))}
        </div>
    );
}
