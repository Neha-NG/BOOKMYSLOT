const Slot = require("../models/slot");

module.exports.index = async (req, res) => {
   const allSlots = await Slot.find({});
   res.render("slots/index.ejs", { allSlots });
};

module.exports.renderNewForm = (req, res) => {
    res.render("slots/new.ejs");
};

module.exports.showSlot = async (req, res) => {
    let {id} = req.params;
    const slot = await Slot.findById(id).populate("createdBy").populate("bookedBy");
    if(!slot){
         req.flash("error", "Slot you requested for does not exist!");
         return res.redirect("/slots");
    }
    // console.log(slot);
    res.render("slots/show.ejs", {slot});
};

module.exports.bookSlot = async (req, res) => {
    const slot = await Slot.findById(req.params.id);

    if(slot.isBooked) {
        // return res.status(400).send("Slot already booked");
        req.flash("error", "Slot already booked");
        return res.redirect(`/slots/${slot._id}`);
    }

    slot.isBooked = true;
    slot.bookedBy = req.user._id;
    await slot.save();

    // res.send("Slot booked successfully");
    req.flash("success", "Slot booked successfully");
    return res.redirect(`/slots/${slot._id}`);
};

module.exports.cancelSlot  = async (req, res) => {
    const slot = await Slot.findById(req.params.id);

    slot.isBooked = false;
    slot.bookedBy = null;
    await slot.save();

    // res.send("Booking cancelled");
    req.flash("success", "Booking cancelled successfully");
    return res.redirect(`/slots/${slot._id}`)
};

module.exports.createSlot = async (req, res, next) => {

    const { date, startTime, endTime } = req.body.slot;
        console.log(req.user);

     const newSlot = new Slot({
      date: new Date(date),
      startTime,
      endTime,

      // handle backend-only fields here
      isBooked: false,
      bookedBy: null,
      createdBy: req.user._id   // Temp Admin ID from login/session
    });

    // if (!req.body || !req.body.slot) {
    //     throw new expressError(400, "Send Valid Data for Slot");
    // }

    // if (!req.body.slot) {
    //     return res.status(400).send("Slot data missing");
    // }

    // if (!date || !startTime || !endTime) {
    //     return res.status(400).send("All fields are required");
    // }
    
    await newSlot.save();
    req.flash("success", "New Slot Created!");
    res.redirect("/slots");
};


module.exports.editSlot = async (req, res) => {
    let { id } = req.params;
    const slot = await Slot.findById(id);
    if(!slot){
         req.flash("error", "Slot you requested for does not exist!");
         return res.redirect("/slots");
    }
    res.render("slots/edit.ejs", { slot });
};

module.exports.updateSlot = async (req, res) => {
    // if (!req.body || !req.body.slot) {
    //     throw new expressError(400, "Send Valid Data for Slot");
    // }

    // try {
    const { id } = req.params;

    await Slot.findByIdAndUpdate(
        id,
        req.body.slot, 
        { runValidators: true }
    );
    req.flash("success", "Slot Updated!");
    res.redirect(`/slots/${id}`); 
    // }catch (err) {
    //     console.error(err);
    //     res.status(500).send("Error Updating Slot");
    // }

};

module.exports.destroySlot = async (req, res) => {
    let { id } = req.params;
    let deletedSlot = await Slot.findByIdAndDelete( id );
    console.log(deletedSlot);
    req.flash("success", "Slot Deleted!");
    res.redirect("/slots");
};