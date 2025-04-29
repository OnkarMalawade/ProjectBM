import { useEffect, useState } from "react";
import { getProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getProfile().then((res) => setProfile(res.data));
    }, []);

    if (!profile) return <div style={styles.loading}>Loading profile...</div>;

    return (
        <div style={styles.container}>
            <h1>
                Welcome {user?.role === "freelancer" ? "Freelancer" : "Client"}{" "}
                - {user?.name}
            </h1>

            <img
                src={`http://localhost:3000/uploads/profile_images/${profile.profile_image}`}
                alt="Profile"
                style={styles.avatar}
            />
            <p>
                <strong>Name:</strong> {profile.name}
            </p>
            <p>
                <strong>Email:</strong> {profile.email}
            </p>
            <p>
                <strong>Bio:</strong> {profile.bio || "No bio yet"}
            </p>
            <p>
                <strong>Joined:</strong>{" "}
                {new Date(profile.created_at).toLocaleString()}
            </p>

            <div style={styles.buttons}>
                <button
                    onClick={() => navigate("/auth/update")}
                    style={styles.button}
                >
                    Update Profile
                </button>
                <button
                    onClick={logout}
                    style={{ ...styles.button, backgroundColor: "#e74c3c" }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "500px",
        margin: "auto",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#fdfdfd",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        marginTop: "3rem",
    },
    avatar: {
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "1rem",
        border: "2px solid #ccc",
    },
    buttons: {
        marginTop: "2rem",
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
    },
    button: {
        padding: "0.5rem 1.5rem",
        borderRadius: "8px",
        backgroundColor: "#3498db",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
    },
    loading: {
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
    },
};
