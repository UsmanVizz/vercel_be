const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    name: { type: String, required: true },
    people_capacity: { type: String, required: true },
    image: { type: String, required: [true, "Please Upload an Image"] },
    rent: { type: String, required: true },

});

const Hall = mongoose.model("Hall", hallSchema);

module.exports = Hall;
