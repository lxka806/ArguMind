import { useEffect, useState } from "react";
import API from "../api/api";

function Post() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState({});
    
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?._id;

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
        await API.post(`/${postId}/like`);
        fetchPosts(true);

        const updatedPost = res.data.post || res.data;

        setPosts((prev) =>
            prev.map((p) =>
                p._id === postId
                    ? {
                          ...p,
                          likes: updatedPost.likes || [],
                          dislikes: updatedPost.dislikes || [],
                      }
                    : p
            )
        );
    } catch (err) {
        console.log("Like error:", err);
    }
};

    const dislikePost = async (postId) => {
    try {
        await API.post(`/${postId}/dislike`);
        fetchPosts(true);

        const updatedPost = res.data.post || res.data;

        setPosts((prev) =>
            prev.map((p) =>
                p._id === postId
                    ? {
                          ...p,
                          likes: updatedPost.likes || [],
                          dislikes: updatedPost.dislikes || [],
                      }
                    : p
            )
        );
    } catch (err) {
        console.log("Dislike error:", err);
    }
};

    const deleteComment = async (commentId, postId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to delete comments");
                return;
            }

            await API.delete(`/comment/${commentId}`);
            
            // Update the posts state to remove the deleted comment
            setPosts((prev) =>
                prev.map((post) => {
                    if (post._id === postId) {
                        const updatedComments = post.comments.filter(
                            (c) => c._id !== commentId
                        );
                        return {
                            ...post,
                            comments: updatedComments,
                            commentsCount: updatedComments.length,
                        };
                    }
                    return post;
                })
            );
        } catch (err) {
            console.error("Delete comment error:", err);
            alert("Failed to delete comment");
        }
    };

    const handleComments = async (e, postId) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to comment");
            return;
        }

        const text = comments[postId];

        if (!text || text.trim().length === 0) {
            alert("Write something before posting");
            return;
        }

        try {
            await API.post(`/${postId}/comment`, {
                text: text,
            });

            setComments((prev) => ({
                ...prev,
                [postId]: "",
            }));

            // Refresh posts to get the new comment
            fetchPosts(true);
        } catch (e) {
            console.error("Comment error:", e);
            if (e.response?.status === 401) {
                alert("Please login to comment");
            } else {
                alert("Error Posting Comment");
            }
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-[#E6E8EB]">
                <div className="inline-flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
                    Loading posts...
                </div>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                {error}
            </div>
        );

    if (posts.length === 0)
        return (
            <div className="flex justify-center items-center h-screen text-[#E6E8EB] opacity-70">
                No posts found
            </div>
        );

    return (
        <div className="bg-[#0F1117] min-h-screen py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-[#1A1D24] border border-[#2A2E39] rounded-xl p-5 shadow-md hover:shadow-lg transition"
                    >
                        {/* TITLE */}
                        <h2 className="text-xl font-bold text-[#E6E8EB] mb-1">
                            {post.title}
                        </h2>

                        {/* META */}
                        <div className="text-sm text-gray-400 mb-3 flex gap-2 flex-wrap">
                            <span>By {post.user?.fullname || "Unknown"}</span>
                            {post.category && (
                                <>
                                    <span>•</span>
                                    <span className="px-2 py-0.5 rounded-full bg-[#2A2E39] text-xs">
                                        {post.category}
                                    </span>
                                </>
                            )}
                            <span>•</span>
                            <span>
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* CONTENT */}
                        <p className="text-[#E6E8EB] opacity-90 mb-4 leading-relaxed">
                            {post.content}
                        </p>

                        {/* LIKE / DISLIKE */}
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => likePost(post._id)}
                                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#2A2E39] hover:bg-[#22C55E] hover:text-white transition"
                            >
                                👍 <span>{post.likes?.length || 0}</span>
                            </button>

                            <button
                                onClick={() => dislikePost(post._id)}
                                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#2A2E39] hover:bg-[#EF4444] hover:text-white transition"
                            >
                                👎 <span>{post.dislikes?.length || 0}</span>
                            </button>
                        </div>

                        <hr className="border-[#2A2E39] mb-4" />

                        {/* COMMENTS HEADER */}
                        <p className="text-sm text-[#E6E8EB] mb-2">
                            <strong>Comments ({post.comments?.length || 0})</strong>
                        </p>

                        {/* COMMENTS */}
                        {post.comments?.length > 0 ? (
                            <div className="space-y-2 mb-4">
                                {post.comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="bg-[#0F1117] border border-[#2A2E39] rounded-lg p-3"
                                    >
                                        {/* top row */}
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm text-[#6366F1] font-semibold">
                                                {comment.user?.fullname || "User"}
                                            </h4>

                                            {/* DELETE BUTTON */}
                                            {comment.user?._id === currentUserId && (
                                                <button
                                                    onClick={() => deleteComment(comment._id, post._id)}
                                                    className="text-xs text-red-500 hover:text-red-400 transition"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>

                                        {/* comment text */}
                                        <p className="text-sm text-[#E6E8EB] opacity-80 mt-1">
                                            {comment.text}
                                        </p>
                                        
                                        {/* comment date */}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 mb-4">
                                No comments yet
                            </p>
                        )}

                        {/* COMMENT INPUT */}
                        <form
                            onSubmit={(e) => handleComments(e, post._id)}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={comments[post._id] || ""}
                                onChange={(e) =>
                                    setComments({
                                        ...comments,
                                        [post._id]: e.target.value,
                                    })
                                }
                                placeholder="Write a comment..."
                                className="flex-1 bg-[#0F1117] border border-[#2A2E39] rounded-lg px-3 py-2 text-sm text-[#E6E8EB] focus:outline-none focus:border-[#6366F1]"
                            />

                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:opacity-90 transition"
                            >
                                Add
                            </button>
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Post;