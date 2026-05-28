import { useEffect, useState } from "react";
import API from "../api/api";

function Post() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // per-post comment input
    const [comments, setComments] = useState({});

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?._id;

    // FETCH POSTS
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

    // LIKE
    const likePost = async (postId) => {
        try {
            const res = await API.post(`/${postId}/like`);

            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? {
                              ...p,
                              likes: Array(res.data.likes).fill(0),
                              dislikes: Array(res.data.dislikes).fill(0),
                          }
                        : p
                )
            );
        } catch (err) {
            console.log("Like error:", err);
        }
    };

    // DISLIKE
    const dislikePost = async (postId) => {
        try {
            const res = await API.post(`/${postId}/dislike`);

            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? {
                              ...p,
                              likes: Array(res.data.likes).fill(0),
                              dislikes: Array(res.data.dislikes).fill(0),
                          }
                        : p
                )
            );
        } catch (err) {
            console.log("Dislike error:", err);
        }
    };

    // ADD COMMENT
    const handleComments = async (e, postId) => {
        e.preventDefault();

        try {
            await API.post(`/${postId}/comment`, {
                text: comments[postId],
            });

            setComments((prev) => ({
                ...prev,
                [postId]: "",
            }));

            fetchPosts(true);
        } catch (e) {
            console.log(e);
            alert("Error Posting Comment");
        }
    };

    if (loading) return <h2>Loading posts...</h2>;
    if (error) return <h2>{error}</h2>;
    if (posts.length === 0) return <h2>No posts found</h2>;

    return (
        <div>
            {posts.map((post) => (
                <div key={post._id} style={{ marginBottom: "40px" }}>
                    <h2>{post.title}</h2>

                    <p>Author: {post.user?.fullname}</p>
                    <p>{post.content}</p>
                    <p>Category: {post.category}</p>
                    {/* LIKE / DISLIKE */}
                    <div>
                        <button onClick={() => likePost(post._id)}>
                            👍 Like
                        </button>
                        <span>{post.likes?.length || 0}</span>

                        <button onClick={() => dislikePost(post._id)}>
                            👎 Dislike
                        </button>
                        <span>{post.dislikes?.length || 0}</span>
                    </div>

                    <hr />

                    {/* COMMENTS */}
                    <p>
                        <strong>
                            Comments ({post.commentsCount || 0})
                        </strong>
                    </p>

                    {post.comments?.length > 0 ? (
                        post.comments.map((comment) => (
                            <div
                                key={comment._id}
                                style={{
                                    marginLeft: "20px",
                                    marginBottom: "10px",
                                }}
                            >
                                <h4>
                                    {comment.user?.fullname || "User"}
                                </h4>

                                <p>{comment.text}</p>

                            </div>
                        ))
                    ) : (
                        <p style={{ marginLeft: "20px" }}>
                            No comments yet
                        </p>
                    )}

                    {/* ADD COMMENT */}
                    <form onSubmit={(e) => handleComments(e, post._id)}>
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
                        />

                        <button type="submit">Add Comment</button>
                    </form>
                </div>
            ))}
        </div>
    );
}

export default Post;