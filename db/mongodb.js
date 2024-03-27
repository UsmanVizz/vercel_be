const mongoose = require("mongoose");
require('dotenv').config();


mongoose.connect(process.env.MONGO, {

});

module.exports = mongoose.connection;