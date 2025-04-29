// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <nav style={styles.navbar}>
            <div style={styles.left}>
                <span style={styles.logo}>🔥 Auth Portal</span>
                {user?.role === "client" && (
                    <>
                        <NavLink to="/projects/create" label="Add Project" />
                        <NavLink to="/projects/mine" label="My Projects" />
                    </>
                )}
                <NavLink to="/projects" label="Projects" />
                {user.role === "freelancer" ? (
                    <>
                        <NavLink to="/auth/profile" label="Dashboard" />
                        <NavLink to="/auth/update" label="Edit Profile" />
                    </>
                ) : (
                    <>
                        <NavLink to="/auth/profile" label="Client Space" />
                        <NavLink to="/auth/update" label="Edit Info" />
                    </>
                )}
            </div>
            <div style={styles.right}>
                <span style={styles.welcome}>👋 Welcome, {user.name}</span>
                <button onClick={logout} style={styles.logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

function NavLink({ to, label }) {
    return (
        <Link
            to={to}
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = "#ffeaa7")}
            onMouseOut={(e) => (e.target.style.color = "#ecf0f1")}
        >
            {label}
        </Link>
    );
}

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#2c3e50", // dark navy
        color: "#ecf0f1", // light text
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    },
    left: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
    },
    right: {
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
    },
    logo: {
        fontWeight: "bold",
        fontSize: "1.3rem",
        color: "#f1c40f",
        marginRight: "1rem",
    },
    link: {
        color: "#ecf0f1",
        textDecoration: "none",
        fontSize: "1rem",
        transition: "color 0.3s ease",
        padding: "0.25rem 0.5rem",
    },
    welcome: {
        fontStyle: "italic",
        fontSize: "1rem",
    },
    logout: {
        backgroundColor: "#e74c3c",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "6px",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background-color 0.3s ease",
    },
};
