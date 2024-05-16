const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
router.use(express.json());


module.exports = function(client) {

    router.get('/users', async (req, res) => {
        const users = await client.db('Porsche').collection('Users').find({}).toArray();
        res.json(users);
    });//working 
    
    router.get('/users/profile', async (req, res) => {
        const userId = req.cookies.info ? req.cookies.info._id : null;
        //console.log(userId);
        try {
            if (!userId) {
                return res.status(400).json({ error: "User ID not found in cookies" });
            }
    
            const user = await client.db('Porsche').collection('Users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
            //console.log(user);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
    
            //res.json(user);
            res.render('profile', { userInfo: req.cookies.info });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });//working
    
    router.get('/users/:id', async (req, res) => {

        const userId = req.cookies.info._id;
        
        const reqUserID = req.params.id;

        if(reqUserID!=userId){
            return res.status(403).json({ error: "user does not have access" });
        }
        const customer = await client.db('Porsche').collection('Users').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
        
        if (!customer) {
            return res.status(404).json({ error: "user is not found" });
        }
        
        res.json(customer);
    });//workin
    
    // Route for creating a new admin
    router.post('/users', async (req, res) => {
        
        try {
            // Extract data from the request body
            const { username, password, address, city, region,role, zip, dob } = req.body;
    
            const db = client.db('Porsche');
            const collection = db.collection('Users');
    
            // Check if the username already exists
            const existingUser = await collection.findOne({ username });
            if (existingUser) {
                return res.status(400).send("Username already exists");
            }
    
            // Hash the password before saving it
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Insert the new user data into the database
            await collection.insertOne({
                username,
                password: hashedPassword,
                address,
                city,
                region,
                role,
                zip,
                dob
            });
    
            // Registration successful
            res.status(201).render('login');
            console.log(`Message from the server: ${username} registered successfully`);
        } catch (error) {
            // Handle error
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
            
        
    });
    
    // Route for updating an admin by ID
    router.put('/users/:id', async (req, res) => {
        const { username, password, address, city, region,role, zip, dob } = req.body;
        try {
            const userID =req.params.id;
            const existingUser = await client.db('Porsche').collection('Users').findOne({ username });

            if (existingUser._id!=userID) {
                return res.status(400).send("Username already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
    
            const result = await client.db('Porsche').collection('Users').updateOne(
                { _id:new mongoose.Types.ObjectId(req.params.id) },
                { $set: { username,
                            password: hashedPassword,
                            address,
                            city,
                            region,
                            role,
                            zip,
                            dob } }
            );
            res.json({ message: `${result.modifiedCount} user(s) updated` });
        } catch (error) {
            console.error('Error updating customer', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    //perfect
    
    router.delete('/users/:id', async (req, res) => {
        const result = await client.db('Porsche').collection('Users').deleteOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
        res.json({ message: `${result.deletedCount} customer(s) deleted` });
    });

    return router;
};
//perfect