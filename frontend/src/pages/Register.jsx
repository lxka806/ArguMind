import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";

function Register() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await API.post("/auth/register", { 
                fullname, 
                email, 
                password 
            });
            
            console.log("Registration response:", res.data); // Debug log
            
            setSuccess(res.data.message || "Account created successfully! You can now login.");
            
            // Clear form
            setFullname("");
            setEmail("");
            setPassword("");
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
            
        } catch (err) {
            console.error("Registration error:", err);
            console.error("Error response:", err.response); // Debug log
            
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               "Registration failed. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F1117] px-4">
            <div className="bg-[#1A1D24] border border-[#2A2E39] rounded-xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366F1] to-[#4D8BFF] bg-clip-text text-transparent">
                        ArguMind
                    </h1>
                    <p className="text-[#8E95A5] text-sm mt-2">Challenge ideas. Sharpen minds.</p>
                </div>

                <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

                {error && (
                    <div className="mb-4 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 rounded-lg text-[#FF6B6B] text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg text-[#22C55E] text-sm">
                        {success}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full name"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2A2E39] rounded-lg text-[#E6E8EB] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
                    />
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
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2A2E39] rounded-lg text-[#E6E8EB] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#6366F1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6366F1]/90 transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-[#8E95A5] text-sm mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#6366F1] hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;