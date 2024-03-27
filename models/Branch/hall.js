const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    hall_title: { type: String, required: true },
    hall_description: { type: String, required: true },
    people_capacity: { type: String, required: true },
    floor: { type: String, required: true },
    amenities: { type: mongoose.Schema.Types.ObjectId, ref: 'Amenities' },
    image: { type: String, required: [true, "Please Upload an Image"] },
    rent: { type: String, required: true },
    branchType: { type: mongoose.Schema.Types.ObjectId, ref: 'BranchType' },
    createdAt: {
        type: Date,
        default: Date.now
    }


});

const Hall = mongoose.model("Hall", hallSchema);

module.exports = Hall;
