const Comment = require("../models/comment.model")
const Post = require("../models/post.model")

// create Comment
const createComent = async (req, res) => {
    try{
        const { text } = req.body // geting "comment" from body

        if (!text || text.trim().length < 2) {
            return res.status(400).json({
                message: "Comment must be at least 2 characters."
            })
        }

        const post = await Post.findById(req.params.id) // getign post from params

        if(!post){  // cheking is post is found or not  
            return res.status(404).json({ message: "Post not found" })
        }

        // creating comment for post
        const comment = await Comment.create({
            text: text.trim(),   // text that will be on the post
            user: req.user.id,  // user that is posting comment
            post: post._id  // Post ID 
        })

        post.comments.push(comment._id) // comment is geting pushed in post Schema
        post.commentsCount = post.comments.length

        await post.save()   // post Schemaa is saved

        res.status(201).json({  /// sending message to front end
            message: "Comment created successfully",
            comment
        })

    }catch(e){  // if there is an Error
        return res.status(500).json({ message: "Failed to create comment."})
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
        const { id, commentId } = req.params

        const comment = await Comment.findById(commentId)

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }

        if (comment.post.toString() !== id) {
            return res.status(400).json({ message: "Comment does not belong to this post." })
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own comments." })
        }

        await Comment.findByIdAndDelete(commentId)

        await Post.findByIdAndUpdate(id, {
            $pull: { comments: comment._id },
            $inc: { commentsCount: -1 }
        })

        return res.status(200).json({
            message: "Comment deleted successfully."
        })
    } catch (e) {
        return res.status(500).json({
            message: "Failed to delete comment."
        })
    }
}

module.exports = {
    createComent,
    getComent,
    deleteComment
}
