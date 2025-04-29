import { useEffect, useState } from "react";
import {API} from "../services/AuthApi";
import { removeToken } from "../utils/storage";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const logout = () => {
        removeToken();
        navigate("/login");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await API.get("/profile");
            setProfile(res.data);
        };
        fetchProfile();
    }, []);

    if (!profile) return <div>Loading...</div>;

    return (
        <div style={{ margin: "50px" }}>
            <h2>Welcome, {profile.name}</h2>
            <p>Email: {profile.email}</p>
            <p>Role: {profile.role}</p>
            <p>Bio: {profile.bio || "No bio"}</p>
            <button
                style={{ marginTop: "20px" }}
                onClick={() => navigate("/update")}
            >
                Update Profile
            </button>
            <br />
            <button style={{ marginTop: "10px" }} onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default Profile;
