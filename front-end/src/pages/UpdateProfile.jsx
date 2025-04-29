import { useState } from "react";
import { API } from "../services/AuthApi";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
    const [form, setForm] = useState({
        name: "",
        bio: "",
    });
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put("/update", form);
            navigate("/profile");
        } catch (err) {
            alert("Update failed");
        }
    };

    return (
        <div style={{ margin: "50px" }}>
            <h2>Update Profile</h2>
            <form onSubmit={handleUpdate}>
                <input
                    style={{ display: "block", margin: "10px" }}
                    type="text"
                    placeholder="New Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <textarea
                    style={{ display: "block", margin: "10px" }}
                    placeholder="Bio"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
                <button style={{ padding: "5px 10px" }} type="submit">
                    Update
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;
