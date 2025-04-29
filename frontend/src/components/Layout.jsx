"use client";

import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const sidebarStyle = {
        width: sidebarOpen ? "250px" : "0",
        height: "100vh",
        position: "fixed",
        zIndex: "1",
        top: "0",
        left: "0",
        backgroundColor: "#111",
        overflowX: "hidden",
        transition: "0.5s",
        paddingTop: "60px",
        color: "white",
    };

    const mainStyle = {
        marginLeft: sidebarOpen ? "250px" : "0",
        transition: "margin-left .5s",
        padding: "20px",
        minHeight: "100vh",
    };

    const headerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #dee2e6",
    };

    const navItemStyle = {
        padding: "8px 16px 8px 32px",
        textDecoration: "none",
        fontSize: "18px",
        color: "#818181",
        display: "block",
        transition: "0.3s",
        cursor: "pointer",
    };

    const navGroupStyle = {
        marginTop: "20px",
    };

    const navGroupLabelStyle = {
        padding: "8px 16px 8px 32px",
        fontSize: "12px",
        color: "#818181",
        textTransform: "uppercase",
    };

    const userInfoStyle = {
        padding: "16px 32px",
        position: "absolute",
        bottom: "0",
        width: "100%",
        borderTop: "1px solid #444",
    };

    const buttonStyle = {
        padding: "8px 16px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
    };

    const logoutButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#f44336",
        width: "100%",
        marginTop: "10px",
    };

    return (
        <div>
            {/* Sidebar */}
            <div style={sidebarStyle}>
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Freelance Marketplace
                </h2>

                <div style={navGroupStyle}>
                    <div style={navGroupLabelStyle}>Navigation</div>
                    <div
                        style={navItemStyle}
                        onClick={() => navigate("/")}
                        onMouseOver={(e) => (e.target.style.color = "#f1f1f1")}
                        onMouseOut={(e) => (e.target.style.color = "#818181")}
                    >
                        Dashboard
                    </div>
                    <div
                        style={navItemStyle}
                        onClick={() => navigate("/profile")}
                        onMouseOver={(e) => (e.target.style.color = "#f1f1f1")}
                        onMouseOut={(e) => (e.target.style.color = "#818181")}
                    >
                        Profile
                    </div>
                </div>

                <div style={navGroupStyle}>
                    <div style={navGroupLabelStyle}>Projects</div>
                    {user?.role === "client" && (
                        <div
                            style={navItemStyle}
                            onClick={() => navigate("/projects/create")}
                            onMouseOver={(e) =>
                                (e.target.style.color = "#f1f1f1")
                            }
                            onMouseOut={(e) =>
                                (e.target.style.color = "#818181")
                            }
                        >
                            Create Project
                        </div>
                    )}
                    {user?.role === "freelancer" && (
                        <div
                            style={navItemStyle}
                            onClick={() => navigate("/projects/list")}
                            onMouseOver={(e) =>
                                (e.target.style.color = "#f1f1f1")
                            }
                            onMouseOut={(e) =>
                                (e.target.style.color = "#818181")
                            }
                        >
                            Find Projects
                        </div>
                    )}
                </div>

                <div style={userInfoStyle}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "#444",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {user?.profile_image ? (
                                <img
                                    src={
                                        user.profile_image || "/placeholder.svg"
                                    }
                                    alt={user.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <span>{user?.name?.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <p style={{ margin: "0", fontWeight: "bold" }}>
                                {user?.name}
                            </p>
                            <p
                                style={{
                                    margin: "0",
                                    fontSize: "12px",
                                    textTransform: "capitalize",
                                }}
                            >
                                {user?.role}
                            </p>
                        </div>
                    </div>
                    <button style={logoutButtonStyle} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div style={mainStyle}>
                <header style={headerStyle}>
                    <button
                        onClick={toggleSidebar}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            fontSize: "24px",
                            cursor: "pointer",
                        }}
                    >
                        ☰
                    </button>
                    <h1 style={{ margin: "0" }}>Freelance Marketplace</h1>
                    <div></div>
                </header>
                <main style={{ padding: "20px" }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
