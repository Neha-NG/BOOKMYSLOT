const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

const userControllers = require("../controllers/users.js")
const User = require("../models/user.js");

// Render Signup Form and POST Route - Signup User
router
.route("/signup")
.get(userControllers.renderSignUpForm)
.post(wrapAsync(userControllers.signup));


// Render Login Form and Login User
router.route("/login")
.get(userControllers.renderLoginForm)
.post(saveRedirectUrl,
    // login using : passsport.authenticate()
    passport.authenticate("local", { 
        failureRedirect: "/login", 
        failureFlash: true,           
    }), 
    userControllers.login
);

// Logout User
router.get("/logout", userControllers.logout);

module.exports = router;