const asyncHandler = require('express-async-handler');
const Jersey = require('../models/Jersey');
const mongoose = require('mongoose');

// @desc    Create a new jersey
// @route   POST /api/jerseys
// @access  Private/Admin
const createJersey = asyncHandler(async (req, res) => {
    const { name, price, size, description, imageUrl } = req.body;

    try {
        const jersey = new Jersey({
            name,
            price,
            size,
            description,
            imageUrl
        });

        const createdJersey = await jersey.save();
        res.status(201).json(createdJersey);
    } catch (error) {
        console.error('Error creating jersey:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all jerseys
// @route   GET /api/jerseys
// @access  Public
const getJerseys = asyncHandler(async (req, res) => {
    try {
        const jerseys = await Jersey.find({});
        res.json(jerseys);
    } catch (error) {
        console.error('Error fetching jerseys:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get a jersey by ID
// @route   GET /api/jerseys/:id
// @access  Public
const getJerseyById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Jersey ID' });
    }

    try {
        const jersey = await Jersey.findById(id);
        if (jersey) {
            res.json(jersey);
        } else {
            res.status(404).json({ message: 'Jersey not found' });
        }
    } catch (error) {
        console.error('Error fetching jersey:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a jersey
// @route   PUT /api/jerseys/:id
// @access  Private/Admin
const updateJersey = asyncHandler(async (req, res) => {
    const { name, price, size, description, imageUrl } = req.body;
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Jersey ID' });
    }

    try {
        const jersey = await Jersey.findById(id);

        if (jersey) {
            jersey.name = name || jersey.name;
            jersey.price = price || jersey.price;
            jersey.size = size || jersey.size;
            jersey.description = description || jersey.description;
            jersey.imageUrl = imageUrl || jersey.imageUrl;

            const updatedJersey = await jersey.save();
            res.json(updatedJersey);
        } else {
            res.status(404).json({ message: 'Jersey not found' });
        }
    } catch (error) {
        console.error('Error updating jersey:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a jersey
// @route   DELETE /api/jerseys/:id
// @access  Private/Admin
const deleteJersey = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Jersey ID' });
    }

    try {
        const jersey = await Jersey.findById(id);

        if (jersey) {
            await jersey.remove();
            res.json({ message: 'Jersey removed' });
        } else {
            res.status(404).json({ message: 'Jersey not found' });
        }
    } catch (error) {
        console.error('Error deleting jersey:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = {
    createJersey,
    getJerseys,
    getJerseyById,
    updateJersey,
    deleteJersey
};
