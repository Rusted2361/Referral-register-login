require('dotenv').config(); // Load environment variables from .env file
const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance with the connection details from the environment variables
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres', // Specify the dialect as PostgreSQL
  logging: false, // Disable logging for production
});
 
// Define the User model
const User = sequelize.define('User', {
    userWalletAddress: {
        type: DataTypes.STRING, // Adjust the data type as per your requirement
        allowNull: false,
        field: 'userWalletAddress' // Specify the column name explicitly
    },
    referralWalletAddress: {
        type: DataTypes.STRING, // Adjust the data type as per your requirement
        allowNull: false,
        field: 'referralWalletAddress' // Specify the column name explicitly
    },
}, {
  tableName: 'users', // Specify the correct table name here
});  

// Synchronize the model with the database to create the table if it doesn't exist
(async () => {
    try {
        await sequelize.sync();
        console.log('Users table created successfully.');
    } catch (error) {
        console.error('Error creating users table:', error);
    }
})();

// Export the Sequelize instance and the User model
module.exports = {
  sequelize,
  User,
};
