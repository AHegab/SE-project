const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();
const cors = require('cors');
const { body, validationResult } = require('express-validator'); 
router.use(express.json());
router.use(cookieParser());


router.use(cors());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
router.use(cors(corsOptions));

module.exports = function(client) {


    router.post("/contactUs", [
        body('inquiryType').isIn(['Stores', 'Models', 'Website', 'Other']).withMessage('Invalid inquiry type'),
        body('inquiry').isString().withMessage('Inquiry must be a string'),
        body('contactMethod').isIn(['Email', 'Phone', 'Mail', 'In Person']).withMessage('Invalid contact method'),
        body('firstName').isString().trim().withMessage('First name must be a string'),
        body('lastName').isString().trim().withMessage('Last name must be a string'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('phoneNumber').isLength({ min: 11, max: 11 }).withMessage('Phone number must be 11 digits'),
        body('phoneNumber').matches(/^[0-9]+$/).withMessage('Phone number must be numeric'),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const feedback = req.body;
        try {
            const db = client.db('Porsche');
            const result = await db.collection('Feedbacks').insertOne(feedback);
            res.status(201).json({ message: 'Feedback submitted successfully', feedbackId: result.insertedId });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    


    
    router.get("/contactUs", async (req, res) => {
        try {
            const feedback = await client.db('Porsche').collection('Feedbacks').find({}).toArray();
            res.json(feedback);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    


    return router;
};