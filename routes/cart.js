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


    router.post("/cart",async (req, res) => {

        try {
            const db = client.db('Porsche');
            const cart = req.body;

            

            const result = await db.collection('Carts').insertOne(cart);

            res.status(201).json({ message: 'item added to cart successfully', feedbackId: result.insertedId });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};