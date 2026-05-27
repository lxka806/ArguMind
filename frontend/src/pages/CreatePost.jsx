import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddArguments = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await API.post("/addarguments", { title, content, category });
            alert("Argument posted successfully!");
            navigate("/");
        } catch (err) {
            console.log("Error creating post:", err);
            alert(err.response?.data?.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#6366F1] to-[#4D8BFF] bg-clip-text text-transparent">
                Create New Argument
            </h1>

            <form onSubmit={handleAddArguments} className="card space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a compelling title..."
                        required
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2A2E39] rounded-lg text-[#E6E8EB] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your argument in detail..."
                        rows="8"
                        required
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2A2E39] rounded-lg text-[#E6E8EB] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., AI, Ethics, Politics, Technology..."
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2A2E39] rounded-lg text-[#E6E8EB] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={loading} className="primary-btn px-8 py-3">
                        {loading ? "Posting..." : "Post Argument"}
                    </button>
                    <button type="button" onClick={() => navigate("/")} className="secondary-btn px-8 py-3">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePost;