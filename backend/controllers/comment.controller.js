const Comment = require("../models/comment.model")
const Post = require("../models/post.model")

const createComent = async (req, res) => {
    try {
        const postId = req.params.id
        const { text } = req.body

        // 1. Validate input
        if (!text) {
            return res.status(400).json({
                message: "Comment text is required"
            })
        }

        // 2. Check post exists
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }

        const comment = await Comment.create({
            text,
            post: postId,
            user: req.user.id
        });

        // 4. Push into post
        post.comments.push(comment._id)
        post.commentsCount = post.comments.length

        await post.save()

        res.status(201).json({
            success: true,
            comment
        })

    } catch (error) {
        console.log("CREATE COMMENT ERROR:", error)
        res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

// Get comments
const getComent = async (req, res) => {
    try{
        const comments = await Comment.find({
            post: req.params.id
        }).populate("user", "fullname email")

        res.status(200).json({
            comments
        })
    } catch(e){
        res.status(500).json({ message: "Failed to load comments."})
    }
}

// ADD THIS: Delete comment function
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId
        
        // Find the comment
        const comment = await Comment.findById(commentId)
        
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            })
        }
        
        // Check if user owns the comment OR is the post owner
        const post = await Post.findById(comment.post)
        
        const isCommentOwner = comment.user.toString() === req.user.id
        const isPostOwner = post && post.user.toString() === req.user.id
        
        if (!isCommentOwner && !isPostOwner) {
            return res.status(403).json({
                message: "You can only delete your own comments"
            })
        }
        
        // Remove comment from post's comments array
        if (post) {
            post.comments = post.comments.filter(
                id => id.toString() !== commentId
            )
            post.commentsCount = post.comments.length
            await post.save()
        }
        
        // Delete the comment
        await Comment.findByIdAndDelete(commentId)
        
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        })
        
    } catch (error) {
        console.log("DELETE COMMENT ERROR:", error)
        res.status(500).json({
            message: "Failed to delete comment",
            error: error.message
        })
    }
}

module.exports = {
    createComent,
    getComent,
    deleteComment  // Add this
}