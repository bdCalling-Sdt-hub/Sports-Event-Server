const express = require('express');
const router = express.Router();
const upload = require('../middlewares.js/fileUpload');

//import controllers
const { createEvents } = require('../controllers/eventsController');
const { isValidUser } = require('../middlewares.js/auth');

// routes
router.post('/add', upload.single("image"), isValidUser, createEvents);

module.exports = router;