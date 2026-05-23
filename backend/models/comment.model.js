const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        text: String,

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        },

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);