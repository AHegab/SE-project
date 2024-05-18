const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();
const mongoose = require('mongoose');
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


    const { ObjectId } = require('mongodb');

    const { body, validationResult } = require('express-validator');

router.post("/cart", [
    body('userId').isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
    body('productId').isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const db = client.db('Porsche');
        const { productId, userId } = req.body;

        // Check if there's already a cart record for the user
        const existingCart = await db.collection('Carts').findOne({ userId: new ObjectId(userId) });

        if (existingCart) {
            // If cart record exists, update the existing record
            const updatedCart = await db.collection('Carts').findOneAndUpdate(
                { userId: new ObjectId(userId) },
                { $addToSet: { productIds: new ObjectId(productId) } }, // Ensure product ID is added as an ObjectId
                { returnOriginal: false }
            );
            res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart.value });
        } else {
            // If no cart record exists, create a new one
            const result = await db.collection('Carts').insertOne({
                userId: new ObjectId(userId), 
                productIds: [new ObjectId(productId)]
            });
            res.status(201).json({ message: 'Cart created successfully', cartId: result.insertedId });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/cart/:id', [
    body('productIds').isArray().withMessage('Product IDs must be an array')
        .custom((productIds) => productIds.every(id => ObjectId.isValid(id)))
        .withMessage('All product IDs must be valid MongoDB ObjectIds')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const cartId = req.params.id;
    const { productIds } = req.body;  // Assuming you want to update the whole array of productIds

    try {
        const updatedCartData = {
            productIds: productIds.map(id => new ObjectId(id))
        };

        const result = await client.db('Porsche').collection('Carts').updateOne(
            { "_id": new ObjectId(cartId) },
            { $set: updatedCartData }
        );

        if (result.matchedCount === 1) {
            res.status(200).json({ message: 'Cart updated successfully' });
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

    

router.get("/cart", async (req, res) => {
    try {
        const carts = await client.db('Porsche').collection('Carts').find({}).toArray();
        res.json(carts);
    } catch (error) {
        console.error('Error retrieving carts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


    

router.get('/cart/:id', async (req, res) => {
    try {
        const cartId = new ObjectId(req.params.id);  // Use MongoDB's ObjectId directly
        const cart = await client.db('Porsche').collection('Carts').findOne({ _id: cartId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/cart/user/:userId', async (req, res) => {
    try {
        const userId = new ObjectId(req.params.userId);  // Convert userId to ObjectId
        const cart = await client.db('Porsche').collection('Carts').findOne({ userId: userId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/cart/:id', async (req, res) => {
    try {
        const cartId = new ObjectId(req.params.id);  // Validate and convert id
        const result = await client.db('Porsche').collection('Carts').deleteOne({ _id: cartId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Cart not found or already deleted" });
        }
        
        res.json({ message: `${result.deletedCount} cart(s) deleted` });
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


    return router;
};