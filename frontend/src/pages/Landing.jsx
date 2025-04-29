import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>🚀 Welcome to Auth Portal</h1>
            <p style={styles.subtext}>Please login or register to continue.</p>

            <div style={styles.buttonGroup}>
                <Link to="/auth/login" style={styles.button}>
                    Login
                </Link>
                <Link to="/auth/register" style={styles.button}>
                    Register
                </Link>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
        fontFamily: "Arial, sans-serif",
    },
    heading: {
        fontSize: "2rem",
        marginBottom: "0.5rem",
    },
    subtext: {
        fontSize: "1.2rem",
        color: "#555",
    },
    buttonGroup: {
        marginTop: "1.5rem",
        display: "flex",
        gap: "1rem",
    },
    button: {
        textDecoration: "none",
        background: "#3498db",
        color: "#fff",
        padding: "0.7rem 1.5rem",
        borderRadius: "8px",
        fontSize: "1rem",
    },
};
