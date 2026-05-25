import { useEffect, useState } from "react"
import API from "../api/api"

function Post() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [commentText, setCommentText] = useState({})

    // Added a 'silent' parameter to prevent full-screen flashing on updates
    const fetchPosts = async (silent = false) => {
        try {
            if (!silent) setLoading(true)

            const res = await API.get("/arguments")
            setPosts(res.data.posts)
            
            setError(null) // Clear any previous errors on successful fetch
        } catch (e) {
            console.error(e)
            setError("Failed to load posts")
        } finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        fetchPosts()
    }, [])

    // This full-screen loader will now only run on the first mount
    if (loading) {
        return <h2>Loading posts...</h2>
    }

    if (error) {
        return (
            <div>
                <h2>{error}</h2>
                <button onClick={() => fetchPosts()}>Try Again</button>
            </div>
        )
    }

    if (posts.length === 0) {
        return <h2>No posts found</h2>
    }

    return (
        <div>
            {posts.map((post) => (
                <div key={post._id} style={{ marginBottom: "40px" }}>
                    <h2>{post.title}</h2>

                    <p>Author: {post.user?.fullname}</p>
                    <p>{post.content}</p>
                    <p>Category: {post.category}</p>

                    <div>
                        <button>
                            Like
                        </button>
                        <span>{post.likes?.length || 0}</span>

                        <button>
                            Dislike
                        </button>
                        <span>{post.dislikes?.length || 0}</span>
                    </div>

                    <hr />

                    <p><strong>Comments ({post.commentsCount || 0}):</strong></p>

                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                            <div key={comment._id} style={{ marginLeft: "20px", marginBottom: "10px" }}>
                                <h4>{comment.user?.fullname || "User_404"}</h4>
                                <p>{comment.text}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ marginLeft: "20px" }}>No comments yet</p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Post