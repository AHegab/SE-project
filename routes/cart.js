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

    router.post("/cart", async (req, res) => {
        try {
            const db = client.db('Porsche');
            const { productId, userId } = req.body;
    
            // Check if there's already a cart record for the user
            const existingCart = await db.collection('Carts').findOne({ userId });
    
            if (existingCart) {
                // If cart record exists, update the existing record
                const updatedCart = await db.collection('Carts').findOneAndUpdate(
                    { userId },
                    { $addToSet: { productIds: productId } }, // Add productId to the array
                    { returnOriginal: false }
                );
                res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart.value });
            } else {
                // If no cart record exists, create a new one
                const result = await db.collection('Carts').insertOne({ userId:userId, productIds: [productId] });
                res.status(201).json({ message: 'Cart created successfully', feedbackId: result.insertedId });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    router.put('/cart/:id', async (req, res) => {
        const cartId = req.params.id;
        const updatedCartData = req.body;
    
        try {

            
            // Your existing code for updating the cart item
        } catch (error) {
            console.error('Error updating cart item:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    

    router.get("/cart",async (req, res) => {

        const cart = await client.db('Porsche').collection('Carts').find({}).toArray();
                res.json(cart);

    });

    

    router.get('/cart/:id', async (req, res) => {
    
        const cart = await client.db('Porsche').collection('Carts').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
        
        if (!cart) {
            return res.status(404).json({ error: "cart not found" });
        }
        
        res.json(cart);
    });

    router.get('/cart/user/:userId', async (req, res) => {
        try {
            const { userId } = req.params;
            const cart = await client.db('Porsche').collection('Carts').findOne({ userId });
            
            if (!cart) {
                return res.status(404).json({ error: "Cart not found" });
            }
            
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    router.delete('/cart/:id', async (req, res) => {
        const result = await client.db('Porsche').collection('Carts').deleteOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
        res.json({ message: `${result.deletedCount} cart(s) deleted` });
    });

    return router;
};