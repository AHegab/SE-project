const express = require('express');
const router = express.Router();
const fs = require('fs');
const adminsFilePath = './Json/admins.json';

router.get('/', (req, res) => {
    fs.readFile(adminsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading admins file:', err);
            return res.status(500).send('Internal Server Error');
        }
        const admins = JSON.parse(data);
        res.json(admins);
    });
});

router.post('/', (req, res) => {
    const newAdmin = req.body;
    fs.readFile(adminsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading admins file:', err);
            return res.status(500).send('Internal Server Error');
        }
        const admins = JSON.parse(data);
        admins.push(newAdmin);
        fs.writeFile(adminsFilePath, JSON.stringify(admins, null, 2), (err) => {
            if (err) {
                console.error('Error writing admins file:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).send('Admin added successfully');
        });
    });
});

// Implement other CRUD operations (PUT, DELETE) similarly

module.exports = router;
