const express = require('express');
const routerOrder = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
routerOrder.use(express.json());

const dbName = 'Porsche';
const collectionOrder = 'Orders';

module.exports = function(client) {


    
routerOrder.get('/Order', async (req, res) => {
    const order = await client.db('Porsche').collection('Orders').find({}).toArray();
    res.json(order);
});//perfect

routerOrder.get('/Order/:id', async (req, res) => {
    
    const order = await client.db('Porsche').collection('Orders').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
    
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
});//pefect




routerOrder.post('/Order', async (req, res) => {
    try {
        // Request body contains order data
        const orderData = req.body;
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(collectionOrder);

        
        const result = await collection.insertOne(orderData);

        // Send response
        res.status(201).json({ message: 'Order added successfully', orderId: result.insertedId });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        client.close();
    }
});//perfect


// DELETE Order
routerOrder.delete('/Order/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    // console.log(orderId);
    const updatedOrderData = req.body;
    
    try {

        const userId = req.cookies.info._id;
        const order = await client.db('Porsche').collection('Orders').findOne({ _id:new mongoose.Types.ObjectId(req.params.orderId) });
        //console.log(`order:${order}`);
        const customerID=order.customerId;
        
        // console.log(customerID);
        const userRole=req.cookies.info;

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
    } finally {
        // Close the MongoDB connection
        await client.close();
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
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
});
return routerOrder;
};// perfect
