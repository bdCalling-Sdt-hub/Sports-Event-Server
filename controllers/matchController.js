const Match = require("../models/Match");

const matchAdd = async (req, res) => {
    try {
        const { name, gender, date, time, prone, fee, event } = req.body;
        const image = req.file;

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

        return res.status(200).json({message: "Match added successfully", data: newMatch});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
};

module.exports = { matchAdd };