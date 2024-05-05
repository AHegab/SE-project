const express = require("express");
const app = express();
const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3001;
require('dotenv').config();

const fs = require('fs');
const path = require("path");
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

// Middleware to parse JSON bodies

// app.use((req,res,next)=>{

//     console.log(`${req.method} ${req.path}`);
// });
app.use(express.static('views/', { root: __dirname }));


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.set('view engine' , 'ejs')

app.use(express.static('public/Main/',{root:__dirname}));

const dbString='mongodb+srv://amhegab305:OXxZAZwYY3ybkbiR@porsche105.qy5cbvq.mongodb.net/?retryWrites=true&w=majority&appName=Porsche105';

const client = new MongoClient(dbString);
// app.use(express.urlencoded({extended:false}));

const activeUser={};

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
    res.render('index');
    console.log("home page");
});

app.get('/homePage', (req, res) => {
    res.render('index');
    console.log("home page");
});

app.get('/login',(req,res)=>{

    res.render('login');

});

app.post('/login', async (req, res) => {
    try {
        const check = await client.db('Porsche').collection('Customers').findOne({ username: req.body.Username });
        if (!check) {
            return res.send("Username not found");
        } else {
            // Compare the provided password with the hashed password stored in the database
            const isPasswordMatch = await bcrypt.compare(req.body.InputPassword1, check.password);
            if (!isPasswordMatch) {
                return res.status(401).send("Incorrect password");
            } else {
                console.log(`Message from the server: ${req.body.Username} logged in successfully`);
                return res.send("Login successful");
                
            }
        }
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/register', async (req, res) => {res.render('register')});
app.post('/register', async (req, res) => {
    try {
        // Extract data from the request body
        const { username, password, address, city, region, zip, dob } = req.body;

        // Assuming you have a MongoDB client named 'client'
        const db = client.db('Porsche');
        const collection = db.collection('Customers');

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
    const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.db('Porsche').collection('Admins').insertOne({ username, password: hashedPassword, department, email, phone });
            res.status(201).json({ message: 'Admin created successfully' });
        
    
});//working

// Route for updating an admin by ID
app.put('/v1/api/admins/:id', async (req, res) => {
    const { username, password, department, email, phone } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.db('Porsche').collection('Admins').updateOne(
            { _id:new mongoose.Types.ObjectId(req.params.id) },
            { $set: { username, password: hashedPassword, department, email, phone } }
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
    const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.db('Porsche').collection('Customers').insertOne({ username, password: hashedPassword, addressName, dob, productIds });
            res.status(201).json({ message: 'Customer created successfully' });
        
    
});

// Route for updating an admin by ID
app.put('/v1/api/customers/:id', async (req, res) => {
    const { username, password, addressName, dob, productIds } = req.body;
    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await client.db('Porsche').collection('Customers').updateOne(
            { _id:new mongoose.Types.ObjectId(req.params.id) },
            { $set: { username, password: hashedPassword, addressName, dob, productIds } }
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



// app.use((req,res,next)=>{
//     console.log("middleware recieved the request");
//     next();
// });

/////////////Ali's part:
const uri = 'mongodb+srv://amhegab305:OXxZAZwYY3ybkbiR@porsche105.qy5cbvq.mongodb.net/?retryWrites=true&w=majority&appName=Porsche105';
// Database Name
const dbName = 'Porsche';
// Collection Name
const collectionProd = 'Products';
const collectionOrder = 'Orders';


app.post('/v1/api/Product', async (req, res) => {
    
    const {category,stock,color,gear,make,model} = req.body;
    //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        

        const result = await client.db('Porsche').collection('Products').insertOne({category,stock,color,gear,make,model});

        res.status(201).json({ message: 'Product added successfully', productId: result.insertedId });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Internal server error' });
    } 
});


app.delete('/v1/api/Product/:productId', async (req, res) => {
    const productId = req.params.productId;

    //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionProd);

        // Delete the product from the collection
        const result = await collection.deleteOne({ "_id": new ObjectId(productId) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
});


app.put('/v1/api/Product/:productId', async (req, res) => {
    const productId = req.params.productId;
    const updatedProductData = req.body;

    //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionProd);

        // Update the product in the collection
        const result = await collection.updateOne(
            { "_id": new ObjectId(productId) },
            { $set: updatedProductData }
        );

        if (result.matchedCount === 1) {
            res.status(200).json({ message: 'Product updated successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
});

app.get('/v1/api/Product', async (req, res) => {
    const product = await client.db('Porsche').collection('Products').find({}).toArray();
    res.json(product);
});

app.get('/v1/api/Product/:id', async (req, res) => {
    
    const product = await client.db('Porsche').collection('Products').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
    
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(product);
});


app.get('/v1/api/Order', async (req, res) => {
    const order = await client.db('Porsche').collection('Orders').find({}).toArray();
    res.json(order);
});

app.get('/v1/api/Order/:id', async (req, res) => {
    
    const order = await client.db('Porsche').collection('Orders').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
    
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
});




app.post('/v1/api/Order', async (req, res) => {
    try {
        // Request body contains order data
        const orderData = req.body;

        // Create a new MongoClient
        // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionOrder);

        // Insert the order into the collection
        const result = await collection.insertOne(orderData);

        // Send response
        res.status(201).json({ message: 'Order added successfully', orderId: result.insertedId });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        client.close();
    }
});

// DELETE Order
app.delete('/v1/api/Order/:orderId', async (req, res) => {
    const orderID = req.params.orderId;

    //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionOrder);

        // Delete the product from the collection
        const result = await collection.deleteOne({ "_id": new ObjectId(orderID) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
});

// Update Order
app.put('/v1/api/Order/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const updatedOrderData = req.body;

    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionOrder);

        // Update the order in the collection
        const result = await collection.updateOne(
            { "_id": new ObjectId(orderId) },
            { $set: updatedOrderData }
        );

        if (result.matchedCount === 1) {
            res.status(200).json({ message: 'Order updated successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
});