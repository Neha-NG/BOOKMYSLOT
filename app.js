if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Slot = require("./models/slot.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { slotSchema } = require("./schema.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");
const { isLoggedIn } = require("./middleware.js");
const { isAdmin } = require("./middleware.js");

const slotRouter = require("./routes/slot.js"); 
const userRouter = require("./routes/user.js");
const user = require("./models/user.js");

// database

// const MONGO_URL = "mongodb://127.0.0.1:27017/bookmyslot";
const dbUrl = process.env.ATLASDB_URL;


main()
    .then(() => {
    console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// console.log("ATLASDB_URL =", process.env.ATLASDB_URL);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    // crypto: {
    //     secret: "mysupersecretcode"
    // },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    name: "bookmyslot.sid",          
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//Store & Unstore Methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// app.use((req, res, next) => {
//     res.locals.currUser = req.user;
//     next();
// });

// Admin - Only Promote Route : //Promote user to admin

app.get("/make-admin/:id", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user) {
            return res.status(404).send("User not found");
        }

        user.role = "admin";
        await user.save();

        res.send({
            message: "User promoted to admin successfully",
            user
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Temporary Admin Route

// app.get("/create-admin-secret", async (req, res) => {
//     try{
//         const adminUSer =  new User({
//             username: "admin",
//             email: "admin@bookmyslot.com",
//             role:"admin",
//             createdAt: new Date()
//         });

//         const registeredAdmin = await User.register(adminUSer, "admin123");

//         res.send({
//             message: "Admin created successfully",
//             admin: registeredAdmin
//         });
        
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });



// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         // name: "Student1",
//         email: "student1@gmail.com",
//         username: "aiml-student",
//         role: "student",
//         createdAt: new Date()
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);

// });

app.get("/", (req, res) => {
    res.redirect("/slots");
});

app.use("/slots", slotRouter);
app.use("/", userRouter);

// app.get("/", (req, res) => {
//     res.send("Server OK");
// });


// app.get("/testSlot", async (req, res) => {
//     let sampleSlot = new Slot({
//         date: new Date("2025-12-26"),
//         startTime: "9:00",
//         endTime:   "11:00",
//         isBooked:  false,
//         bookedBy:  null,
//         createdBy: new mongoose.Types.ObjectId()
//     });

//     await sampleSlot.save();
//     console.log("Sample Slot was Saved");
//     res.send("Successful Testing");
// });

app.use((req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

app.use((err, req, res, next)=> {
    if (res.headersSent) {
        return next(err);
    }

    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error", { message });
    // res.status(statusCode).send(message);
    // res.send("Something went wrong!");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>{
    console.log(`Server is listening to port ${PORT}`);
});