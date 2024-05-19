
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { GridFSBucket, ObjectId } = require('mongodb');
const path = require('path');
const mongoose = require('mongoose');


const { body, validationResult } = require('express-validator');

const router = express.Router();
router.use(express.json());
router.use('/product', express.static(path.join(__dirname, 'my-react-app', 'public', 'CarImages')));
const dbName = 'Porsche';
const collectionProd = 'Products';

module.exports = function(client) {
    // const upload = multer({ dest: 'uploads/' }); // Adjust the destination folder as needed
    const bucket = new GridFSBucket(client.db(dbName)); // Initialize GridFSBucket with the database

    

    const storage = multer.diskStorage({
        destination: './my-react-app/public/CarImages',
        filename: (req, file, cb) => {
            // Use file object to access properties such as filename and originalname
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const extension = path.extname(file.originalname);
            cb(null, `${file.fieldname}_${uniqueSuffix}${extension}`);
        }
    });

    const upload = multer({
            storage:storage
        });
        
        router.use('/Product',express.static("./my-react-app/public/CarImages"))


        router.post('/Product', upload.array('images', 10), [
            body('category').isIn(['Sport', 'SUV', 'Sedan', 'Convertible', 'Hatchback']).withMessage('Invalid category'),
            body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
            body('color').isString().withMessage('Color must be a string'),
            body('gear').isString().withMessage('Gear must be a string'),
            body('make').isString().withMessage('Make must be a string'),
            body('model').isString().withMessage('Model must be a string'),
            body('name').isString().withMessage('Name must be a string'),
            body('year').isInt({ min: 1900, max: 2100 }).withMessage('Year must be between 1900 and 2100'),
            body('imageLink').isURL().withMessage('Image link must be a valid URL'),
            body('price').isInt({ min: 0 }).withMessage('Price must be a non-negative integer')
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
        
            const imagePaths = req.files.map(file => file.path);
        
            const { category, stock, color, gear, make, model, name, year, imageLink, price } = req.body;
            const product = {
                category, stock, color, gear, make, model, name, year, imageLink, imagePaths, price
            };
        
            try {
                const result = await client.db('Porsche').collection('Products').insertOne(product);
                res.status(201).json({ message: 'Product and files uploaded successfully', productId: result.insertedId });
            } catch (error) {
                console.error('Error uploading product and files:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        
        
    
        
        router.delete('/Product/:productId', async (req, res) => {
            const productId = req.params.productId;
            const userRole = req.cookies.info;
        
            if (userRole.role !== 'Admin') {
                return res.status(403).json({ message: 'User does not have access' });
            }
        
            try {
                const result = await client.db('Porsche').collection('Products').deleteOne({ _id: new ObjectId(productId) });
        
                if (result.deletedCount === 0) {
                    res.status(404).json({ message: 'Product not found' });
                } else {
                    res.status(200).json({ message: 'Product deleted successfully' });
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        
    
        router.put('/Product/:productId', [
            body('category').optional().isIn(['Sport', 'SUV', 'Sedan', 'Convertible', 'Hatchback']).withMessage('Invalid category'),
            // Add additional optional validations for other fields
        ], async (req, res) => {
            const productId = req.params.productId;
            const updatedProductData = {...req.body};
            delete updatedProductData._id;  // Remove the _id field from the data
            updatedProductData.stock = parseInt(updatedProductData.stock);
            updatedProductData.year = parseInt(updatedProductData.year);
            updatedProductData.price = parseInt(updatedProductData.price);
            const userRole = req.cookies.userInfo ? JSON.parse(req.cookies.userInfo).role : null;  
            if (userRole !== 'Admin') {
                return res.status(403).json({ message: 'User does not have access' });
            }
        
            try {
                const result = await client.db('Porsche').collection('Products').updateOne(
                    { _id: new ObjectId(productId) },
                    { $set: updatedProductData }
                );
        
                if (result.matchedCount === 0) {
                    res.status(404).json({ message: 'Product not found' });
                } else {
                    res.status(200).json({ message: 'Product updated successfully' });
                }
            } catch (error) {
                console.error('Error updating product:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        
        
        router.get('/Product/:id', async (req, res) => {
            const productId = req.params.id;
            try {
                const product = await client.db('Porsche').collection('Products').findOne({ _id: new ObjectId(productId) });
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                res.status(200).json(product);
            } catch (error) {
                console.error('Error retrieving product:', error);
                if (error.name === 'BSONTypeError') {
                    res.status(400).json({ message: 'Invalid product ID format' });
                } else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        });
        

        router.get('/product/:imagePath', (req, res) => {
            const imagePath = req.params.imagePath;
            const imagePathAbsolute = path.join(__dirname, 'my-react-app', 'public', 'CarImages', imagePath);
        
            res.sendFile(imagePathAbsolute, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    if (err.code === 'ENOENT') {
                        res.status(404).send('Image not found');
                    } else {
                        res.status(500).send('Internal server error');
                    }
                }
            });
        });
        

        router.get('/Product', async (req, res) => {
            try {
                const products = await client.db('Porsche').collection('Products').find({}).toArray();
                res.json(products);
            } catch (error) {
                console.error('Error fetching products:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        


    return router;
};
