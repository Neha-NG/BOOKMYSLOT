const Slot = require("../models/slot.js");
const User = require("../models/user.js");



module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
        req.flash("success", "Welcome to BookMySlot");
        res.redirect("/slots");
        });

    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
};

// after login redirect
module.exports.login  = async (req, res) => {
        // console.log(req.user);
        await req.flash("success", "Welcome back to BookMySlot");
        let redirectUrl = res.locals.redirectUrl || "/slots";
        res.redirect(redirectUrl);
};

module.exports.logout  = (req, res, next) => {
    req.logout((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success", "You're logged out!");
        res.redirect("/slots");
    });
};