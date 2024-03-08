const { userRegister, userLogin, forgotPasswordService, verifyCodeService, changePasswordService, getUserService, getSingleUserService, updateUserService, deleteUserService, setPasswordService } = require("../services/userService");
const Response = require("../helpers/response");
const User = require("../models/User");
const bcrypt = require('bcryptjs');

const { createJSONWebToken } = require('../helpers/jsonWebToken');
const { deleteImage } = require("../helpers/deleteImage");

//sign up user
const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const image = req.file;
        console.log(image)

        // Validate request body
        if (!name) {
            return res.status(400).json(Response({ message: "Name is required" }));
        }

        if (!email) {
            return res.status(400).json(Response({ message: "Email is required" }));
        }

        if (!password) {
            return res.status(400).json(Response({ message: "Password is required" }));
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json(Response({ message: "User already exists" }));
        }

        let userDetails = {
            name,
            email,
            password,
            image
        }

        console.log(userDetails)

        // Call service function to register user
        await userRegister(userDetails);

        res.status(200).json(Response({ message: "A verification email is sent to your email" }));

    } catch (error) {
        console.error("Error in signUp controller:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        console.log("-----------",user)
        if (!user) {
            return res.status(404).json(Response({ message: "User not found" }));
        }
        
        const loggedInUser = req.body.userId;
        if(userId !== loggedInUser){
            return res.status(401).json(Response({message: "You are not authorzed", status: "Unautorized", statusCode: 401, type: "User"}));
        }

        let imagePath = user.image.path;

        const image = req.file;
        // delete image if req.file contain image
        if(!image){
            deleteImage(imagePath);
        }
        user.image.path;
        await user.save();
        const { name, email, password } = req.body;
        let userDetails = {
            name,
            email,
            password,
            image
        };
        //Send the updated user details to the service function
        let updatedUser = await updateUserService(userId, userDetails);

        res.status(200).json(Response({ message: "User updated successfully", data: updatedUser, status: "Okay", statusCode: 200, type: "User"}));
    } catch (error) {
        console.error("Error in updateUser controller:", error);
        res.status(500).json(Response({message: "Internal server Error"}));
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(Response({ message: "User not found" }));
        }

        const loggedInUser = req.body.userId;
        if(userId !== loggedInUser){
            return res.status(401).json(Response({message: "You are not authorzed", status: "Unautorized", statusCode: 401, type: "User"}));
        }

        // call delete image function
        deleteImage(user.image.path);
        //Call service function
        await deleteUserService(userId);

        res.status(200).json(Response({ message: "User deleted successfully", status: "Okay", statusCode: 200, type: "User",}));
    } catch (error) {
        console.error("Error in deleteUser controller:", error);
        res.status(500).json(Response({message: "Internal server Error"}));
    }
};

//Sign in user
const signIn = async (req, res, next) => {
    try {
        // Get email and password from req.body
        const { email, password } = req.body;
        console.log("--------Meow", email)

        // Find the user by email
        const user = await User.findOne({ email });
        console.log("-------------->>>>>", user)
        if(!user.isVerified){
            return res.status(401).json(Response({ statusCode: 401, message: 'You are not verified', status: "Unauthorized" }));
        }

        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        // Check if the user is banned
        if (user.isBlocked) {
            return res.status(401).json(Response({ statusCode: 401, message: 'You are blocked', status: "Failed" }));
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("---------------", isPasswordValid)

        if (!isPasswordValid) {
            res.status(401).json(Response({ statusCode: 401, message: 'Invalid password', status: "Failed" }));
        }

        // Call userLogin service function
        const accessToken = await userLogin({ email, password, user });

        //Success response
        res.status(200).json(Response({ statusCode: 200, message: 'Authentication successful', status: "OK", data: user, token: accessToken, type: "user" }));

    } catch (error) {
        console.log(error.message);
        next(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await forgotPasswordService(email, user);

        res.status(200).json(Response({ statusCode: 200, message: 'A verification code is sent to your email', status: "OK" }));

    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

//verify code
const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        console.log("code-ifh", code)
        const user = await User.findOne({ email });
        if (!email) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }
        if (!code) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }
        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }
        if(code !== user.oneTimeCode){
            return res.status(401).json(Response({ statusCode: 401, message: 'Invalid code', status: "Failed" }));
        }

        await verifyCodeService({ user, code })

        res.status(200).json(Response({ statusCode: 200, message: 'User verified successfully', status: "OK" }));

    } catch (error) {
        console.error(error);
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

const setPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!email) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Email is required', status: "Failed" }));
        }
        if (!password) {
            return res.status(404).json(Response({ statusCode: 404, message: 'Password is required', status: "Failed" }));
        }

        if (!user) {
            return res.status(404).json(Response({ statusCode: 404, message: 'User not found', status: "Failed" }));
        }

        await setPasswordService({ user, password });

        res.status(200).json(Response({ statusCode: 200, message: 'Password changed successfully', status: "OK" }));

    } catch (error) {
        res.status(500).json(Response({ statusCode: 500, message: 'Internal server error', status: "Failed" }));
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const loggedInUser = await User.findOne({ _id: req.body.userId });
       console.log("loggedInUser", loggedInUser)
        if (!loggedInUser) {
            return res.status(400).json(Response({ message: "Old password is required" }));
        }
        if (!oldPassword) {
            return res.status(400).json(Response({ message: "Old password is required" }));
        }
        if (!newPassword) {
            return res.status(400).json(Response({ message: "New password is required" }));
        }
        
        let isPasswordValid = await bcrypt.compare(oldPassword, loggedInUser.password);
        if (!isPasswordValid) {
            return res.status(400).json(Response({ message: "Password does not match" }));
        }
        loggedInUser.password = newPassword;
        await loggedInUser.save();
        res.status(200).json(Response({ message: "Password changed successfully" }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(Response({ message: "Internal server error" }))
    }
};

const getUser = async (req, res) => {
    try {
        let user = await getUserService();

        res.status(200).json(Response({ message: "User fetched successfully", type: "User", data: user, status: "OK", statusCode: 200 }))
    } catch (err) {
        console.error(err.message);
        res.status(500).json(Response({ message: "Internal server error" }))
    }
};

const singleUser = async (req, res) => {
    try {
        
        let user = await getSingleUserService(req.params.id);

        res.status(200).json(Response({ message: "User fetched successfully", type: "User", data: user, status: "OK", statusCode: 200 }))
    } catch (err) {
        console.error(err.message);
        res.status(500).json(Response({ message: "Internal server error" }))
    }
};

module.exports = {
    signUp,
    signIn,
    forgotPassword,
    verifyCode,
    setPassword,
    getUser,
    singleUser,
    updateUser,
    deleteUser,
    changePassword
};
