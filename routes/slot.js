const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const { isAdmin } = require("../middleware.js");
const { validateSlot } = require("../middleware.js");
const { isBookingOwner } = require("../middleware.js");
const { storage } = require("../cloudConfig.js");


const slotController = require("../controllers/slots.js");
const Slot = require("../models/slot.js")

// Index and Create Route
router
    .route("/")
    .get(wrapAsync(slotController.index))
    .post(isLoggedIn, isAdmin, validateSlot,
        wrapAsync(slotController.createSlot));


//New Route
router.get("/new", isLoggedIn, slotController.renderNewForm );


// Show, Update and Delete Route
router
    .route("/:id")
    .get(wrapAsync(slotController.showSlot))
    .put(isLoggedIn, isAdmin, validateSlot, wrapAsync(slotController.updateSlot))
    .delete(isLoggedIn, isAdmin, wrapAsync(slotController.destroySlot));

// Student - Book Slot
router.post("/:id/book", isLoggedIn, slotController.bookSlot);

// Student - Cancel OWN Booking
router.post("/:id/cancel", isLoggedIn, isBookingOwner, slotController.cancelSlot);

// Edit Route
router.get("/:id/edit",isLoggedIn, isAdmin, wrapAsync(slotController.editSlot));


module.exports = router;