import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";

function Register() {
    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validate = () => {
        if (!fullname || !email || !password) {
            return "All fields are required.";
        }

        if (fullname.trim().length < 3) {
            return "Full name must be at least 3 characters.";
        }

        if (!email.includes("@") || !email.includes(".")) {
            return "Please enter a valid email address.";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            await API.post("/auth/register", {
                fullname,
                email,
                password
            });

            setSuccess("Account created successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Try again."
            );
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
                            <UserPlus size={28} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                            Create account
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Join ArguMind and start debating ideas
                        </p>
                    </div>

                    {/* SUCCESS */}
                    {success && (
                        <div className="bg-[#22C55E]/10 border border-[#22C55E] rounded-lg p-3 mb-4 flex items-center gap-2">
                            <CheckCircle size={16} className="text-[#22C55E]" />
                            <p className="text-[#22C55E] text-sm">{success}</p>
                        </div>
                    )}

                    {/* ERROR */}
                    {error && (
                        <div className="bg-[#EF4444]/10 border border-[#EF4444] rounded-lg p-3 mb-4 flex items-center gap-2">
                            <AlertCircle size={16} className="text-[#EF4444]" />
                            <p className="text-[#EF4444] text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="w-full bg-[#0F1117] border border-[#2A2E39] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#6366F1] transition"
                        />

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
                            className={`w-full py-2.5 rounded-lg text-white font-medium transition ${
                                loading
                                    ? "bg-[#2A2E39] opacity-50 cursor-not-allowed"
                                    : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90"
                            }`}
                        >
                            {loading ? "Creating account..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;