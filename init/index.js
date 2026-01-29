const mongoose = require("mongoose");
const initData = require("./data.js");
const Slot = require("../models/slot.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/bookmyslot";

main()
    .then(() => {
    console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
    await Slot.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, 
        createdBy : "6963a5a27a0491f364b209d2", 
    })),
    await Slot.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();