const { deleteImage } = require("../helpers/deleteImage");
const Response = require("../helpers/response");
const Events = require("../models/Events");
const Match = require("../models/Match");
const User = require("../models/User");


// Create match
const matchAdd = async (req, res) => {
    try {
        const { name, gender, date, time, prone, fee, event } = req.body;
        const image = req.file;
        const findEvent = await Events.findOne({ name: event });
        if (!findEvent) {
            return res.status(400).json(Response({ message: "Event not found" }));
        }
        const newMatch = await Match.create({
            name,
            gender,
            date,
            time,
            prone,
            fee,
            event,
            image,
            createdBy: req.body.userId,
        });

        return res.status(200).json({ message: "Match added successfully", data: newMatch });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Upcomming match
const upcommingMatch = async (req, res) => {
    try {

        const user = await User.findById(req.body.userId);
        const matches = await Match.find({ date: { $gte: new Date() } })
            .sort({ date: 1 })
            .limit(5);

        res.status(200).json(Response(Response({ message: "Matches retrieved successfully", data: matches })));
    } catch (error) {
        console.log(error);
        res.status(500).json(Response({ message: "Internal server error" }));
    }
};

//Get all the match
const getAllMatch = async (req, res) => {
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

        const matches = await Match.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalMatches = await Match.countDocuments(filter);

        res.status(200).json({
            message: "Matches retrieved successfully",
            data: matches,
            pagination: {
                totalPages: Math.ceil(totalMatches / limit),
                currentPage: page,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < Math.ceil(totalMatches / limit) ? page + 1 : null,
                totalMatches: totalMatches,
            }
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json(Response({ message: "Internal server error" }));
    }
};

//Get single match
const singleMatch = async (req, res) => {
    try {
        const matchId = req.params.id;
        const match = await Match.findById(matchId);
        console.log(match)
        if (!match) {
            return res.status(404).json(Response({ message: "Match not found" }));
        }
        res.status(200).json(Response({ message: "Match retrieve sucessfully", data: match, statusCode: 200, status: 200, type: "Match" }));
    } catch (error) {
        res.status(500).json(Response({ message: "Internal server error" }));
    }
};

//Delete match
const deleteMatch = async (req, res) => {
    try {
        const matchId = req.params.id;
        const match = await Match.findById(matchId);
        console.log(match);
        if (!match) {
            return res.status(404).json(Response({ message: "Match not found" }));
        }
        const admin = req.body.userId;
        const checkAdmin = await User.findById(admin);

        if (!checkAdmin.isAdmin) {
            return res.status(401).json(Response({ message: "You are not authorized" }));
        }

        await match.deleteOne();
        res.status(200).json(Response({ message: "Match deleted successfully" }));
    } catch (error) {
        console.log(error.message);
        res.status(500).json(Response({ message: "Internal server error" }));
    }
};

//Update match
const updateMatch = async (req, res) => {
    try {
        const matchId = req.params.id;
        const { name, gender, date, time, prone, fee, event } = req.body;
        const match = await Match.findById(matchId);
        console.log(match)
        if (!match) {
            return res.status(404).json(Response({ message: "Match not found" }));
        }
        const admin = req.body.userId;
        const checkAdmin = await User.findById(admin);
        if (!checkAdmin.isAdmin) {
            return res.status(401).json(Response({ message: "You are not authorized" }));
        }

        if (name) {
            match.name = name;
        }
        if (gender) {
            match.gender = gender;
        }
        if (date) {
            match.date = date;
        }
        if (time) {
            match.time = time;
        }
        if (prone) {
            match.prone = prone;
        }
        if (fee) {
            match.fee = fee;
        }
        if (event) {
            match.event = event;
        }
        let imagePath = match.image.path;
        let image = req.file;
        if (req.file) {
            deleteImage(imagePath)
            match.image = image;
        }
        await match.save();

        res.status(200).json(Response({ message: "Match updated successfully" }));
    } catch (error) {
        console.log(error.message);
        res.status(500).json(Response({ message: "Internal server error" }));
    }
};

module.exports = { matchAdd, getAllMatch, singleMatch, deleteMatch, updateMatch, upcommingMatch };