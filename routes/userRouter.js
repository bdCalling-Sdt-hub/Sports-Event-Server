const express = require('express');
const router = express.Router();

//import controllers
const { signUp, signIn, forgotPassword, verifyCode, cahngePassword, getUser } = require('../controllers/userController');
const upload = require('../middlewares.js/fileUpload');
console.log('userController');

// routes
router.post('/sign-up', upload.single("image"), signUp);
router.post('/sign-in', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/change-password', cahngePassword);
router.get('/', getUser);

module.exports = router;