const express = require("express");
const authRouter = express.Router();
const { register, verifyEmail, login, getMe, logout } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middlewares");

// Make sure these routes are correct
authRouter.post("/register", register);  // POST request to /api/v1/auth/register
authRouter.get("/verify-email/:code", verifyEmail);
authRouter.post("/login", login);
authRouter.get("/me", protect, getMe);
authRouter.post("/logout", logout);

module.exports = authRouter;