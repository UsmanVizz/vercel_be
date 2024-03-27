const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        index: {
            unique: true,
            sparse: true,
            trim: true,
            lowercase: true,
        },
        match: /[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    contact_number: { type: String, unique: true, sparse: true, trim: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    cnic: { type: String, required: true },
    user_type: { type: String, required: true },
    business_name: { type: String, required: function () { return this.user_type !== 'customer'; } },
    business_pri_num: { type: String, required: function () { return this.user_type !== 'customer'; } },
    business_sec_num: { type: String, required: function () { return this.user_type !== 'customer'; } },
    business_email: {
        type: String,
        match: /[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        required: function () { return this.user_type !== 'customer'; }
    },
    business_web: { type: String, required: function () { return this.user_type !== 'customer'; } },
    business_location: { type: String, required: function () { return this.user_type !== 'customer'; } },
    business_geocode: { type: String, required: function () { return this.user_type !== 'customer'; } },
    image: { type: String, },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

userSchema.pre('save', function (next) {
    console.log('Saving', this.image)
    if (this.user_type !== 'customer' && !this.image) {
        return next(new Error('Image is required for non-customer users'));
    }
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
