const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    branch_name: { type: String, required: true },
    branch_email: {
        type: String, required: true, index: {
            unique: true
        },
        match: /[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    branch_description: { type: String, required: false },
    // branch_contact: { type: String, required: true },
    // branch_city: { type: String, required: false },
    // branch_area: { type: String, required: false },
    branch_address: { type: String, required: true },
    branch_geocordinate: { type: String, required: true },
    branch_type: { type: String, required: true, enum: ['hall', 'marquee', 'outdoor'] },
    parking_capacity: { type: String, required: true },
    image: { type: String },
    // outdoor: { type: Boolean, required: true },
    // no_of_hall: { type: Number, default: 0, required: false },
    // no_of_partition: { type: Number, default: 0, required: false },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

branchSchema.pre('save', function (next) {
    console.log('Saving', this.image)
    if (!this.image) {
        return next(new Error('Image is required for non-customer users'));
    }
    next();
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;