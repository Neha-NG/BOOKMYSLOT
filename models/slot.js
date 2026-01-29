const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slotSchema = new Schema ({
    date: {
        type: Date,
        required: true
    },
    startTime:{
        type: String,
        required: true
    },
    endTime:{
        type: String,
        required: true
    },
    isBooked:{
        type: Boolean,
        default: false
    },
    bookedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }, 
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true}
);

const Slot = mongoose.model("Slot", slotSchema);
module.exports = Slot;