import { NavLink, useNavigate } from "react-router-dom";
import { 
    Menu, 
    X, 
    Home, 
    PlusCircle, 
    User, 
    LogIn, 
    UserPlus, 
    LogOut,
    Sparkles,
    TrendingUp
} from "lucide-react";

function Sidebar({ isOpen, toggleSidebar, isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
    };

    const navItems = [
        { path: "/", icon: Home, label: "Home", show: true },
        { path: "/createArgument", icon: PlusCircle, label: "Create Argument", show: isLoggedIn },
        { path: "/profile", icon: User, label: "Profile", show: isLoggedIn },
        { path: "/login", icon: LogIn, label: "Login", show: !isLoggedIn },
        { path: "/register", icon: UserPlus, label: "Register", show: !isLoggedIn },
    ];

    return (
        <>
            {/* SIDEBAR */}
            <aside 
                className={`fixed top-0 left-0 h-full bg-[#1A1D24] border-r border-[#2A2E39] transition-all duration-300 z-20 ${
                    isOpen ? "w-64" : "w-20"
                }`}
            >
                {/* LOGO AREA */}
                <div className={`relative flex items-center p-4 border-b border-[#2A2E39] ${
                    isOpen ? "justify-between" : "justify-center"
                }`}>
                    {isOpen ? (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center font-bold text-white shadow-lg">
                                    A
                                </div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                                    ArguMind
                                </h2>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="text-[#E6E8EB] hover:text-[#6366F1] transition"
                            >
                                <X size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center font-bold text-white shadow-lg">
                                A
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="absolute -right-3 top-5 text-[#E6E8EB] hover:text-[#6366F1] transition bg-[#1A1D24] rounded-full p-1 border border-[#2A2E39]"
                            >
                                <Menu size={16} />
                            </button>
                        </>
                    )}
                </div>

                {/* USER INFO (if logged in) */}
                {isLoggedIn && user && isOpen && (
                    <div className="p-4 border-b border-[#2A2E39] bg-[#0F1117]/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center font-bold text-white">
                                {user.fullname?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.fullname}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* User avatar for collapsed mode */}
                {isLoggedIn && user && !isOpen && (
                    <div className="p-3 border-b border-[#2A2E39] flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center font-bold text-white">
                            {user.fullname?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                )}

                {/* NAVIGATION */}
                <nav className={`p-3 space-y-2 ${!isOpen && "flex flex-col items-center"}`}>
                    {navItems.map((item) => {
                        if (!item.show) return null;
                        
                        const Icon = item.icon;
                        
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center rounded-lg transition-all duration-200 ${
                                        isOpen 
                                            ? "gap-3 px-3 py-2" 
                                            : "justify-center p-3 w-12 h-12 mx-auto"
                                    } ${
                                        isActive
                                            ? "bg-[#6366F1] text-white shadow-lg"
                                            : "text-[#E6E8EB] hover:bg-[#2A2E39] hover:text-[#6366F1]"
                                    }`
                                }
                                title={!isOpen ? item.label : ""}
                            >
                                <Icon size={isOpen ? 20 : 24} className="flex-shrink-0" />
                                {isOpen && <span className="text-sm">{item.label}</span>}
                            </NavLink>
                        );
                    })}

                    {/* LOGOUT BUTTON */}
                    {isLoggedIn && (
                        <div className={!isOpen ? "flex justify-center mt-4" : "mt-4"}>
                            <button
                                onClick={handleLogout}
                                className={`flex items-center rounded-lg transition-all duration-200 text-[#E6E8EB] hover:bg-[#EF4444] hover:text-white ${
                                    isOpen 
                                        ? "w-full gap-3 px-3 py-2" 
                                        : "justify-center p-3 w-12 h-12 mx-auto"
                                }`}
                                title={!isOpen ? "Logout" : ""}
                            >
                                <LogOut size={isOpen ? 20 : 24} className="flex-shrink-0" />
                                {isOpen && <span className="text-sm">Logout</span>}
                            </button>
                        </div>
                    )}
                </nav>

                {/* STATS SECTION (collapsible) */}
                {isOpen && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2A2E39]">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Sparkles size={14} />
                                <span>Active Debates</span>
                                <span className="ml-auto text-[#6366F1] font-bold">1,234</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <TrendingUp size={14} />
                                <span>Total Arguments</span>
                                <span className="ml-auto text-[#6366F1] font-bold">5.6K</span>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Mini stats for collapsed mode */}
                {!isOpen && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#2A2E39]">
                        <div className="flex flex-col items-center gap-2">
                            <Sparkles size={18} className="text-[#6366F1]" />
                            <TrendingUp size={18} className="text-[#6366F1]" />
                        </div>
                    </div>
                )}
            </aside>

            {/* OVERLAY FOR MOBILE */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-10 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}

export default Sidebar;