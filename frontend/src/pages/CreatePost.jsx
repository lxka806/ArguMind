import { useState } from "react";
import API from "../api/api";

function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("")

    const handleAddArguments = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/addarguments", {
                title,
                content,
                category
            });

            console.log("Post created:", res.data);

            // clear inputs after success
            setTitle("");
            setContent("");
            setCategory("")
            alert("Argument was posted Successfuly")
        } catch (err) {
            console.log("Error creating post:", err);
        }
    };

    return (
        <>
            <h1>Create Post</h1>

            <form onSubmit={handleAddArguments}>
                <input
                    type="text"
                    value={title}
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    type="text"
                    value={content}
                    placeholder="Content"
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <input 
                    type="text"
                    value={category}
                    placeholder="Category"
                    onChange={(e) => setCategory(e.target.value)}
                />

                <button type="submit">Create</button>
            </form>
        </>
    );
}

export default CreatePost;