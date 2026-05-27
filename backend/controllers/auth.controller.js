const User = require("../models/auth.model");
const Post = require("../models/post.model");

// -------------------- TOKEN + COOKIE --------------------
const createSendToken = (user, statusCode, req, res) => {
    const token = user.signToken();

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    user.password = undefined;

    res.cookie("lg", token, cookieOptions);

    return res.status(statusCode).json({
        token,
        user,
    });
};

// -------------------- REGISTER (SIMPLIFIED - NO EMAIL) --------------------
const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        console.log("📝 Registration attempt:", { fullname, email });

        // Validation
        if (!fullname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, and password are required.",
            });
        }

        if (fullname.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: "Full name must be at least 3 characters.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters.",
            });
        }

        const normalizedEmail = email.toLowerCase();

        // Check if user exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        // Create user (auto-verified for now)
        const newUser = await User.create({
            fullname: fullname.trim(),
            email: normalizedEmail,
            password,
            isVerified: true, // Auto-verify
        });

        console.log("✅ User created successfully:", newUser._id);

        // Remove password from output
        newUser.password = undefined;

        return res.status(201).json({
            success: true,
            message: "Account created successfully! You can now login.",
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email
            }
        });

    } catch (e) {
        console.error("❌ REGISTER ERROR:", e);
        return res.status(500).json({
            success: false,
            message: "Could not create account. Please try again.",
            error: e.message // This will help debug
        });
    }
};

// -------------------- VERIFY EMAIL --------------------
const verifyEmail = async (req, res) => {
    try {
        const code = req.params.code || req.query.code;
        const user = await User.findOne({ verificationCode: code });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification code.",
            });
        }

        user.verificationCode = undefined;
        user.isVerified = true;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: "Email verified successfully.",
        });
    } catch (err) {
        console.error("VERIFY ERROR:", err);
        return res.status(500).json({
            message: "Verification failed.",
        });
    }
};

// -------------------- LOGIN --------------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🔐 Login attempt:", { email });

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        console.log("✅ Login successful:", user._id);
        return createSendToken(user, 200, req, res);
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({
            message: "Login failed.",
        });
    }
};

// -------------------- GET ME --------------------
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const posts = await Post.find({ user: req.user.id }).sort({
            createdAt: -1,
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const totalLikes = posts.reduce(
            (sum, post) => sum + (post.likes?.length || 0),
            0
        );

        const totalDislikes = posts.reduce(
            (sum, post) => sum + (post.dislikes?.length || 0),
            0
        );

        user.password = undefined;
        user.verificationCode = undefined;

        return res.status(200).json({
            user,
            posts,
            stats: {
                totalPosts: posts.length,
                totalLikes,
                totalDislikes,
            },
        });
    } catch (err) {
        console.error("GETME ERROR:", err);
        return res.status(500).json({
            message: "Could not load profile.",
        });
    }
};

// -------------------- LOGOUT --------------------
const logout = (req, res) => {
    res.cookie("lg", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Logged out successfully.",
    });
};

module.exports = {
    register,
    verifyEmail,
    login,
    getMe,
    logout,
};