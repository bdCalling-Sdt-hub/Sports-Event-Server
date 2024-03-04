const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const subscriptionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
}, {timeStamps: true});

module.exports = mongoose.model('Subscription', subscriptionSchema);