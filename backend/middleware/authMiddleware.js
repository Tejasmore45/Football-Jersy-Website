const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error);

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Not authorized, token expired' });
            }

            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware for admin access
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = {
    protect,
    admin
};
