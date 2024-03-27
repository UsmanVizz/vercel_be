const mongoose = require("mongoose");

const outDoorSchema = new mongoose.Schema({
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    name: { type: String, required: true },
    people_capacity: { type: String, required: true },
    image: { type: String, required: [true, "Please Upload an Image"] },
    rent: { type: String, required: true },


});

const Outdoor = mongoose.model("Outdoor", outDoorSchema);

module.exports = Outdoor;
