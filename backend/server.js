const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const postRouter = require("./routes/post.route");
const authRouter = require("./routes/auth.route");
const commentRouter = require("./routes/comment.route");

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", commentRouter);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connect to MongoDB");

        app.listen(PORT, () => {
            console.log("server is running on port:", PORT);
        });
    })
    .catch((e) => {
        console.log("Error connecting to MongoDB", e);
    });