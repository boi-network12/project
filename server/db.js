const mongoose = require("mongoose");

module.exports = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("connected to db successfully!");
    } catch (error) {
        console.error("Error could not connect to db: ", error);
    }
}