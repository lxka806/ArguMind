import { useEffect, useState } from "react";
import API from "../api/api";

function Profile() {
    const [posts, setPosts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await API.get("/auth/me");
            setUserData(res.data.user);
            setPosts(res.data.posts || []);
        } catch (err) {
            console.log("Profile fetch error:", err);
            if (err.response?.status === 401) alert("Please login to view your profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const deletePost = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            await API.delete(`/removeargument/${postId}`);
            setPosts((prev) => prev.filter((post) => post._id !== postId));
            alert("Post deleted successfully");
        } catch (err) {
            console.log("Delete error:", err);
            alert(err.response?.data?.message || "Failed to delete post");
        }
    };

    if (loading) return <div className="text-center py-20">Loading profile...</div>;
    if (!userData) return <div className="text-center py-20">Please login to view your profile</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Profile Header */}
            <div className="card mb-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#6366F1] to-[#4D8BFF] flex items-center justify-center">
                        <span className="text-3xl text-white font-bold">
                            {userData?.fullname?.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{userData?.fullname}</h1>
                        <p className="text-[#8E95A5] mt-1">{userData?.email}</p>
                        <div className="flex gap-6 mt-4">
                            <div>
                                <p className="text-2xl font-bold text-[#6366F1]">{posts.length}</p>
                                <p className="text-sm text-[#8E95A5]">Arguments</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[#22C55E]">
                                    {posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0)}
                                </p>
                                <p className="text-sm text-[#8E95A5]">Likes Received</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Posts */}
            <h2 className="text-2xl font-semibold mb-6">My Arguments</h2>
            {posts.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-[#8E95A5]">No arguments yet.</p>
                    <a href="/createArgument" className="text-[#6366F1] hover:underline mt-2 inline-block">
                        Create your first argument!
                    </a>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post._id} className="card">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                    <p className="text-[#E6E8EB]/80 mb-4">{post.content}</p>
                                    <div className="flex gap-4 text-sm text-[#8E95A5]">
                                        <span>❤️ {post.likes?.length || 0} likes</span>
                                        <span>💬 {post.commentsCount || 0} comments</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deletePost(post._id)}
                                    className="text-[#FF6B6B] hover:text-[#FF6B6B]/80 px-3 py-1 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Profile;