const jwt = require('jsonwebtoken');

// Function to generate a JWT
const generateToken = (id, expiresIn = '1h') => {
    // Make sure JWT_SECRET is set in your environment variables
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    // Include additional claims or payload data if needed
    const payload = {
        id, // User ID or any other necessary data
        // Add other data if required, e.g., roles, permissions, etc.
    };

    // Generate the token with the specified expiration time
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn, // Token validity period, e.g., '1h', '7d'
    });
};

module.exports = generateToken;
