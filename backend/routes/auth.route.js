const express = require("express")
const authRouter = express.Router()
const { register, verifyEmail, login, getMe, logout } = require("../controllers/auth.controller")
const { protect } = require("../middlewares/auth.middlewares")

// creating routes for users
authRouter.post("/register", register) 
authRouter.get("/verify-email/:code", verifyEmail) 
authRouter.post("/login", login) 
authRouter.get("/me", protect, getMe)
authRouter.post("/logout", logout)

module.exports = authRouter // export route
