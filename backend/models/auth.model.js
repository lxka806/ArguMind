const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            // FIXED: Removed lowercase - names should preserve case
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Keep this - emails are case-insensitive
            validate: [validator.isEmail, "Invalid email"]
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            // FIXED: Removed maxlength restriction (let bcrypt handle it)
            select: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationCode: String
    },
    { timestamps: true }
);

// hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
});
// compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password); // FIXED: Added await
};

// email code
userSchema.methods.createEmailVerificationCode = function () {
    const code = crypto.randomBytes(32).toString("hex");
    this.verificationCode = code;
    return code;
};

// JWT
userSchema.methods.signToken = function () {
    return jwt.sign(
        { id: this._id },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } // FIXED: Added fallback
    );
};

const User = mongoose.model("Users", userSchema);
module.exports = User;