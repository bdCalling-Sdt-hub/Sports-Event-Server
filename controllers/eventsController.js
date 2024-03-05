const Response = require("../helpers/response");
const User = require("../models/User");
const { createEventsService } = require("../services/eventsService");

const createEvents = async (req, res) => {
    try {
        //Checking permission
        const adminId = req.body.userId;
        const admin = await User.findById(adminId);
        if (!admin.isAdmin) {
            return res.status(401).json(Response({message: "You are not authorzed", status: "Unautorized", statusCode: 401, type: "Evetns"}));
        };

        const { name, description, date, startedIn, location } = req.body;
        const image = req.file;
        console.log(image);

        if (!name || !description || !date || !startedIn || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let eventDetails = {
            name,
            description,
            date,
            startedIn,
            location,
            image,
        }

        // Await the result of createEventsService
        let event = await createEventsService(eventDetails);
        console.log(event);

        // Send the response back to the user with the created event
        res.status(201).json({ message: "Event added successfully", data: event });

    } catch (error) {
        console.log(error.message);
        res.status(500).json(Response({message: "Internal server error"}));
    }
};

module.exports = {
    createEvents
};