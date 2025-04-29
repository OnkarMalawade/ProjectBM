import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProject, updateProject, getProjectById } from "../api/projects";

export default function ClientProjectForm({ mode = "create" }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        budget: "",
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (mode === "edit" && id) {
            getProjectById(id).then((res) => {
                const { title, description, budget } = res.data;
                setForm({ title, description, budget });
            });
        }
    }, [mode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, budget: Number(form.budget) };

        try {
            if (mode === "edit") await updateProject(id, payload);
            else await createProject(payload);

            navigate("/projects/mine");
        } catch (err) {
            console.error("Failed to submit project:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-2xl rounded-xl max-w-2xl mx-auto p-8 animate-fade-in"
            >
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-blue-700">
                        {mode === "edit"
                            ? "✏️ Update Your Project"
                            : "🚀 Launch a New Project"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        {mode === "edit"
                            ? "Make changes to your existing project details."
                            : "Fill in the form to post a new opportunity."}
                    </p>
                </div>

                <label className="block mb-3">
                    <span className="text-gray-700 font-medium">Title</span>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="E.g. Build a Portfolio Website"
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>

                <label className="block mb-3">
                    <span className="text-gray-700 font-medium">
                        Description
                    </span>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe your project in detail..."
                        required
                        rows={5}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-y"
                    />
                </label>

                <label className="block mb-6">
                    <span className="text-gray-700 font-medium">
                        Budget (USD)
                    </span>
                    <input
                        type="number"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        placeholder="E.g. 1500"
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.01]"
                >
                    {mode === "edit" ? "Update Project" : "Create Project"}
                </button>
            </form>
        </div>
    );
}
