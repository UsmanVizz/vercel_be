const mongoose = require('mongoose');

// Define User Schema
const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// userSchema.pre('save', function (next) {
//     console.log('Saving', this.id)
//     if (this.id === null || this.id === undefined) {
//         return next(new Error('Error'));
//     }
//     next();
// });
// Create a model based on the schema
const Amenities = mongoose.model('Amenities', userSchema);

module.exports = Amenities;