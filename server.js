const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3001;
require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');
const { MongoClient ,GridFSBucket} = require('mongodb');
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users');

app.use(bodyParser.json());

const dbString = 'mongodb+srv://amhegab305:OXxZAZwYY3ybkbiR@porsche105.qy5cbvq.mongodb.net/?retryWrites=true&w=majority&appName=Porsche105';
const client = new MongoClient(dbString);

app.use(express.static('views/', { root: __dirname }));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.use(cookieParser());

app.set('view engine', 'ejs')

app.use(express.static('public/Main/', { root: __dirname }));

app.use('/v1/api', productsRouter(client));

app.use('/v1/api', ordersRouter(client));

app.use('', loginRouter(client));

app.use('/v1/api', usersRouter(client));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//     });
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './app';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.render(<App />, document.getElementById('react-root'));




mongoose.connect(dbString)
    .then(() => {
        console.log("Server is connected to the database successfully :)");
        console.log("You can access our homePage through here:   http://localhost:3001 ");
        app.set('mongoClient', client);
    }).catch((error) => {
        console.error(error);
    });

app.get("/getData",(req,res)=>{
    res.send("hello");
});


app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});





app.get('/', (req, res) => {
    const username = req.cookies.info.username; // Access username from cookie
    //console.log(req.cookies);
    console.log(`${username} opened the home page`);
    const info = req.cookies.info;

    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('index', { userId });
});




app.get('/homePage', (req, res) => {
    const username = req.cookies.info.username; // Access username from cookie
    //console.log(req.cookies);
    console.log(`${username} opened the home page`);
    const info = req.cookies.info;

    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('index', { userId });
});



app.get('/forAdmins', async (req, res) => {
    try {
        // Get the role from the request object
        const role = req.cookies.info.role;
        console.log(role);

        if (role === 'Admin') {
            res.render('forAdmins');
            console.log(`${req.cookies.info.username} opened the forAdmins page`);
        } else {
            // User is not an admin, return unauthorized error
            return res.status(403).send("Access Forbidden: Only admins can access this page.");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

app.get('/index', (req, res) => {

    res.render('index');

});



app.get('/about', async (req, res) => {

    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('about', { userId });
});

app.get('/ContactUs', async (req, res) => {

    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('ContactUs', { userId });
});


app.get('/register', async (req, res) => {
    
    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('register', { userId });

});


app.post('/register', async (req, res) => {
    try {
        // Extract data from the request body
        const { username, password, address, city, region, role, zip, dob } = req.body;

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


