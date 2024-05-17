const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(express.json());
router.use(cookieParser());

module.exports = function(client) {
    router.post('/request-admin', async (req, res) => {
        try {
            const { username, userId } = req.body;
            const newRequest = {
                username: username,
                userId: userId,
                createdAt: new Date()
            };
            await client.db('Porsche').collection('Requests').insertOne(newRequest);
            res.status(201).json({ message: 'Request submitted successfully' });
        } catch (error) {
            console.error('Error creating request:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    router.get("/req",async (req, res) => {

        const requests = await client.db('Porsche').collection('Requests').find({}).toArray();
                res.json(requests);

    });

    return router;
};
