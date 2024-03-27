const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    order_id: { type: String, required: true },
    invoice_id: { type: String, required: true },
    reservedAt: { type: Date, required: true },
    order_venue: {
        location: { type: String, required: true },
        hall_number: { type: String, required: true },
    },
    payment_status: { type: String, required: true, enum: ["paid", "unpaid", "partial_paid"] },
    payment_type: { type: String, required: true, enum: ["online", "manual"] },
    payable_amount: { type: String, required: true },
    remaining_amount: { type: String, required: true },
    total_amount: { type: String, required: true },
    order_status: { type: String, required: true },
    food_items: [{
        food_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
    }],
    vender_services: [{
        service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vander' },
    }],
    amenities: {
        ac_heater: { type: Boolean, default: false },
        waiter_required: { type: Boolean, default: false },
        buffet_table: { type: Boolean, default: false },
        carpets: { type: Boolean, default: false },
        special_furniture: {
            sofa: {
                selected: { type: Boolean, default: false },
                quantity: { type: Number, default: 0 },
            },
            table: {
                selected: { type: Boolean, default: false },
                quantity: { type: Number, default: 0 },
            },
            chair: {
                selected: { type: Boolean, default: false },
                quantity: { type: Number, default: 0 },
            },
        },
        picture_booth: { type: Boolean, default: false },
    },
    booking_status: { type: String, enum: ["place_order", "request_to_reserve", "save_to_cart"] },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

