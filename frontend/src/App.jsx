import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateArgument from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/LogIn";

function App() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-[#0F1117] text-[#E6E8EB] flex">
            {/* SIDEBAR */}
            <Sidebar 
                isOpen={sidebarOpen} 
                toggleSidebar={toggleSidebar}
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
            />

            {/* MAIN CONTENT */}
            <main 
                className={`flex-1 transition-all duration-300 ${
                    sidebarOpen ? "ml-64" : "ml-20"
                }`}
            >
                <div className="pt-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/createArgument" element={<CreateArgument />} />
                        <Route path="/profile" element={<Profile setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;