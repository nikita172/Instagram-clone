const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    fullName: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    userName: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    bio: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    profilePicture: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    mobileNo: {
        type: mongoose.Schema.Types.String,
        unique: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: false,
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: false,
    },
    gender: {
        type: mongoose.Schema.Types.String,
    },
    dob: {
        type: mongoose.Schema.Types.String,
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
    blueTick: {
        type: Boolean,
        default: false,
    },
    photos: {
        type: Array
    },
    story: {
        type: Array
    }
},
    { timestamps: true })

module.exports = mongoose.model('User', userSchema)