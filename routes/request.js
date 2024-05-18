const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

router.use(express.json());
router.use(cookieParser());

module.exports = function(client) {

    // Route to handle admin request submission
    router.post('/request-admin', [
        body('username').isString().notEmpty().withMessage('Username must be a non-empty string'),
        body('userId').isMongoId().withMessage('UserId must be a valid MongoDB ObjectId')
    ], async (req, res) => {
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, userId } = req.body;
            const newRequest = {
                username: username,
                userId: new mongoose.Types.ObjectId(userId),
                createdAt: new Date()
            };
            await client.db('Porsche').collection('Requests').insertOne(newRequest);
            res.status(201).json({ message: 'Request submitted successfully' });
        } catch (error) {
            console.error('Error creating request:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Route to fetch all requests
    router.get('/req', async (req, res) => {
        try {
            const requests = await client.db('Porsche').collection('Requests').find({}).toArray();
            res.json(requests);
        } catch (error) {
            console.error('Error fetching requests:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
};
