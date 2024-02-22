require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const path = require("path");
const User = require("./config"); // Import the User model
const bcrypt = require('bcrypt');

const app = express();
// convert data into json format
app.use(express.json());

// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/get-referrer", (req, res) => {
    res.render("getreferrer");
});

app.get("/invite/:referralWalletAddress", (req, res) => {
    // Extract the referral wallet address from the URL parameters
    const referralWalletAddress = req.params.referralWalletAddress;
    // Render the referral.ejs template and pass referralWalletAddress as a variable
    res.render("referral", { referralWalletAddress });
});

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        referralWalletAddress: req.body.referralWalletAddress // Include referralWalletAddress if provided
    }

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await User.insertMany(data);
        console.log(userdata);
        res.render("home");
    }
});


// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});

// Route to check if a user with the provided name exists and has a referral wallet address
app.post("/get-referrer", async (req, res) => {
    try {
        // Extract name from request body
        const userName = req.body.name;

        // Query the database to find a user with the provided name
        const user = await User.findOne({ name: userName });

        // Check if a user is found and they have a referral wallet address
        if (user && user.referralWalletAddress) {
            // If yes, send a response indicating success along with the referral wallet address
            res.json({ success: true, referralWalletAddress: user.referralWalletAddress });
        } else {
            // If no user is found or the user does not have a referral wallet address, send a response indicating failure
            res.json({ success: false, message: "No referrer found for the provided name." });
        }
    } catch (error) {
        // If an error occurs, send a response with the error message
        res.status(500).json({ success: false, message: error.message });
    }
});


// Define Port for Application
const port = process.env.PORT || 5000; // Use PORT environment variable if set, otherwise use 5000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
