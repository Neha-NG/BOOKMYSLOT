const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    // name: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     minlength: 2,
    //     maxlength: 50
    // },
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },
    // password: {
    // type: String,
    // required: true,
    // minlength: 6
    // },
    role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
    },
    createdAt: {
    type: Date,
    default: Date.now
    }

});

// console.log("passportLocalMongoose type:", typeof passportLocalMongoose);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);