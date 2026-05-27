const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const dotenv = require("dotenv")
dotenv.config()
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const postRouter = require("./routes/post.route")
const authRouter = require("./routes/auth.route")
const commentRouter = require("./routes/comment.route")

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

// Allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",           // Local frontend
  "https://argumind-luka.netlify.app", // Production frontend
  "http://localhost:3000"            // Local backend
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
        callback(null, true);
        } else {
        console.log("Blocked origin:", origin);
        callback(new Error("CORS blocked"));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// FIXED: Remove the problematic line - this was causing the error
// app.options('*', cors());  // DELETE THIS LINE - it's the cause of the error!

// The cors middleware already handles OPTIONS requests automatically

app.use("/api/v1/auth", authRouter)
app.use("/api/v1", postRouter)
app.use("/api/v1", commentRouter)

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connect to MongoDB")
        app.listen(PORT, () => {
            console.log("server is running on port:", PORT)
        })
    })
    .catch((e) => {
        console.log("Error conecting to MongoDB", e)
    })