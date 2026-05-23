const express = require("express")
const postRouter = express.Router()
const { createPost, 
        getPosts, 
        getSinglePost,
        deletePost,
        likePost, 
        dislikePost
    } = require("../controllers/post.controller")
const { protect } = require("../middlewares/auth.middlewares")

// creating routes for post
postRouter.post("/addarguments", protect, createPost) 
postRouter.get("/arguments", getPosts)
postRouter.get("/arguments/:id", getSinglePost)
postRouter.delete("/removeargument/:id", protect, deletePost)
postRouter.post("/:id/like", protect, likePost)
postRouter.post("/:id/dislike", protect, dislikePost)

module.exports = postRouter // export route
