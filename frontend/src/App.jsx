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
import AcceptedBids from "./components/AcceptedBids";
import SubmitBidForm from "./components/SubmitBidForm";
import ProjectBids from "./components/ProjectBids";
import MessagePage from "./pages/MessagePage";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import FreelancerInvoicesPage from "./pages/FreelancerInvoicesPage";
import MyBidsPage from "./pages/MyBidsPage";
import NotFound from "./pages/NotFound";
// import MessagePanel from "./components/MessagePanel";

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
                    <Route
                        path="/invoices/create"
                        element={
                            <ProtectedRoute allowedRoles={["client"]}>
                                <CreateInvoicePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/invoices/mine"
                        element={
                            <ProtectedRoute allowedRoles={["freelancer"]}>
                                <FreelancerInvoicesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bids/accepted"
                        element={
                            <ProtectedRoute allowedRoles={["freelancer"]}>
                                <AcceptedBids />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bids/project/:projectId"
                        element={
                            <ProtectedRoute allowedRoles={["client"]}>
                                <ProjectBids />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bids/submit/:projectId"
                        element={
                            <ProtectedRoute allowedRoles={["freelancer"]}>
                                <SubmitBidForm />
                            </ProtectedRoute>
                        }
                    />
                    {/* Messages Routes */}
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute
                                allowedRoles={["freelancer", "client"]}
                            >
                                <MessagePage />
                            </ProtectedRoute>
                        }
                    />
                    {/* <Route
                        path="/messages/:id"
                        element={
                            <ProtectedRoute
                                allowedRoles={["freelancer", "client"]}
                            >
                                <MessagePanel />
                            </ProtectedRoute>
                        }
                    /> */}

                    <Route
                        path="/bids/mine"
                        element={
                            <ProtectedRoute allowedRoles={["freelancer"]}>
                                <MyBidsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
