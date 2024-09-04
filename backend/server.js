const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allows cookies and other credentials to be sent
}));
app.use(express.json());
app.use(helmet({
    crossOriginResourcePolicy: false, // Disable CORP to avoid blocking resources
}));

// Serve static files from the 'frontend/dist' directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Serve static files for images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Football Jersey Store API');
});

// Use routes
const jerseyRoutes = require('./routes/jerseyRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/jerseys', jerseyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Serve frontend on all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Successfully connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

startServer();
