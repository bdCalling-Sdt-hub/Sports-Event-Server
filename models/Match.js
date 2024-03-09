const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    prone: { type: String, required: true },
    fee: { type: String, required: true },
    image: { type: Object, required: false },
    event: { type: String, required: false },
    createdBy: { type: String, required: false }
}, { timeStamps: true });

module.exports = mongoose.model('Match', matchSchema);