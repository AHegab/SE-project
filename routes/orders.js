const express = require('express');
const routerOrder = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
routerOrder.use(express.json());


const dbName = 'Porsche';
const collectionOrder = 'Orders';




module.exports = function(client) {

    routerOrder.get('/Order', async (req, res) => {
        const order = await client.db('Porsche').collection('Orders').find({}).toArray();
        res.json(order);
    });

    routerOrder.get('/order/user/:userId', async (req, res) => {
        try {
            const userId = req.params.userId;
            console.log(`userId=${userId}`); // Check the received user ID
            const orders = await client.db('Porsche').collection('Orders').find({ userId }).toArray();
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
    routerOrder.get('/Order/:id', async (req, res) => {
        const orderId = req.params.id;

        try {
            const order = await client.db('Porsche').collection('Orders').findOne({ _id: new ObjectId(orderId) });

            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            res.json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    //add order
   

    routerOrder.post('/addOrder', [
        body('userId').isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
        body('productIds').isArray({ min: 1 }).withMessage('At least one product ID is required')
            .custom(productIds => productIds.every(id => ObjectId.isValid(id)))
            .withMessage('All product IDs must be valid MongoDB ObjectIds'),
        body('datetime').isISO8601().withMessage('Datetime must be a valid ISO 8601 date'),
        body('notes').isString().withMessage('Notes must be a string'),
        body('total').isInt({ min: 0 }).withMessage('Total must be a non-negative integer'),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { userId, productIds, datetime, notes, total } = req.body;
        const order = {
            userId: new mongoose.Types.ObjectId(userId), // Correct usage with Mongoose
            productIds: productIds.map(id => new mongoose.Types.ObjectId(id)), // Convert each product ID
            datetime: new Date(datetime),
            notes,
            total
        };
        
        try {
            const newOrder = await client.db('Porsche').collection('Orders').insertOne(order);
            res.status(201).json({ message: 'Order created successfully', order: newOrder });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    

    routerOrder.put('/Order/:orderId', [
        body('userId').optional().isMongoId().withMessage('User ID must be a valid MongoDB ObjectId'),
        body('productIds').optional().isArray().withMessage('Product IDs must be an array')
            .custom(productIds => productIds.every(id =>  mongoose.Types.ObjectId.isValid(id)))
            .withMessage('All product IDs must be valid MongoDB ObjectIds'),
        body('datetime').optional().isISO8601().withMessage('Datetime must be a valid ISO 8601 date'),
        body('notes').optional().isString().withMessage('Notes must be a string'),
        body('total').optional().isInt({ min: 0 }).withMessage('Total must be a non-negative integer'),
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const orderId = req.params.orderId;
        const updatedOrderData = {
            ...req.body,
            userId: req.body.userId ? mongoose.Types.ObjectId(req.body.userId) : undefined,
            productIds: req.body.productIds ? req.body.productIds.map(id => mongoose.Types.ObjectId(id)) : undefined,
            datetime: req.body.datetime ? new Date(req.body.datetime) : undefined,
        };
    
        try {
            const result = await client.db('Porsche').collection('Orders').updateOne(
                { "_id": new mongoose.Types.ObjectId(orderId) },
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
        }
    });
    
    

routerOrder.post('/Order', async (req, res) => {
    try {
        // Request body contains order data
        const orderData = req.body;
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionOrder);

        // Insert order into the database
        const result = await collection.insertOne(orderData);

        // Update stock in the Product collection for each product in the order
        const productIds = orderData.productIds;
        console.log(productIds)
        const productCollection = db.collection('Products');

        for (const productId of productIds) {
            console.log(`pIDS:${productId}`)
            const product = await productCollection.findOne({ _id: new ObjectId(productId) });
            if (product) {
                await productCollection.updateOne(
                    { _id: new ObjectId(productId) },
                    { $set: { stock : parseInt(product.stock) - 1 } } // Decrement stock by 1
                );
            }
        }

        // Send response
        res.status(201).json({ message: 'Order added successfully', orderId: result.insertedId });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// DELETE Order
routerOrder.delete('/Order/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    //  console.log(orderId);
    const updatedOrderData = req.body;
    
    try {

        const userId = req.cookies.info._id;
        const order = await client.db('Porsche').collection('Orders').findOne({ _id:new mongoose.Types.ObjectId(req.params.orderId) });
        //console.log(`order:${order}`);
        const customerID=order.customerId;
        
        // console.log(customerID);
        const userRole=req.cookies.info;
        console.log(userId);
        if(userId!=customerID || userRole.role!='Admin')
            {
                return res.status(403).json('User does not have access');
            }

        const result = await client.db('Porsche').collection('Orders').deleteOne({ _id:new mongoose.Types.ObjectId(req.params.orderId)});

        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    } 
});//perfect

// Update Order
routerOrder.put('/Order/:orderId', async (req, res) => {

    const orderId = req.params.orderId;
    // console.log(orderId);
    const updatedOrderData = req.body;
    
    try {

        const userId = req.cookies.info._id;
        const order = await client.db('Porsche').collection('Orders').findOne({ _id:new mongoose.Types.ObjectId(req.params.orderId) });
        // console.log(`order:${order}`);
        const customerID=order.customerId;
        
        // console.log(customerID);
        const userRole=req.cookies.info;

        if(userId!=customerID || userRole.role!='Admin')
            {
                return res.status(403).json('User does not have access');
            }

        // Update the order in the collection
        const result =  await client.db('Porsche').collection('Orders').updateOne(
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
    } 
});

    return routerOrder;
};
