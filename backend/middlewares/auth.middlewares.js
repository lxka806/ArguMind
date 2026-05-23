const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SECRETE

const protect = (req, res, next) => {
    try {

        const token = req.cookies.lg

        if (!token) {
            return res.status(401).json({ message: "Not logged in" })
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        req.user = decoded   // or { id: decoded.id }

        next()

    } catch (e) {
        return res.status(401).json({ message: "Invalid token" })
    }
}


// export protect function
module.exports = {
    protect
}
