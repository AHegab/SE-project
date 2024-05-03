const express = require("express");
const app = express();
const mongoose=require('mongoose');
const crypto = require('crypto');
const port = process.env.PORT || 3001;
require('dotenv').config();
const Product=require('./models/product.model');
const fs = require('fs');
const path = require("path");
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public/Main/',{root:__dirname}));
console.log(express.json());
// Path to your JSON file


function writeToFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}


const dbString='mongodb+srv://amhegab305:OXxZAZwYY3ybkbiR@porsche105.qy5cbvq.mongodb.net/?retryWrites=true&w=majority&appName=Porsche105';

const client = new MongoClient(dbString);
app.use(express.urlencoded({extended:false}));



mongoose.connect('mongodb+srv://amhegab305:OXxZAZwYY3ybkbiR@porsche105.qy5cbvq.mongodb.net/?retryWrites=true&w=majority&appName=Porsche105')
.then(()=>{
    console.log("Server is connected to the database successfully :)");
}).catch((error)=>{
    console.error(error);
});



app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});

app.get('/', (req, res) => {
    res.sendFile('public/Main/homePage.html',{root:__dirname});
    console.log("home page");
});

app.get('^/$|/homePage(.html)?', (req, res) => {
    res.sendFile('public/Main/homePage.html',{root:__dirname});
    console.log("home page");
});





//////////

app.get('/v1/api/admins', async (req, res) => {
    const admins = await client.db('Porsche').collection('Admins').find({}).toArray();
    res.json(admins);
});//working

app.get('/v1/api/admins/:id', async (req, res) => {
    const adminId = req.params.id;
    const admin = await client.db('Porsche').collection('Admins').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
    
    if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
    }
    
    res.json(admin);
});//working

// Route for creating a new admin
app.post('/v1/api/admins', async (req, res) => {
    const { username, password, department, email, phone } = req.body;
    
        const result = await client.db('Porsche').collection('Admins').insertOne({ username, password, department, email, phone });
            res.status(201).json({ message: 'Admin created successfully' });
        
    
});//working

// Route for updating an admin by ID
app.put('/v1/api/admins/:id', async (req, res) => {
    const { username, password, department, email, phone } = req.body;
    try {
        
        const result = await client.db('Porsche').collection('Admins').updateOne(
            { _id:new mongoose.Types.ObjectId(req.params.id) },
            { $set: { username, password, department, email, phone } }
        );
        res.json({ message: `${result.modifiedCount} admin(s) updated` });
    } catch (error) {
        console.error('Error updating admin', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});//working

// Route for deleting an admin by ID
app.delete('/v1/api/admins/:id', async (req, res) => {
    const result = await client.db('Porsche').collection('Admins').deleteOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
    res.json({ message: `${result.deletedCount} admin(s) deleted` });
});





app.get('/v1/api/customers', async (req, res) => {
    const customers = await client.db('Porsche').collection('Customers').find({}).toArray();
    res.json(customers);
});

app.get('/v1/api/customers/:id', async (req, res) => {
    const customerID = req.params.id;
    const customer = await client.db('Porsche').collection('Customers').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
    
    if (!customer) {
        return res.status(404).json({ error: "customer not found" });
    }
    
    res.json(customer);
});

// Route for creating a new admin
app.post('/v1/api/customers', async (req, res) => {
    const { username, password, addressName, dob, productIds } = req.body;
    
        const result = await client.db('Porsche').collection('Customers').insertOne({ username, password, addressName, dob, productIds });
            res.status(201).json({ message: 'Customer created successfully' });
        
    
});

// Route for updating an admin by ID
app.put('/v1/api/customers/:id', async (req, res) => {
    const { username, password, addressName, dob, productIds } = req.body;
    try {
        
        const result = await client.db('Porsche').collection('Customers').updateOne(
            { _id:new mongoose.Types.ObjectId(req.params.id) },
            { $set: { username, password, addressName, dob, productIds } }
        );
        res.json({ message: `${result.modifiedCount} customer(s) updated` });
    } catch (error) {
        console.error('Error updating customer', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for deleting an admin by ID
app.delete('/v1/api/customers/:id', async (req, res) => {
    const result = await client.db('Porsche').collection('Customers').deleteOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
    res.json({ message: `${result.deletedCount} customer(s) deleted` });
});



app.use((req,res,next)=>{
    console.log("middleware recieved the request");
    next();
});