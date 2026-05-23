const mongoose = require("mongoose")

const postschema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: 5
        },
        content: {
            type: String,
            required: true,
            minlength: 10
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        category: {
            type: String,
            default: "general"
            },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            }
        ],

        dislikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            }
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],

        commentsCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

const Post = mongoose.model("Post", postschema)

module.exports = Post