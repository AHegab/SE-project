const express = require("express");
const app = express();
const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 3001;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
app.use(bodyParser.json());


const dbString='mongodb+srv://amhegab305:OXxZAZwYY3ybkbiR@porsche105.qy5cbvq.mongodb.net/?retryWrites=true&w=majority&appName=Porsche105';
const client = new MongoClient(dbString);

app.use(express.static('views/', { root: __dirname }));

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.set('view engine' , 'ejs')

app.use(express.static('public/Main/',{root:__dirname}));

app.use('/v1/api', productsRouter(client));

//app.use('/v1/api', ordersRouter(client));







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
        const check = await client.db('Porsche').collection('Users').findOne({ username: req.body.Username });
        if (!check) {
            return res.send("Username not found");
        } else {
            // Compare the provided password with the hashed password stored in the database
            const isPasswordMatch = await bcrypt.compare(req.body.InputPassword1, check.password);
            if (!isPasswordMatch) {
                return res.status(401).send("Incorrect password");
            } else {
                // Generate JWT token
                const {accessToken, refreshToken} = generateToken(check._id, req.body.Username, req.body.role);
                await saveRefreshToken(check._id, refreshToken);

                console.log(`Message from the server: ${req.body.Username} logged in successfully`);
                
                // Send the token in the response
                res.json({accessToken, refreshToken});

                // No need to wait for the setTimeout, as the response has already been sent
                // Redirect logic should be handled on the client-side
            }
        }
    } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

///



///
function generateToken(id,username,role){
    const payload ={
        id: id,
        username: username,
        role: role
    };
    const sK = process.env.ACCESS_TOKEN_SECRET
    const accessOptions = {
        expiresIn: "1hr",
        algorithm: 'HS256'

    };
    //generate access token
    const accessToken = jwt.sign(payload,sK,accessOptions);
    const rT = process.env.REFRESH_TOKEN
    const refreshOptions ={
        expiresIn: "7d",
        algorithm: 'HS256'

    }
    //generate refresh token
    const refreshToken = jwt.sign(payload,rT,refreshOptions);
    //console.log(`{accessToken,refreshToken}`);
    return {accessToken,refreshToken};
}

//refresh token endpoint
app.post('/token', async (req, res) => {
    const { token: refreshToken } = req.body;
    if (refreshToken == null) return res.sendStatus(401);

    // Check if the refresh token exists in the database and is still valid
    try {
        const tokenDoc = await client.db('Porsche').collection('RefreshTokens').findOne({ token: refreshToken });
        if (!tokenDoc) return res.sendStatus(403); // Token not found or invalid

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403); // Token invalid or expired

            const newAccessToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

async function saveRefreshToken(userId, token) {
    const hashedToken = await bcrypt.hash(token, 10);
    await client.db('Porsche').collection('RefreshTokens').insertOne({
        userId: userId,
        token: hashedToken,
        createdAt: new Date(),
        expiresIn: '7d' 
   });
}

app.get('/index', (req, res) => {
    
    res.render('index');
    
});


app.get('/register', async (req, res) => {res.render('register')});
app.post('/register', async (req, res) => {
    try {
        // Extract data from the request body
        const { username, password, address, city, region,role, zip, dob } = req.body;

        // Assuming you have a MongoDB client named 'client'
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

app.get('/v1/api/users', async (req, res) => {
    const users = await client.db('Porsche').collection('Users').find({}).toArray();
    res.json(users);
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

