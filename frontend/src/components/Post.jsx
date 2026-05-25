import { useEffect, useState } from "react"
import API from "../api/api"

function Post() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchPosts = async () => {
        try {
            setLoading(true)

            const res = await API.get("/arguments")
            setPosts(res.data.posts)

            setLoading(false)
        } catch (e) {
            console.log(e)
            setError("Failed to load posts")
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    if (loading) {
        return <h2>Loading posts...</h2>
    }

    if (error) {
        return <h2>{error}</h2>
    }

    if (posts.length === 0) {
        return <h2>No posts found</h2>
    }

    return (
        <div>
            {posts.map((post) => (
                <div key={post._id}>
                    <h2>{post.title}</h2>

                    <p>
                        Author: {post.user?.fullname}
                    </p>

                    <p>{post.content}</p>
                    <p>Category: {post.category}</p>

                    <p>Comments: {post.commentsCount}</p>
                    <button>Like</button><p>{post.likes?.length || 0}</p>
                    <button>Dislike </button><p>{post.dislikes?.length || 0}</p>

                    <hr />

                    <p>Comments:</p>

                    {post.comments?.length > 0 ? (
                        post.comments.map((comment) => (
                            <>
                                <div key={comment._id}>
                                    <h4>{comment.user?.fullname}</h4>
                                    <p>{comment.text}</p>
                                </div>
                                <form>
                                    <input type="text" />
                                    <button>Submit</button>
                                </form>
                            </>
                        ))
                    ) : (
                        <p>No comments yet</p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Post