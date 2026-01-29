const mongoose = require("mongoose");

const sampleSlots = [
    {
        date: new Date("2025-12-26"),
        startTime: "09:00",
        endTime: "10:00",
        isBooked: false,
        bookedBy: null,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        date: new Date("2025-12-26"),
        startTime: "10:00",
        endTime: "11:00",
        isBooked: true,
        bookedBy: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        date: new Date("2025-12-26"),
        startTime: "11:00",
        endTime: "12:00",
        isBooked: false,
        bookedBy: null,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        date: new Date("2025-12-27"),
        startTime: "09:00",
        endTime: "11:00",
        isBooked: false,
        bookedBy: null,
        createdBy: new mongoose.Types.ObjectId()
    },
    {
        date: new Date("2025-12-27"),
        startTime: "14:00",
        endTime: "15:00",
        isBooked: true,
        bookedBy: new mongoose.Types.ObjectId(),
        createdBy: new mongoose.Types.ObjectId()
    }
];

module.exports = { data: sampleSlots };