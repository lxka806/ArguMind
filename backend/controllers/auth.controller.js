const User = require("../models/auth.model")
const Post = require("../models/post.model")
const sendEmail = require("../utils/email")

const createSendToken = (user, statusCode, req, res, options) => {
    const token = user.signToken()
    const buildCookieOptions = (req) => {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };
    };
    const cookieOptions = buildCookieOptions(req)

    user.password = undefined

    const response = res.cookie("lg", token, cookieOptions)

    if (options && options.redirectURL) {
        return response.redirect(302, options.redirectURL)
    }

    return response.status(statusCode).json({
        token,
        user
    })
}

const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "Full name, email, and password are required."
            })
        }

        if (fullname.trim().length < 3) {
            return res.status(400).json({
                message: "Full name must be at least 3 characters."
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            })
        }

        const normalizedEmail = email.toLowerCase()

        const existingUser = await User.findOne({ email: normalizedEmail })

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            })
        }

        const newUser = await User.create({
            fullname: fullname.trim(), // Fixed: Don't lowercase fullname
            email: normalizedEmail,
            password
        })

        const code = newUser.createEmailVerificationCode()

        await newUser.save({ validateBeforeSave: false })

        const url = `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${code}`

        const html = `
        <html>
        <body>
            <h1>Verify Your Account</h1>
            <p>Your verification code is:</p>
            <h2>${code}</h2>
            <a href="${url}">Click to verify</a>
        </body>
        </html>
        `

        await sendEmail({
            to: newUser.email,
            subject: "Verify your ArguMind account",
            html
        })

        res.status(201).json({
            message: "Account created. Check your email to verify your access."
        })

    } catch (e) {
        console.error("Register Error", e)
        return res.status(500).json({
            message: "Could not create your account right now."
        })
    }
}

const verifyEmail = async (req, res) => {
    const code = req.params.code || req.query.code

    const user = await User.findOne({ verificationCode: code })

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification code." })
    }

    user.verificationCode = undefined
    user.isVerified = true

    await user.save({ validateBeforeSave: false })

    res.status(200).json({ message: "Email verified successfully. You can now log in." })
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                message: "Please verify your email before logging in."
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        return createSendToken(user, 200, req, res);

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({
            message: "Login failed. Please try again."
        });
    }
};

const getMe = async (req, res) => {
    try {
        // FIXED: Use req.user.id (from protect middleware)
        const user = await User.findById(req.user.id)
        const usersPosts = await Post.find({
            user: req.user.id
        }).sort({ createdAt: -1 })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const totalLikesReceived = usersPosts.reduce((sum, post) => sum + post.likes.length, 0)
        const totalDislikesReceived = usersPosts.reduce((sum, post) => sum + post.dislikes.length, 0)

        user.password = undefined
        user.verificationCode = undefined

        return res.status(200).json({
            user,
            posts: usersPosts,
            stats: {
                totalPosts: usersPosts.length,
                totalLikesReceived,
                totalDislikesReceived
            }
        })
    } catch (e) {
        console.error("GetMe Error:", e) // Added error logging
        return res.status(500).json({
            message: "Could not load your profile."
        })
    }
}

const logout = async (req, res) => {
    res.cookie("lg", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Logged out successfully."
    });
};

module.exports = {
    register,
    verifyEmail,
    login,
    getMe,
    logout
}