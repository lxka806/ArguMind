import { Link, useNavigate } from "react-router-dom"
import API from "../api/api"

function NavBar() {
    const navigate = useNavigate()
    const currentUser = JSON.parse(localStorage.getItem("user"))
    const isLoggedIn = !!currentUser

    const handleLogout = async () => {
        try {
            await API.post("/auth/logout")
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/login")
        } catch (err) {
            console.log("Logout error:", err)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/login")
        }
    }

    return (
        <nav className="bg-[#1A1D24] border-b border-[#2A2E39] px-6 py-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#6366F1] to-[#4D8BFF] bg-clip-text text-transparent">
                    ArguMind
                </h2>
                
                <div className="flex gap-6 items-center">
                    <Link to="/" className="text-[#E6E8EB] hover:text-[#6366F1] transition-colors">
                        Home
                    </Link>
                    <Link to="/createArgument" className="text-[#E6E8EB] hover:text-[#6366F1] transition-colors">
                        Create Argument
                    </Link>
                    <Link to="/profile" className="text-[#E6E8EB] hover:text-[#6366F1] transition-colors">
                        Profile
                    </Link>
                    
                    {isLoggedIn ? (
                        <button 
                            onClick={handleLogout}
                            className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-[#FF6B6B]/90 transition-colors"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/register">
                                <button className="border-2 border-[#4D8BFF] text-[#4D8BFF] px-4 py-2 rounded-lg hover:bg-[#4D8BFF]/10 transition-colors">
                                    Register
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="bg-[#6366F1] text-white px-4 py-2 rounded-lg hover:bg-[#6366F1]/90 transition-colors">
                                    Log In
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;