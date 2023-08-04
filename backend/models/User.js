const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: false
    },
    uniqueName: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    },
    mobileNo: {
        type: String,
        required: false,
        unique: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    dob: {
        type: String,
        required: false,
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    likes: {
        type: Array,
        default: []
    },
    verified: {
        type: Boolean,
        default: false,
    },
    photos: {
        type: Array
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)