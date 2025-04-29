"use client";

import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    axios.defaults.baseURL = "http://localhost:3000";

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get("/auth/profile");
            setUser(response.data.payload);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post("/auth/login", {
                email,
                password,
            });
            const { token } = response.data.access_token;
            localStorage.setItem("token", token);
            setToken(token);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const register = async (name, email, password, role) => {
        setLoading(true);
        try {
            await axios.post("/auth/register", { name, email, password, role });
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post("/auth/logout");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            delete axios.defaults.headers.common["Authorization"];
        }
    };

    const updateProfile = async (data) => {
        try {
            const response = await axios.put("/auth/update", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Profile update failed:", error);
            throw error;
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
