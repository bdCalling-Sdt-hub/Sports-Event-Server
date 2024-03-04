const express = require('express');
const router = express.Router();

//import controllers
const { createSubscription } = require('../controllers/subscriptionController');

// routes
router.post('/add', createSubscription);

module.exports = router;