
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
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


const UserId = mongoose.model('UserId', userSchema);

module.exports = UserId;
