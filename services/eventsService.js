const Events = require("../models/Events");

const createEventsService = async (eventDetails) => {
    try {
        // Assuming Events is a model and create method is used to create an event
        const event = await Events.create(eventDetails);
        return event; // Return the created event
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {createEventsService}