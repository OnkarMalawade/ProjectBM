import { useState } from "react";

export const AuthForm = ({ onSubmit, isLogin = true }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "freelancer",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.title}>{isLogin ? "Login" : "Register"}</h2>

            {!isLogin && (
                <>
                    <input
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </>
            )}

            <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                required
            />

            {!isLogin && (
                <div style={styles.radioGroup}>
                    <label style={styles.radioLabel}>
                        <input
                            type="radio"
                            name="role"
                            value="freelancer"
                            checked={form.role === "freelancer"}
                            onChange={handleChange}
                        />
                        Freelancer
                    </label>
                    <label style={styles.radioLabel}>
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
            )}

            <button type="submit" style={styles.button}>
                {isLogin ? "Login" : "Register"}
            </button>
        </form>
    );
};

const styles = {
    form: {
        maxWidth: "400px",
        margin: "3rem auto",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    title: {
        textAlign: "center",
        marginBottom: "1rem",
        fontSize: "1.5rem",
        color: "#333",
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
        gap: "1.5rem",
        marginTop: "0.5rem",
    },
    radioLabel: {
        fontSize: "1rem",
        color: "#333",
    },
    button: {
        padding: "0.75rem",
        fontSize: "1rem",
        backgroundColor: "#3498db",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: "1rem",
    },
};
