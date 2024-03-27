
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    food_name: { type: String, required: true },
    food_description: { type: String, required: true },
    food_per_head: { type: String, required: true },
    food_per_head: { type: String, required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryItem' },
    image: { type: String, required: [true, "Please Upload an Image"] },

    createdAt: {
        type: Date,
        default: Date.now
    }
});
const FoodItem = mongoose.model("FoodItem", foodSchema);

module.exports = FoodItem;