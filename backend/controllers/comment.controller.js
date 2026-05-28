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
//get comments
const getComent = async (req, res) => {
    try{
        // find comment with Id
        const comments = await Comment.find({
            post: req.params.id
        }).populate("user", "fullname email") // after finding returning Users fullName and email

        res.status(200).json({  /// giving comment to front end
            comments
        })


    }catch(e){ // if there is an erro
        res.status(500).json({ message: "Failed to load comments."})
    }
}
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params; // comment id

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // only owner can delete
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You cannot delete this comment"
            });
        }

        await Comment.findByIdAndDelete(id);

        // remove from post
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: id },
            $inc: { commentsCount: -1 }
        });

        return res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (err) {
        console.error("Delete comment error:", err);
        return res.status(500).json({
            message: "Failed to delete comment"
        });
    }
};

module.exports = {
    createComent,
    getComent,
    deleteComment
}
