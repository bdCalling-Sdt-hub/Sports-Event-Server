const express = require('express');
const router = express.Router();
const upload = require('../middlewares.js/fileUpload');

//import controllers
const { createEvents, allEvents, updateEvent, deleteEvent, singleEvent } = require('../controllers/eventsController');
const { isValidUser } = require('../middlewares.js/auth');

// routes
router.post('/add', upload.single("image"), isValidUser, createEvents);
router.get('/all', isValidUser, allEvents);
router.get('/:id', isValidUser, singleEvent);
router.delete('/remove/:id', isValidUser, deleteEvent);
router.post('/update/:id', upload.single("image"), isValidUser, updateEvent);

module.exports = router;