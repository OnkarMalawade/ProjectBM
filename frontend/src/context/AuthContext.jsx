import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const loadUser = async () => {
        try {
            const res = await getProfile();
            setUser(res.data);
        } catch (err) {
            logout(); // token invalid
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) loadUser();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };
    // console.log("Auth Context initialized");
    // console.log("User data:", user);
    // console.log("Token:", localStorage.getItem("token"));

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
