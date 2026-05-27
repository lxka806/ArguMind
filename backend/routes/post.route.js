const express = require("express")
const postRouter = express.Router()
const { 
    createPost, 
    getPosts, 
    getSinglePost,
    likePost, 
    dislikePost,
    deletePost
} = require("../controllers/post.controller")
const { protect } = require("../middlewares/auth.middlewares")

postRouter.post("/addarguments", protect, createPost) 
postRouter.get("/arguments", getPosts)
postRouter.get("/arguments/:id", getSinglePost)
postRouter.post("/:id/like", protect, likePost)
postRouter.post("/:id/dislike", protect, dislikePost)
postRouter.delete("/removeargument/:id", protect, deletePost)  // Add this route

module.exports = postRouter