const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
router.use(express.json());

module.exports = function(client) {

    // Get all users
    router.get('/users', async (req, res) => {
        const users = await client.db('Porsche').collection('Users').find({}).toArray();
        res.json(users);
    });

    // Get user profile
    router.get('/users/profile', async (req, res) => {
        const userId = req.cookies.info ? req.cookies.info._id : null;
        try {
            if (!userId) {
                return res.status(400).json({ error: "User ID not found in cookies" });
            }
    
            const user = await client.db('Porsche').collection('Users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
    
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    
            res.render('profile', { userInfo: req.cookies.info });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // Get user by ID
    router.get('/users/:id', async (req, res) => {
        const userId = req.cookies.info._id;
        const reqUserID = req.params.id;
        if(reqUserID != userId){
            return res.status(403).json({ error: "User does not have access" });
        }
        const customer = await client.db('Porsche').collection('Users').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
        if (!customer) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(customer);
    });

    // Create a new user
    router.post('/users', [
        body('username').isString().notEmpty(),
        body('password').isString().notEmpty(),
        body('address').isString().notEmpty(),
        body('city').isString().notEmpty(),
        body('region').isString().notEmpty(),
        body('role').isString().notEmpty(),
        body('zip').isString().notEmpty(),
        body('dob').isDate(),
        body('email').isEmail()
    ], async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const { username, password, address, city, region, role, zip, dob, email } = req.body;
    
            const db = client.db('Porsche');
            const collection = db.collection('Users');
    
            const existingUser = await collection.findOne({ username });
            if (existingUser) {
                return res.status(400).send("Username already exists");
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            await collection.insertOne({
                username,
                password: hashedPassword,
                address,
                city,
                region,
                role,
                zip,
                dob: new Date(dob), // Assuming dob is a string in the format 'YYYY-MM-DD'
                email
            });
    
            res.status(201).render('login');
            console.log(`Message from the server: ${username} registered successfully`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

    // Update user role by ID
    router.put('/update-role/:userId', [
        body('role').isString().notEmpty()
    ], async (req, res) => { 
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            const userId = req.params.userId;
            const { role } = req.body;
        
            const userIdObject = new ObjectId(userId);
    
            const result = await client.db('Porsche').collection('Users').updateOne(
                { _id: userIdObject },
                { $set: { role: role } }
            );
        
            if (result.modifiedCount === 1) {
                res.status(200).json({ message: 'User role updated successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Delete user by ID
    router.delete('/users/:id', async (req, res) => {
        const result = await client.db('Porsche').collection('Users').deleteOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
        res.json({ message: `${result.deletedCount} customer(s) deleted` });
    });

    return router;
};
