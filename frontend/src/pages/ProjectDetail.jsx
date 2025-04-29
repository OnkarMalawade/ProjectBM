import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById, deleteProject } from "../api/projects";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetail() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getProjectById(id).then((res) => setProject(res.data));
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Delete this project?")) {
            await deleteProject(id);
            navigate("/projects");
        }
    };

    if (!project) return <div className="p-4 text-center">Loading...</div>;

    const isOwner = user?.id === project.client?.id;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
                {project.title}
            </h2>
            <p className="text-gray-700 mb-2">{project.description}</p>
            <p className="text-blue-700 font-semibold">
                Budget: ${project.budget}
            </p>
            <p className="text-sm text-gray-500 mt-1">
                Posted by: {project.client.name}
            </p>

            {isOwner && (
                <div className="mt-6 space-x-4">
                    <button
                        onClick={() => navigate(`/projects/edit/${id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
