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
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Invalid email"]
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationCode: {
            type: String,
            default: undefined  // Make sure this field exists
        }
    },
    { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create email verification code (FIXED)
userSchema.methods.createEmailVerificationCode = function () {
    // Generate a simpler code for testing (6-digit number)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCode = code;
    return code;
};

// JWT sign token
userSchema.methods.signToken = function () {
    return jwt.sign(
        { id: this._id },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};

const User = mongoose.model("Users", userSchema);
module.exports = User;