import { useEffect, useState } from "react";
import API from "../api/api";

function Profile() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    const fetchMyPosts = async () => {
        try {
            setLoading(true);

            const res = await API.get("/arguments");

            const myPosts = res.data.posts.filter(
                (post) => post.user?._id === userId
            );

            setPosts(myPosts);
        } catch (err) {
            console.log("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const deletePost = async (postId) => {
        try {
            await API.delete(`/removeargument/${postId}`);

            setPosts((prev) =>
                prev.filter((post) => post._id !== postId)
            );
        } catch (err) {
            console.log("Delete error:", err);
        }
    };

    if (loading)
        return (
            <div className="text-center text-[#E6E8EB] mt-10">
                Loading profile...
            </div>
        );

    return (
        <div className="min-h-screen bg-[#0F1117] text-[#E6E8EB] px-6 py-8">
            
            {/* PROFILE HEADER */}
            <div className="max-w-3xl mx-auto bg-[#1A1D24] border border-[#2A2E39] rounded-xl p-5 mb-6">
                <h1 className="text-2xl font-bold text-[#6366F1] mb-4">
                    My Profile
                </h1>

                <div className="space-y-1">
                    <h3 className="text-lg font-semibold">
                        {user?.fullname}
                    </h3>
                    <h4 className="text-sm text-gray-400">
                        {user?.email}
                    </h4>
                </div>
            </div>

            {/* POSTS SECTION */}
            <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">
                    My Posts
                </h2>

                {posts.length === 0 ? (
                    <div className="text-center text-gray-500 bg-[#1A1D24] border border-[#2A2E39] rounded-xl p-6">
                        No posts yet
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-[#1A1D24] border border-[#2A2E39] rounded-xl p-5 hover:border-[#6366F1] transition"
                            >
                                <h3 className="text-lg font-semibold mb-2">
                                    {post.title}
                                </h3>

                                <p className="text-sm text-gray-300 mb-4">
                                    {post.content}
                                </p>

                                <button
                                    onClick={() => deletePost(post._id)}
                                    className="px-3 py-1 text-sm rounded-lg bg-[#EF4444] hover:opacity-90 transition text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;