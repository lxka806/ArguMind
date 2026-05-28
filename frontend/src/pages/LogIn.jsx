import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { LogIn as LoginIcon, AlertCircle } from "lucide-react";

function Login({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            setLoading(true);

            const res = await API.post("auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            setSuccess("Logged in successfully!");
            setIsLoggedIn(true);

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "Login failed. Try again.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1117] flex items-center justify-center text-[#E6E8EB] p-6">
            <div className="w-full max-w-md">
                <div className="bg-gradient-to-br from-[#1A1D24] to-[#0F1117] border border-[#2A2E39] rounded-xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center mx-auto mb-4">
                            <LoginIcon size={28} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                            Welcome back
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Sign in to continue debating ideas
                        </p>
                    </div>

                    {/* SUCCESS MESSAGE */}
                    {success && (
                        <div className="bg-[#22C55E]/10 border border-[#22C55E] rounded-lg p-3 mb-4">
                            <p className="text-[#22C55E] text-sm text-center">{success}</p>
                        </div>
                    )}

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="bg-[#EF4444]/10 border border-[#EF4444] rounded-lg p-3 mb-4 flex items-center gap-2">
                            <AlertCircle size={16} className="text-[#EF4444]" />
                            <p className="text-[#EF4444] text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0F1117] border border-[#2A2E39] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#6366F1] transition"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0F1117] border border-[#2A2E39] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#6366F1] transition"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 rounded-lg font-medium transition text-white ${
                                loading
                                    ? "bg-[#2A2E39] opacity-50 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90"
                            }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;