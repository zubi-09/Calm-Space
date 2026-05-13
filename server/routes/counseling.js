const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Counseling Request Schema
const counselingRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    counselor: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'completed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CounselingRequest = mongoose.model('CounselingRequest', counselingRequestSchema);

// Submit counseling request
router.post('/request', auth, async (req, res) => {
    try {
        const { name, email, phone, counselor, message } = req.body;

        const newRequest = new CounselingRequest({
            userId: req.userId,
            name,
            email,
            phone,
            counselor,
            message
        });

        await newRequest.save();
        res.status(201).json({ 
            message: 'Counseling request submitted successfully',
            request: newRequest
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error submitting counseling request', 
            error: error.message 
        });
    }
});

// Get user's counseling requests
router.get('/my-requests', auth, async (req, res) => {
    try {
        const requests = await CounselingRequest.find({ userId: req.userId })
            .sort({ createdAt: -1 });
        
        res.json(requests);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching counseling requests', 
            error: error.message 
        });
    }
});

module.exports = router; 