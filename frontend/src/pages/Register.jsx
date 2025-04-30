import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "freelancer",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            alert("Registered successfully!");
            navigate("/auth/login");
        } catch (err) {
            alert("Registration failed");
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.title}>Register</h2>
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
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                style={styles.input}
            />
            <div style={styles.radioGroup}>
                <label>
                    <input
                        type="radio"
                        name="role"
                        value="freelancer"
                        checked={form.role === "freelancer"}
                        onChange={handleChange}
                    />
                    Freelancer
                </label>
                <label>
                    <input
                        type="radio"
                        name="role"
                        value="client"
                        checked={form.role === "client"}
                        onChange={handleChange}
                    />
                    Client
                </label>
            </div>
            <button type="submit" style={styles.button}>
                Register
            </button>
        </form>
    );
}

const styles = {
    form: {
        maxWidth: "450px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    title: {
        textAlign: "center",
        fontSize: "1.5rem",
        marginBottom: "1rem",
    },
    input: {
        padding: "0.75rem",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    radioGroup: {
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        marginTop: "0.5rem",
    },
    button: {
        padding: "0.75rem",
        fontSize: "1rem",
        backgroundColor: "#2ecc71",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};
