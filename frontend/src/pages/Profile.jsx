import { useEffect, useState } from "react";
import API from "../api/api";

function Profile() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    // FETCH USER POSTS
    const fetchMyPosts = async () => {
        try {
            setLoading(true);

            const res = await API.get("/arguments"); // all posts

            // filter only my posts
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

    // DELETE POST
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

    if (loading) return <h2>Loading profile...</h2>;

    return (
        <div>
            <h1>My Profile</h1>

            <div>
                <h3>Name: {user?.fullname}</h3>
                <h4>Email: {user?.email}</h4>
            </div>

            <hr />

            <h2>My Posts</h2>

            {posts.length === 0 ? (
                <p>No posts yet</p>
            ) : (
                posts.map((post) => (
                    <div key={post._id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>

                        <button
                            onClick={() => deletePost(post._id)}
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default Profile;