const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE

const protect = (req, res, next) => {
    try {
        const token = req.cookies.lg

        if (!token) {
            return res.status(401).json({ message: "Not logged in" })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        // FIXED: Make sure the decoded token has the correct structure
        // Your signToken uses { id: this._id }
        req.user = decoded  // This gives you req.user.id

        next()

    } catch (e) {
        console.error("Auth middleware error:", e.message) // Added logging
        return res.status(401).json({ message: "Invalid token" })
    }
}

module.exports = {
    protect
}