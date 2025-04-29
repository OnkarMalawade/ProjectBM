import { useEffect, useState } from "react";
import { getAllProjects } from "../api/projects";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyProjects() {
    const [projects, setProjects] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            getAllProjects()
                .then((res) => {
                    const myProjects = res.data.filter(
                        (p) => p.client.id === user.id,
                    );
                    setProjects(myProjects);
                })
                .catch((err) => console.error("Error fetching projects:", err));
        }
    }, [user]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                My Projects
            </h2>
            {projects.length === 0 ? (
                <p className="text-gray-600">You have no projects yet.</p>
            ) : (
                projects.map((p) => (
                    <div
                        key={p.id}
                        className="border border-gray-200 bg-white p-4 mb-3 rounded shadow-sm"
                    >
                        <h3 className="text-xl font-semibold text-blue-700">
                            {p.title}
                        </h3>
                        <div className="mt-2">
                            <Link
                                to={`/projects/${p.id}`}
                                className="text-blue-500 hover:underline mr-3"
                            >
                                View
                            </Link>
                            <Link
                                to={`/projects/edit/${p.id}`}
                                className="text-yellow-500 hover:underline"
                            >
                                Edit
                            </Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
