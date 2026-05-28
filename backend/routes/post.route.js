const express = require("express")
const postRouter = express.Router()
const { createPost, 
        getPosts, 
        getSinglePost,
        likePost, 
        dislikePost,
        deleteArgument
    } = require("../controllers/post.controller")
const { protect } = require("../middlewares/auth.middlewares")

// creating routes for post
postRouter.post("/addarguments", protect, createPost) 
postRouter.get("/arguments", getPosts)
postRouter.get("/arguments/:id", getSinglePost)
postRouter.post("/:id/like", protect, likePost)
postRouter.post("/:id/dislike", protect, dislikePost)
postRouter.delete("/removeargument/:id", protect, deleteArgument);

module.exports = postRouter // export route
