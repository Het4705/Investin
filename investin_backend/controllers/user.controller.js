const Users = require('../models/users.model');
const verifyEmail = require('../services/email_verification');
const { hashPassword, comparePassword } = require("../services/hashing");
const jwt = require("jsonwebtoken");
require("dotenv").config()

// Using a Map to store temporary data for each email to avoid global state issues
let temporaryDataMap = new Map();

// Email verification function
const verifyUserEmail = async (req, res) => {
    const { token } = req.params;
    try {
        if (!token) {
            return res.status(400).json({ message: "Token not available" });
        }

        let verified_token;
        try {
            verified_token = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(400).json({ message: "Token not valid" });
        }

        const email = verified_token.data.email;

        if (!temporaryDataMap.has(email)) {
            return res.status(400).json({ message: "Data is not stored. Please try to login again." });
        }

        const temporaryData = temporaryDataMap.get(email);

        // Ensure the token contains expected data
        console.log(temporaryData);
        if (!verified_token || !temporaryData.password || !temporaryData.username || !email || !temporaryData.role) {
            return res.status(400).json({ message: "Invalid token data" });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await hashPassword(temporaryData.password);

        // Prepare the user data
        const user = new Users({
            username: temporaryData.username,
            email,
            password: hashedPassword,
            role: temporaryData.role
        });

        // Save the user to the database
        await user.save();

        // Remove temporary data once the user is registered
        temporaryDataMap.delete(email);

        // Redirect to login page at frontend

        return res.redirect("http://localhost:5173/login");
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// User registration function
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        console.log(req.body);
         
        if(!username || !email || !password || !role){
            return res.status(400).json({
                message:"provide email, username, password and role"
            })
        }


        // Check if the user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Store temporary data for this email
        temporaryDataMap.set(email, {
            username,
            email,
            password,
            role
        });

        // Send verification email
        console.log(email);
        const verificationMessage = await verifyEmail(email, { email });

        return res.status(201).json({
            message: verificationMessage
        });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const data = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(
            { data },
            process.env.JWT_SECRET_FOR_LOGIN,
            { expiresIn: '10h' }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { username: data.username, role: data.role,id:user._id }
        });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


module.exports = { register, verifyUserEmail, login };
