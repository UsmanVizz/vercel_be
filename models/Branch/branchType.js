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

const BranchType = mongoose.model('BranchType', userSchema);

module.exports = BranchType;