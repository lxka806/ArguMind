import { Routes, Route, Navigate } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./pages/Home"
import CreateArgument from "./pages/CreatePost"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Login from "./pages/LogIn"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

function App() {
    return (
        <div className="min-h-screen bg-[#0F1117]">
            <NavBar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route 
                        path="/createArgument" 
                        element={
                            <ProtectedRoute>
                                <CreateArgument />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </div>
    )
}

export default App