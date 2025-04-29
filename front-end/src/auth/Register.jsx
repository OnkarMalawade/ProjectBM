import { useState } from "react";
import API from "../services/AuthApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "client",
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await API.post("/register", form);
            navigate("/login");
        } catch (err) {
            alert("Registration Failed");
        }
    };

    return (
        <div style={{ margin: "50px" }}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    style={{ display: "block", margin: "10px" }}
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    style={{ display: "block", margin: "10px" }}
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />
                <input
                    style={{ display: "block", margin: "10px" }}
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />
                <select
                    style={{ display: "block", margin: "10px" }}
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="client">Client</option>
                    <option value="freelancer">Freelancer</option>
                </select>
                <button style={{ padding: "5px 10px" }} type="submit">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
