const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();
const cors = require('cors'); 
router.use(express.json());
router.use(cookieParser());


router.use(cors());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
router.use(cors(corsOptions));

module.exports = function(client) {


    router.post("/contactUs",async (req, res) => {

        try {
            const db = client.db('Porsche');
            const feedback = req.body;

            

            const result = await db.collection('Feedbacks').insertOne(feedback);

            res.status(201).json({ message: 'Feedback submitted successfully', feedbackId: result.insertedId });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });



    
    router.get("/contactUs",async (req, res) => {

        const feedback = await client.db('Porsche').collection('Feedbacks').find({}).toArray();
                res.json(feedback);

    });


    return router;
};