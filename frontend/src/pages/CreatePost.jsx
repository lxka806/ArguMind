import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { Send, AlertCircle, CheckCircle } from "lucide-react";

function CreatePost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const categories = [
        "Technology", "Philosophy", "Politics", "Science", 
        "Art", "Education", "Health", "Business"
    ];

    const validate = () => {
        const newErrors = {};

        if (!title.trim()) {
            newErrors.title = "Argument title cannot be empty";
        } else if (title.length < 5) {
            newErrors.title = "Title must be at least 5 characters";
        } else if (title.length > 100) {
            newErrors.title = "Title cannot exceed 100 characters";
        }

        if (!content.trim()) {
            newErrors.content = "Please write your argument before posting";
        } else if (content.length < 20) {
            newErrors.content = "Add more substance — at least 20 characters";
        } else if (content.length > 2000) {
            newErrors.content = "Argument is too long (max 2000 characters)";
        }

        return newErrors;
    };

    const handleAddArguments = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            setErrors({});
            setSuccess("");

            await API.post("/addarguments", {
                title,
                content,
                category
            });

            setTitle("");
            setContent("");
            setCategory("");

            setSuccess("Argument posted successfully!");
            
            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            setErrors({
                submit: "Connection lost. Your argument could not be posted."
            });
        } finally {
            setLoading(false);
        }
    };

    const characterCount = content.length;
    const isContentValid = characterCount >= 20 && characterCount <= 2000;

    return (
        <div className="min-h-screen bg-[#0F1117] text-[#E6E8EB] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                
                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                        Create New Argument
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Share your thoughts and start meaningful debates
                    </p>
                </div>

                {/* SUCCESS */}
                {success && (
                    <div className="flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E] rounded-lg p-3 mb-4">
                        <CheckCircle size={18} className="text-[#22C55E]" />
                        <p className="text-[#22C55E] text-sm">{success}</p>
                    </div>
                )}

                {/* ERROR */}
                {errors.submit && (
                    <div className="flex items-center gap-2 bg-[#EF4444]/10 border border-[#EF4444] rounded-lg p-3 mb-4">
                        <AlertCircle size={18} className="text-[#EF4444]" />
                        <p className="text-[#EF4444] text-sm">{errors.submit}</p>
                    </div>
                )}

                <form onSubmit={handleAddArguments} className="space-y-4">
                    {/* TITLE */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            placeholder="What's your argument about?"
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full bg-[#0F1117] border rounded-lg px-4 py-2.5 text-sm focus:outline-none transition ${
                                errors.title
                                    ? "border-[#EF4444] focus:border-[#EF4444]"
                                    : "border-[#2A2E39] focus:border-[#6366F1]"
                            }`}
                        />
                        {errors.title && (
                            <p className="text-[#EF4444] text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {errors.title}
                            </p>
                        )}
                    </div>

                    {/* CONTENT */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Content
                        </label>
                        <textarea
                            value={content}
                            placeholder="Write your argument in detail..."
                            onChange={(e) => setContent(e.target.value)}
                            className={`w-full bg-[#0F1117] border rounded-lg px-4 py-2.5 text-sm h-48 resize-none focus:outline-none transition ${
                                errors.content
                                    ? "border-[#EF4444] focus:border-[#EF4444]"
                                    : "border-[#2A2E39] focus:border-[#6366F1]"
                            }`}
                        />
                        <div className="flex justify-between mt-1">
                            {errors.content && (
                                <p className="text-[#EF4444] text-xs flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {errors.content}
                                </p>
                            )}
                            <p className={`text-xs ml-auto ${isContentValid ? "text-[#22C55E]" : "text-gray-500"}`}>
                                {characterCount}/2000 characters
                            </p>
                        </div>
                    </div>

                    {/* CATEGORY */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                            Category (Optional)
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[#0F1117] border border-[#2A2E39] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#6366F1] cursor-pointer"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <p className="text-xs text-[#F59E0B] mt-1">
                            Adding a category helps others find your argument
                        </p>
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2.5 rounded-lg text-white font-medium transition flex items-center justify-center gap-2 ${
                            loading
                                ? "bg-[#2A2E39] opacity-50 cursor-not-allowed"
                                : "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:opacity-90"
                        }`}
                    >
                        {loading ? (
                            "Posting..."
                        ) : (
                            <>
                                <Send size={18} />
                                Post Argument
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreatePost;