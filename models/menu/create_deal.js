const mongoose = require("mongoose");

const dealItemSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    deal_name: { type: String, required: true },
    description: { type: String, required: true },
    add_item: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CategoryItem' }],
    price: { type: String, required: true },
    discounted_price: { type: String, required: false },
    featured_image: [{
        image: { type: String, required: [true, "Please Upload an Image"] },
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const MenuDeal = mongoose.model("MenuDeal", dealItemSchema);

module.exports = MenuDeal;
