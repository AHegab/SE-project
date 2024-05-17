const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3001;
require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); 
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const loginRouter = require('./routes/login');
const usersRouter = require('./routes/users');
const feedbackRouter = require('./routes/feedback');
const cartRouter = require('./routes/cart');

const dbString = process.env.DB_STRING;
const client = new MongoClient(dbString);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.static('views/', { root: __dirname }));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static('public/Main/', { root: __dirname }));
app.use('/public', express.static('my-react-app/public'));


app.set('view engine', 'ejs');

app.use('/v1/api', productsRouter(client));
app.use('/v1/api', ordersRouter(client));
app.use('/', loginRouter(client));  // Ensure the correct path is used here
app.use('/v1/api', usersRouter(client));
app.use('/v1/api', feedbackRouter(client));
app.use('/v1/api', cartRouter(client));

mongoose.connect(dbString)
    .then(() => {
        console.log("Server is connected to the database successfully :)");
        console.log("You can access our homePage through here: http://localhost:3001");
        app.set('mongoClient', client);
    })
    .catch((error) => {
        console.error(error);
    });

app.get("/getData", (req, res) => {
    res.send("hello");
});

app.listen(port, () => {
    console.log("Server is listening to port: " + port);
});

app.get('/', (req, res) => {
    const username = req.cookies.info?.username; // Optional chaining
    console.log(`${username} opened the home page`);
    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('index', { userId });
});

app.get('/homePage', (req, res) => {
    const username = req.cookies.info?.username; // Optional chaining
    console.log(`${username} opened the home page`);
    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('index', { userId });
});

app.get('/forAdmins', async (req, res) => {
    try {
        const role = req.cookies.info?.role;
        if (role === 'Admin') {
            res.render('forAdmins');
            console.log(`${req.cookies.info.username} opened the forAdmins page`);
        } else {
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

app.get('/about', (req, res) => {
    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('about', { userId });
});

app.get('/ContactUs', (req, res) => {
    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('ContactUs', { userId });
});

app.get('/register', (req, res) => {
    const userId = req.cookies.info ? req.cookies.info._id : null;
    res.render('register', { userId });
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, address, city, region, role, zip, dob } = req.body;
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
            dob
        });

        res.status(201).render('login');
        console.log(`Message from the server: ${username} registered successfully`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


