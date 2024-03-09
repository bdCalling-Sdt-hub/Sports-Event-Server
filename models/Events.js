const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    startedIn: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: Object, required: false },
    createdBy: { type: mongoose.Types.ObjectId, required: false }
}, { timeStamps: true });

module.exports = mongoose.model('Events', eventsSchema);