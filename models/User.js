const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    userName: { type: String },
    firstName: String,
    lastName: String,
    shippingAddress: String
});

module.exports = mongoose.model('User', userSchema);
