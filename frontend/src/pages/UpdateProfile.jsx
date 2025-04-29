import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        bio: "",
        profile_image: null,
    });

    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getProfile().then((res) => {
            const data = res.data;
            setForm({
                name: data.name || "",
                email: data.email || "",
                bio: data.bio || "",
                profile_image: null,
            });
            if (data.profile_image) {
                setPreview(
                    `http://localhost:3000/uploads/profile_images/${data.profile_image}`,
                );
            }
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "profile_image") {
            setForm({ ...form, profile_image: files[0] });
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("bio", form.bio);
        if (form.profile_image) {
            formData.append("profile_image", form.profile_image);
        }

        try {
            await updateProfile(formData);
            alert("Profile updated!");
            navigate("/auth/profile");
        } catch (err) {
            console.error(err);
            alert("Update failed. Check required fields.");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={styles.form}
            encType="multipart/form-data"
        >
            <h2 style={styles.title}>Update Profile</h2>
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                style={styles.input}
            />
            <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                style={styles.input}
            />
            <input
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Bio"
                style={styles.input}
            />
            <input
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleChange}
                style={styles.input}
            />
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    style={{ height: "100px", borderRadius: "8px" }}
                />
            )}
            <button type="submit" style={styles.button}>
                Update
            </button>
        </form>
    );
}

const styles = {
    form: {
        maxWidth: "500px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    title: {
        textAlign: "center",
    },
    input: {
        padding: "0.75rem",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "0.75rem",
        backgroundColor: "#2980b9",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};
