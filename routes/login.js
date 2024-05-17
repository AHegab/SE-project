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

    
//     router.get('/login',(req,res)=>{

//     res.render('login');

// });
router.post('/login', async (req, res) => {
    try {
        const secretKey = process.env.SECRET_KEY;
        const { Username, InputPassword1 } = req.body;
        const user = await client.db('Porsche').collection('Users').findOne({ username: Username });

        if (!user) {
            return res.status(404).json({ message: "Username not found" });
        }

        const isPasswordMatch = await bcrypt.compare(InputPassword1, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const accessToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '3hr' });

        await saveRefreshToken(user._id, refreshToken);

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'None' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None' });
        user.password = undefined;
        res.cookie('userInfo', JSON.stringify({ username: user.username , Address: user.address , City: user.city , Region: user.region , role: user.role ,Zip: user.zip, Dob: user.dob  }), { secure: true, sameSite: 'None' });

        console.log(`Message from the server: ${Username} logged in successfully`);

        res.status(200).json({ message: "Login successful", redirectUrl: "/homePage" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

async function saveRefreshToken(userId, token) {
    const hashedToken = await bcrypt.hash(token, 10);
    await client.db('Porsche').collection('RefreshTokens').insertOne({
        userId: userId,
        token: hashedToken,
        createdAt: new Date(),
        expiresIn: '3hr' 
   });
}


    return router;
};