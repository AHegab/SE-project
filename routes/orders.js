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
        try {
            const orders = await client.db('Porsche').collection('Orders').find({}).toArray();
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    routerOrder.get('/order/user/:userId', async (req, res) => {
        try {
            const userId = new ObjectId(req.params.userId); // Validate and convert userId
            const orders = await client.db('Porsche').collection('Orders').find({ userId: userId }).toArray();
            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders for user:', error);
            if (error.name === 'BSONTypeError') {
                res.status(400).json({ message: 'Invalid user ID format' });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    });
    
    
    routerOrder.get('/Order/:id', async (req, res) => {
        try {
            const orderId = new ObjectId(req.params.id); // Convert and validate order ID
            const order = await client.db('Porsche').collection('Orders').findOne({ _id: orderId });
    
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
    
            res.json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            if (error.name === 'BSONTypeError') {
                res.status(400).json({ message: 'Invalid order ID format' });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
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
    
        try {
            // Fetch the existing order
            const existingOrder = await client.db('Porsche').collection('Orders').findOne({ _id: new mongoose.Types.ObjectId(orderId) });
            if (!existingOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
    
            // Prepare updated order data
            const updatedOrderData = {
                ...existingOrder,
                ...req.body,
                userId: req.body.userId ? new mongoose.Types.ObjectId(req.body.userId) : existingOrder.userId,
                productIds: req.body.productIds ? req.body.productIds.map(id => new mongoose.Types.ObjectId(id)) : existingOrder.productIds,
                datetime: req.body.datetime ? new Date(req.body.datetime) : existingOrder.datetime,
            };
    
            // Perform the update
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
            userId: new mongoose.Types.ObjectId(userId),
            productIds: productIds.map(id => new mongoose.Types.ObjectId(id)),
            datetime: new Date(datetime),
            notes,
            total
        };
    
        console.log("Final order object:", order);  // Debugging line
    
        try {
            const newOrder = await client.db('Porsche').collection('Orders').insertOne(order);
            res.status(201).json({ message: 'Order created successfully', order: newOrder });
        } catch (error) {
            console.error('Error creating order:', error);
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
