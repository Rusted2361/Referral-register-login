require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');

// Connect to the database using the DB_URI environment variable
const connect = mongoose.connect(process.env.DB_URI);

// Check if the database is connected successfully
connect.then(() => {
    console.log("Database Connected Successfully");
}).catch(() => {
    console.log("Database cannot be Connected");
});
// Define the user schema
const userSchema = new mongoose.Schema({
    userWalletAddress: {
        type: String,
        required: true,
        unique: true
    },
    referralWalletAddress: {
        type: String
    }
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
