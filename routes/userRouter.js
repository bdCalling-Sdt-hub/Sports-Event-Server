const express = require('express');
const router = express.Router();

//import controllers
const { signUp, signIn, forgotPassword, verifyCode, cahngePassword, getUser, singleUser, updateUser, deleteUser } = require('../controllers/userController');
const upload = require('../middlewares.js/fileUpload');
const { isValidUser } = require('../middlewares.js/auth');
console.log('userController');

// routes
router.post('/sign-up', upload.single("image"), signUp);
router.post('/update/:id', upload.single("image"), isValidUser, updateUser);
router.delete('/delete/:id', isValidUser, deleteUser);
router.post('/sign-in', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/change-password', cahngePassword);
router.get('/', getUser);
router.get('/:id', singleUser);

module.exports = router;