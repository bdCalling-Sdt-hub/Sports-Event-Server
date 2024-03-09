const { deleteImage } = require("../helpers/deleteImage");
const pagination = require("../helpers/pagination");
const Response = require("../helpers/response");
const Events = require("../models/Events");
const User = require("../models/User");
const { createEventsService } = require("../services/eventsService");

//Create event
const createEvents = async (req, res) => {
    try {
        //Checking permission
        const adminId = req.body.userId;
        const admin = await User.findById(adminId);
        if (!admin.isAdmin) {
            return res.status(401).json(Response({ message: "You are not authorzed", status: "Unautorized", statusCode: 401, type: "Evetns" }));
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
            createdBy: adminId,
            image,
        }

        // Await the result of createEventsService
        let event = await createEventsService(eventDetails);
        console.log(event);

        // Send the response back to the user with the created event
        res.status(201).json({ message: "Event added successfully", data: event });

    } catch (error) {
        console.log(error.message);
        res.status(500).json(Response({ message: "Internal server error" }));
    }
};

//All evets
const allEvents = async (req, res) => {
    try {
        const search = req.query.search || ''; // Ensure search is not undefined
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // If search is empty, match everything
        const searchRegex = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            $or: [
                { name: { $regex: searchRegex } },
                { location: { $regex: searchRegex } },
                { date: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
            ],
        };

        const events = await Events.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        if (events.length === 0) {
            return res.status(404).json(Response({ message: "Events not found" }));
        }

        const totalEvents = await Events.countDocuments(filter);

        res.status(200).json({
            message: "Events retrieved successfully",
            data: events,
            pagination: {
                totalPages: Math.ceil(totalEvents / limit),
                currentPage: page,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < Math.ceil(totalEvents / limit) ? page + 1 : null,
                totalEvents: totalEvents,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//UPCOMMING EVENTS
const upcommingEvents = async (req, res) => {
    try {
        const events = await Events.find({ date: { $gte: new Date() } })
            .sort({ date: 1 })
            .limit(5);

        if (events.length === 0) {
            return res.status(404).json(Response(Response({ message: "Events not found" })));
        }

        res.status(200).json(Response({
            message: "Events retrieved successfully",
            data: events,
        }));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response({ message: "Internal server error" }));
    }
};

//Delete event
const deleteEvent = async (req, res) => {
    try {
        const adminId = req.body.userId;
        const admin = await User.findById(adminId);

        if (!admin.isAdmin) {
            return res.status(401).json({
                message: "You are not authorized",
                status: "Unauthorized",
                statusCode: 401,
                type: "Events"
            });
        }

        const eventId = req.params.id;
        const event = await Events.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json(Response({
                message: "Event not found"
            }));
        }

        res.status(200).json({
            message: "Event deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

//Update events
const updateEvent = async (req, res) => {
    try {
        const adminId = req.body.userId;
        const admin = await User.findById(adminId);
        if (!admin.isAdmin) {
            return res.status(401).json({
                status: "error",
                message: "You are not authorized",
                statusCode: 401,
                type: "Events"
            });
        }

        const eventId = req.params.id;
        const event = await Events.findById(eventId);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Event not found"
            });
        }

        // Update event fields conditionally
        if (req.body.name) {
            event.name = req.body.name;
        }
        if (req.body.description) {
            event.description = req.body.description;
        }
        if (req.body.date) {
            event.date = req.body.date;
        }
        if (req.body.startedIn) {
            event.startedIn = req.body.startedIn;
        }
        if (req.body.location) {
            event.location = req.body.location;
        }
        const imagePath = event.image.path;

        if (req.file) {
            deleteImage(imagePath);
            event.image = req.file;
        }

        await event.save();
        res.status(200).json({
            status: "success",
            message: "Event updated successfully",
            data: event
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(Response({
            status: "error",
            message: "Internal server error"
        }));
    }
};

//Get single events
const singleEvent = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);

        const eventId = req.params.id;
        const event = await Events.findById(eventId);

        if (!event) {
            return res.status(404).json(Response({
                status: "error",
                message: "Event not found"
            }));
        }

        res.status(200).json(Response({
            status: "success",
            data: event
        }));

    } catch (error) {
        console.log(error);
        res.status(500).json(Response({
            status: "error",
            message: "Internal server error"
        }));
    }
};

module.exports = {
    createEvents,
    allEvents,
    deleteEvent,
    updateEvent,
    singleEvent,
    upcommingEvents
};