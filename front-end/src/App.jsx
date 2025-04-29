import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/update"
                    element={
                        <ProtectedRoute>
                            <UpdateProfile />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
