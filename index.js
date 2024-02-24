// Load environment variables
require('dotenv').config();

// Import required modules
const express = require("express");
const path = require("path");
const User = require("./models/config"); // Import the User model
const bcrypt = require('bcrypt');

// Create an Express application
const app = express();

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Define routes

app.get("/", (req, res) => {
    // Render the home.ejs template and pass the user and referral wallet addresses as variables
    res.render("home");
});

app.get("/generate-referral-link", (req, res) => {
    res.render("generate-link");
});

app.get("/invite/:referralWalletAddress", (req, res) => {
    const referralWalletAddress = req.params.referralWalletAddress;
    res.render("referral", { referralWalletAddress });
});

app.get("/signup", (req, res) => {
    const referralWalletAddress = req.params.referralWalletAddress;
    res.render("referral", { referralWalletAddress });
});

app.get("/get-referrer", (req, res) => {
    res.render("getreferrer");
});

// Register User
app.post("/signup", async (req, res) => {
    const userData = {
        userWalletAddress: req.body.userWalletAddress,
        referralWalletAddress: req.body.referralWalletAddress
    }

    try {
        // Check if the user already exists in the database based on userWalletAddress
        const existingUser = await User.findOne({ userWalletAddress: userData.userWalletAddress });

        if (existingUser) {
            return res.send('User already exists. Please choose a different user wallet address.');
        } else {
            // Create a new user document with the provided data
            const newUser = new User(userData);

            // Save the new user to the database
            await newUser.save();

            console.log('User registered successfully:', newUser);
            res.render("getreferrer");
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user. Please try again later.');
    }
});


// Route to check if a user with the provided name exists and has a referral wallet address
app.post("/get-referrer", async (req, res) => {
    try {
        // Extract user wallet address from request body
        const userWalletAddress = req.body.userWalletAddress;
        console.log('User wallet address:', userWalletAddress);

        // Query the database to find a user with the provided user wallet address
        const user = await User.findOne({ userWalletAddress });
        console.log('User:', user);

        // Check if a user is found and they have a referral wallet address
        if (user && user.referralWalletAddress) {
            // If yes, send a response indicating success along with the referral wallet address
            res.json({ success: true, referralWalletAddress: user.referralWalletAddress });
        } else {
            // If no user is found or the user does not have a referral wallet address, send a response indicating failure
            res.json({ success: false, message: "No referrer found for the provided user wallet address." });
        }
    } catch (error) {
        // If an error occurs, send a response with the error message
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post("/generate-referral-link", (req, res) => {
    const walletAddress = req.body.walletAddress;

    // Assuming you have a function to generate the referral link, you can replace the next line with your logic
    const referralLink = `cosmosino/invite/${walletAddress}`;

    // Render a template with the generated referral link
    res.render("generated-link", { referralLink });
});


// Define Port for Application
const port = process.env.PORT || 5000; // Use PORT environment variable if set, otherwise use 5000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
