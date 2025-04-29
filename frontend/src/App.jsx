import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import ProfileManagement from "./pages/ProfileManagement";
import ProjectCreation from "./pages/client/ProjectCreation";
import ProjectListing from "./pages/freelancer/ProjectListing";
import ProjectDetail from "./pages/ProjectDetail";
import Messaging from "./pages/Messaging";
import FileUploads from "./pages/FileUploads";
import Milestones from "./pages/Milestones";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="profile" element={<ProfileManagement />} />
                        <Route
                            path="projects/create"
                            element={<ProjectCreation />}
                        />
                        <Route
                            path="projects/list"
                            element={<ProjectListing />}
                        />
                        <Route
                            path="projects/:id"
                            element={<ProjectDetail />}
                        />
                        <Route
                            path="messages/:projectId"
                            element={<Messaging />}
                        />
                        <Route
                            path="files/:projectId"
                            element={<FileUploads />}
                        />
                        <Route
                            path="milestones/:projectId"
                            element={<Milestones />}
                        />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
