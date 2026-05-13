const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Mood Schema
const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    mood: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Mood = mongoose.model('Mood', moodSchema);

// Save mood
router.post('/', auth, async (req, res) => {
    try {
        const { mood } = req.body;
        
        const newMood = new Mood({
            userId: req.userId,
            mood
        });

        await newMood.save();
        res.status(201).json({ message: 'Mood saved successfully', mood: newMood });
    } catch (error) {
        res.status(500).json({ message: 'Error saving mood', error: error.message });
    }
});

// Get user's mood history
router.get('/history', auth, async (req, res) => {
    try {
        const moods = await Mood.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.json(moods);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mood history', error: error.message });
    }
});

module.exports = router; 