import { Link } from "react-router-dom";

export default function Navbar() {
    const token = localStorage.getItem("token");

    return (
        <nav style={{ padding: "10px", background: "#333", color: "#fff" }}>
            <Link
                to="/"
                style={{
                    marginRight: "15px",
                    color: "#fff",
                    textDecoration: "none",
                }}
            >
                Home
            </Link>
            {token ? (
                <>
                    <Link
                        to="/profile"
                        style={{
                            marginRight: "15px",
                            color: "#fff",
                            textDecoration: "none",
                        }}
                    >
                        Profile
                    </Link>
                    <Link
                        to="/update"
                        style={{
                            marginRight: "15px",
                            color: "#fff",
                            textDecoration: "none",
                        }}
                    >
                        Update
                    </Link>
                </>
            ) : (
                <>
                    <Link
                        to="/login"
                        style={{
                            marginRight: "15px",
                            color: "#fff",
                            textDecoration: "none",
                        }}
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        style={{
                            marginRight: "15px",
                            color: "#fff",
                            textDecoration: "none",
                        }}
                    >
                        Register
                    </Link>
                </>
            )}
        </nav>
    );
}
