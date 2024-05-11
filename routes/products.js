const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();
router.use(express.json());


const dbName = 'Porsche';
const collectionProd = 'Products';

module.exports = function(client) {
    router.post('/Product', async (req, res) => {
    
    const {category, stock ,color, gear ,make , model}=req.body;
    try {

        const userRole=req.cookies.info;

        if(userRole.role!='Admin')
            {
                return res.status(403).json('User does not have access');
            }

            const db = client.db(dbName);
            const collection = db.collection(collectionProd);
    
            
            const result = await collection.insertOne({category, stock ,color, gear ,make , model});
    
            res.status(201).json({ message: 'Product added successfully', productId: result.insertedId });
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    
    router.delete('/Product/:productId', async (req, res) => {

        const productId = req.params.productId;
        const userRole=req.cookies.info;
        if(userRole.role!='Admin')
            {
                return res.status(403).json('User does not have access');
            }
    
        try {
            
            const result =await client.db('Porsche').collection('Products').deleteOne({  _id:new mongoose.Types.ObjectId(req.params.productId)  });
    
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
    
    
    router.put('/Product/:productId', async (req, res) => {

        const productId = req.params.productId;
        const updatedProductData = req.body;
        const userRole=req.cookies.info;

        if(userRole.role!='Admin')
            {
                return res.status(403).json('User does not have access');
            }
    
        try {
            
            const result =await client.db('Porsche').collection('Products').updateOne(
                {  _id:new mongoose.Types.ObjectId(req.params.productId)  },
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
    




    router.get('/Product', async (req, res) => {
        const product = await client.db('Porsche').collection('Products').find({}).toArray();
        res.json(product);
    });
    
    router.get('/Product/:id', async (req, res) => {
        
        const product = await client.db('Porsche').collection('Products').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
        
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        res.json(product);
    });

    return router;
};
