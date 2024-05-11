const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(express.json());
router.use(cookieParser());


module.exports = function(client) {

    
    router.get('/login',(req,res)=>{

    res.render('login');

});
router.post('/login', async (req, res) => {
    try {
        const secretKey = process.env.SECRET_KEY;
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
                const accessToken = jwt.sign({ userId: check._id }, secretKey, { expiresIn: '15m' });
                const refreshToken = jwt.sign({ userId: check._id }, secretKey, { expiresIn: '3hr' });

                // Save refresh token to the database
                await saveRefreshToken(check._id, refreshToken);

                console.log(`Message from the server: ${req.body.Username} logged in successfully`);
                
                res.cookie('accessToken', accessToken, { httpOnly: true });
                res.cookie('refreshToken', refreshToken, { httpOnly: true });
                check.password=undefined;
                res.cookie('info',check,{ httpOnly: true });
                res.redirect('/homePage');

            }
        }
    } catch (error) {
        // Handle error
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
        expiresIn: '3hr' 
   });
}


    return router;
};