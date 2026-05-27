const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

// CREATE POST
const createPost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const { title, content, category } = req.body;

        if (!title || title.trim().length < 5) {
            return res.status(400).json({ message: "Title too short" });
        }

        if (!content || content.trim().length < 10) {
            return res.status(400).json({ message: "Content too short" });
        }

        const post = await Post.create({
            title: title.trim(),
            content: content.trim(),
            category,
            user: req.user.id
        });

        return res.status(201).json({ post });

    } catch (e) {
        return res.status(500).json({ message: "Create post failed" });
    }
};

// GET ALL POSTS
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "fullname")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "fullname"
                }
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({ posts });

    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ message: "Failed to load posts" });
    }
};

// GET SINGLE POST
const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "fullname")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "fullname"
                }
            });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ post });

    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ message: "Failed to load post" });
    }
};

// LIKE POST
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user.id;

        const hasLiked = post.likes.some(id => id.toString() === userId);

        if (hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
            post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
        }

        await post.save();

        return res.status(200).json({
            likes: post.likes.length,
            dislikes: post.dislikes.length
        });

    } catch (e) {
        return res.status(500).json({ message: "Like failed" });
    }
};

// DISLIKE POST
const dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                message: "Not logged in"
            });
        }

        const userId = req.user.id;

        const hasDisliked = post.dislikes.some(
            id => id.toString() === userId
        );

        // remove like if exists
        post.likes = post.likes.filter(
            id => id.toString() !== userId
        );

        // toggle dislike
        if (hasDisliked) {
            post.dislikes = post.dislikes.filter(
                id => id.toString() !== userId
            );
        } else {
            post.dislikes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            likes: post.likes.length,
            dislikes: post.dislikes.length
        });

    } catch (error) {
        console.log("DISLIKE ERROR:", error);

        return res.status(500).json({
            message: "Dislike failed"
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    getSinglePost,
    likePost,
    dislikePost
};