const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to register a new user
router.post('/register', registerUser); // Ensure registerUser is defined in userController

// Route to login a user
router.post('/login', loginUser); // Ensure loginUser is defined in userController

// Route to get user profile (protected)
router.get('/profile', protect, getUserProfile); // Ensure protect and getUserProfile are defined

// Route to update user profile (protected)
router.put('/profile', protect, updateUserProfile); // Ensure updateUserProfile is defined

module.exports = router;
