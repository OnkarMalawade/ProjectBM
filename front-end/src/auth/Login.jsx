import { useState } from "react";
import { API } from "../services/AuthApi";
import { setToken } from "../utils/storage";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/login", { email, password });
            setToken(res.data.access_token);
            navigate("/profile");
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <div style={{ margin: "50px" }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    style={{ display: "block", margin: "10px" }}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    style={{ display: "block", margin: "10px" }}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button style={{ padding: "5px 10px" }} type="submit">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
