const Slot = require("./models/slot.js");
const expressError = require("./utils/expressError.js");
const { slotSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path, "..", req.originalUrl);
      if(!req.isAuthenticated || !req.isAuthenticated()) {
        //redirectURL save original path
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged In as admin to create slot");
        return res.redirect("/login");
    }
    next();
};
  
module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "Admin access only");
    return res.redirect("/slots");
  }
  next();
};

module.exports.validateSlot = (req, res, next) => {
    let { error } = slotSchema.validate(req.body);
      if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
      } else {
        next();
      }
};

module.exports.isBookingOwner = async (req, res, next) => {
  const slot = await Slot.findById(req.params.id);

  if(!slot) {
    // return res.status(404).send("Slot not found");
    req.flash("error", "Slot not found");
    return res.redirect("/slots");
  }

  if(slot.bookedBy && slot.bookedBy.equals(req.user._id)) {
    return next();
  }

  req.flash("error", "You can cancel only your own booking");
  return res.redirect(`/slots/${req.params.id}`);

  // return res.status(403).send("You can cancel only your own booking");
}