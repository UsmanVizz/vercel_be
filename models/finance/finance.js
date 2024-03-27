const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({

    orderId: { type: String, required: true },
    venderService: { type: String, required: false },
    eventDateAndTime: { type: String, required: false },





    // branch_name: { type: String, required: true },
    // branch_contact: { type: String, required: true },
    // email: {
    //     type: String, required: true, index: {
    //         unique: true
    //     },
    //     match: /[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    // },
    // branch_website: {
    //     type: String, required: true,
    //     match: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
    // },
    // branch_location: { type: String, required: true },
    // branch_geocordinate: { type: String, required: true },
    // no_of_building: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Finance = mongoose.model("Branch", financeSchema);

module.exports = Finance;
