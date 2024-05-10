const express = require('express');
const routerOrder = express.Router();
routerOrder.use(express.json());

const dbName = 'Porsche';
const collectionOrder = 'Orders';

module.exports = function(client) {


    
routerOrder.get('/Order', async (req, res) => {
    const order = await client.db('Porsche').collection('Orders').find({}).toArray();
    res.json(order);
});

routerOrder.get('/Order/:id', async (req, res) => {
    
    const order = await client.db('Porsche').collection('Orders').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
    
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
});




routerOrder.post('/Order', async (req, res) => {
    try {
        // Request body contains order data
        const orderData = req.body;

        // Create a new MongoClient
        // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionOrder);

        // Insert the order into the collection
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
});


// DELETE Order
routerOrder.delete('/Order/:orderId', async (req, res) => {
    const orderID = req.params.orderId;

    //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionOrder);

        // Delete the product from the collection
        const result = await collection.deleteOne({ "_id": new ObjectId(orderID) });

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
});

// Update Order
routerOrder.put('/Order/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const updatedOrderData = req.body;

    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionOrder);

        // Update the order in the collection
        const result = await collection.updateOne(
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
return router;
};