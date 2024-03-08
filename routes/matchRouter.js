const express = require('express');
const router = express.Router();

//import controllers
const { matchAdd } = require('../controllers/matchController');

const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');

// console.log('userController');

// routes
router.post('/add', upload.single("image"), isValidUser, matchAdd);

module.exports = router;