import {model, Schema} from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
    },
    role: {
        type: Number,
        default: 0 // 1 admin, 0 user
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dvwpmxowk/image/upload/v1672661338/sample.jpg"
    },
}, {
    timestamps: true,
})

module.exports = model("Users", userSchema)