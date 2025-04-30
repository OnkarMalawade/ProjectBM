import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2c3e50",
        padding: "10px 20px",
        color: "#ecf0f1",
    },
    left: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },
    right: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    logo: {
        fontWeight: "bold",
        fontSize: "20px",
    },
    link: {
        textDecoration: "none",
        color: "#ecf0f1",
        padding: "6px 10px",
        borderRadius: "5px",
        transition: "color 0.3s ease",
    },
    welcome: {
        fontWeight: "500",
    },
    logout: {
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <nav style={styles.navbar}>
            <div style={styles.left}>
                <span style={styles.logo}>🔥 Auth Portal</span>
                <NavLink to="/projects" label="Projects" />
                {user.role === "client" ? (
                    <>
                        <NavLink to="/projects/create" label="Add Project" />
                        <NavLink to="/projects/mine" label="My Projects" />
                        <NavLink to="/invoices/create" label="New Invoice" />
                        <NavLink to="/auth/profile" label="Client Space" />
                        <NavLink to="/auth/update" label="Edit Info" />
                    </>
                ) : (
                    <>
                        <NavLink to="/auth/profile" label="Dashboard" />
                        <NavLink to="/auth/update" label="Edit Profile" />
                        <NavLink to="/bids/accepted" label="Accepted Bids" />
                        <NavLink to="/bids/mine" label="My Bids" />
                        <NavLink to="/invoices/mine" label="My Invoices" />
                    </>
                )}
                {/* Conditionally render Messages link */}
                {(user.role === "client" || user.role === "freelancer") && (
                    <NavLink to="/messages" label="Messages" />
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
