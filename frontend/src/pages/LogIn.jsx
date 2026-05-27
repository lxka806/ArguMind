import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F1117] px-4">
            <div className="card max-w-md w-full animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366F1] to-[#4D8BFF] bg-clip-text text-transparent">
                        ArguMind
                    </h1>
                    <p className="text-[#8E95A5] text-sm mt-2">Challenge ideas. Sharpen minds.</p>
                </div>

                <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>

                {error && (
                    <div className="mb-4 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-lg text-[#FF6B6B] text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2A2E39] rounded-lg text-[#E6E8EB] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2A2E39] rounded-lg text-[#E6E8EB] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
                    />
                    <button type="submit" disabled={loading} className="primary-btn w-full py-3">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-[#8E95A5] text-sm mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-[#6366F1] hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;