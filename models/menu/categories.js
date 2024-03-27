const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    category_name: { type: String, required: true },
    category_description: { type: String, required: false },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CategoryItem = mongoose.model("CategoryItem", categoriesSchema);

module.exports = CategoryItem;
