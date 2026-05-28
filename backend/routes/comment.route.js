const express = require("express")
const commentRouter = express.Router()

const {createComent, getComent, deleteComment} = require("../controllers/comment.controller")
const { protect } = require("../middlewares/auth.middlewares") 

commentRouter.post("/:id/comment", protect, createComent)
commentRouter.get("/:id/comments", getComent)
commentRouter.delete("/comment/:id", protect, deleteComment);

module.exports = commentRouter
