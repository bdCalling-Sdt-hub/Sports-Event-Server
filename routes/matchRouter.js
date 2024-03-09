const express = require('express');
const router = express.Router();

//import controllers
const { matchAdd, getAllMatch, singleMatch, deleteMatch, updateMatch, upcommingMatch } = require('../controllers/matchController');

const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');

// console.log('userController');

// routes
router.post('/add', upload.single("image"), isValidUser, matchAdd);
router.get('/all', isValidUser, getAllMatch);
router.get('/upcomming', isValidUser, upcommingMatch);
router.get('/get/:id', isValidUser, singleMatch);
router.delete('/delete/:id', isValidUser, deleteMatch);
router.post('/update/:id', isValidUser, updateMatch);

module.exports = router;