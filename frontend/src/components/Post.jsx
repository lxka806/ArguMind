import { useEffect, useState } from "react";
import API from "../api/api";

function Post() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState({});

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?._id;

    const fetchPosts = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const res = await API.get("/arguments");
            setPosts(res.data.posts);
            setError(null);
        } catch (e) {
            console.error(e);
            setError("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const likePost = async (postId) => {
        try {
            const res = await API.post(`/${postId}/like`);
            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? { ...p, likes: res.data.likes, dislikes: res.data.dislikes }
                        : p
                )
            );
        } catch (err) {
            console.log("Like error:", err);
            if (err.response?.status === 401) alert("Please login to like posts");
        }
    };

    const dislikePost = async (postId) => {
        try {
            const res = await API.post(`/${postId}/dislike`);
            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? { ...p, likes: res.data.likes, dislikes: res.data.dislikes }
                        : p
                )
            );
        } catch (err) {
            console.log("Dislike error:", err);
            if (err.response?.status === 401) alert("Please login to dislike posts");
        }
    };

    const handleComments = async (e, postId) => {
        e.preventDefault();
        try {
            await API.post(`/${postId}/comment`, { text: comments[postId] });
            setComments((prev) => ({ ...prev, [postId]: "" }));
            fetchPosts(true);
        } catch (e) {
            console.log(e);
            alert("Error Posting Comment");
        }
    };

    const deleteComment = async (commentId, postId) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        try {
            await API.delete(`/comment/${commentId}`);
            fetchPosts(true);
            alert("Comment deleted successfully");
        } catch (err) {
            console.log("Delete comment error:", err);
            alert(err.response?.data?.message || "Failed to delete comment");
        }
    };

    if (loading) return <div className="text-center py-20 text-[#E6E8EB]">Loading posts...</div>;
    if (error) return <div className="text-center py-20 text-[#FF6B6B]">{error}</div>;
    if (posts.length === 0) return <div className="text-center py-20 text-[#8E95A5]">No posts found. Be the first to create an argument!</div>;

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <div key={post._id} className="card card-hover">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366F1] to-[#4D8BFF] flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {post.user?.fullname?.charAt(0) || "U"}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold">{post.user?.fullname}</p>
                                <p className="text-xs text-[#8E95A5]">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-[#2A2E39] rounded-full text-xs">
                                #{post.category}
                            </span>
                        </div>
                    </div>

                    {/* Post Content */}
                    <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
                    <p className="text-[#E6E8EB]/80 mb-4 leading-relaxed">{post.content}</p>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4">
                        {post.tags?.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 bg-[#2A2E39] rounded-full text-xs text-[#E6E8EB]">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Engagement Buttons */}
                    <div className="flex gap-6 mb-6 pt-4 border-t border-[#2A2E39]">
                        <button onClick={() => likePost(post._id)} className="flex items-center gap-2 text-[#E6E8EB] hover:text-[#6366F1] transition-colors">
                            <span>👍</span> <span>{post.likes?.length || 0}</span>
                        </button>
                        <button onClick={() => dislikePost(post._id)} className="flex items-center gap-2 text-[#E6E8EB] hover:text-[#FF6B6B] transition-colors">
                            <span>👎</span> <span>{post.dislikes?.length || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-[#E6E8EB] hover:text-[#4D8BFF] transition-colors">
                            <span>💬</span> <span>{post.commentsCount || 0}</span>
                        </button>
                        <button className="flex items-center gap-2 text-[#E6E8EB] hover:text-[#F59E0B] transition-colors">
                            <span>🔗</span> <span>Share</span>
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Comments ({post.commentsCount || 0})</h3>
                        
                        {post.comments?.length > 0 ? (
                            post.comments.map((comment) => (
                                <div key={comment._id} className="bg-[#0F1117] rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-sm">{comment.user?.fullname || "User"}</p>
                                            <p className="text-sm mt-1">{comment.text}</p>
                                            <p className="text-xs text-[#8E95A5] mt-2">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {(currentUserId === comment.user?._id || currentUserId === post.user?._id) && (
                                            <button
                                                onClick={() => deleteComment(comment._id, post._id)}
                                                className="text-[#FF6B6B] hover:text-[#FF6B6B]/80 text-sm"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[#8E95A5] text-sm">No comments yet</p>
                        )}

                        {/* Add Comment Form */}
                        {currentUser ? (
                            <form onSubmit={(e) => handleComments(e, post._id)} className="flex gap-3 mt-4">
                                <input
                                    type="text"
                                    value={comments[post._id] || ""}
                                    onChange={(e) => setComments({ ...comments, [post._id]: e.target.value })}
                                    placeholder="Write a comment..."
                                    className="flex-1 px-4 py-2 bg-[#0F1117] border border-[#2A2E39] rounded-lg text-sm focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
                                />
                                <button type="submit" className="primary-btn px-6 py-2">
                                    Post
                                </button>
                            </form>
                        ) : (
                            <p className="text-center text-[#8E95A5] text-sm mt-4">
                                <a href="/login" className="text-[#6366F1] hover:underline">Login</a> to leave a comment
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Post;