import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import UpdateProfile from "./pages/UpdateProfile";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetail from "./pages/ProjectDetail";
import ClientProjectForm from "./pages/ClientProjectForm";
import MyProjects from "./pages/MyProjects";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/auth/profile"
                        element={
                            <ProtectedRoute
                                allowedRoles={["freelancer", "client"]}
                            >
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/auth/update"
                        element={
                            <ProtectedRoute
                                allowedRoles={["freelancer", "client"]}
                            >
                                <UpdateProfile />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route
                        path="/projects/create"
                        element={
                            <ProtectedRoute allowedRoles={["client"]}>
                                <ClientProjectForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/edit/:id"
                        element={
                            <ProtectedRoute allowedRoles={["client"]}>
                                <ClientProjectForm mode="edit" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/mine"
                        element={
                            <ProtectedRoute allowedRoles={["client"]}>
                                <MyProjects />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback Route */}
                    <Route path="*" element={<Landing />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
