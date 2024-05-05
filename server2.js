const express=require("express");

const app=express();

require('dotenv').config();

const port=process.env.PORT || 3001;

const fs = require('fs');

const { MongoClient, ObjectId  } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://amhegab305:OXxZAZwYY3ybkbiR@porsche105.qy5cbvq.mongodb.net/?retryWrites=true&w=majority&appName=Porsche105';
// Database Name
const dbName = 'Porsche';
// Collection Name
const collectionProd = 'Products';
const collectionOrder = 'Orders';



app.listen(port,()=>{

    console.log("server is listening to port: "+ port);
})


// DISPLAY All Products
app.get("/v1/api/Products", (req, res) => {
    try {
      // Read the contents of the JSON file synchronously
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(jsonData);

      // Format the products array to remove the "_id" field and reorder properties
    const formattedProducts = products.map(product => ({
        make: product.make,
        model: product.model,
        category: product.category,
        color: product.color,
        gear: product.gear,
        stock: product.stock
        }));

      // Send the formatted products as a response
        res.json(formattedProducts);
        console.log("Retrieved products:", formattedProducts);
    } catch (err) {
      // If an error occurs while reading or parsing the file, send a 500 Internal Server Error response
        res.status(500).send("Error reading JSON file");
        console.error("Error reading JSON file:", err);
    }
    });

  // DISPLAY Product with Specific ID
    app.get("/v1/api/Product/:id", (req, res) => {
    try {
      // Extract the 'id' parameter from the request URL
        const productId = req.params.id;

      // Read the contents of the JSON file synchronously
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const products = JSON.parse(jsonData);

      // Find the product with the corresponding id
        const product = products.find(product => product._id.$oid === productId);
        
      // If product is found, send it as a response
        if (product) {
        res.json(product);
        console.log("Retrieved product:", product);
        } else {
        // If product is not found, send a 404 Not Found response
        res.status(404).send("Product not found");
        console.log("Product not found");
        }
    } catch (err) {
      // If an error occurs while reading or parsing the file, send a 500 Internal Server Error response
        res.status(500).send("Error reading JSON file");
        console.error("Error reading JSON file:", err);
    }
    });

  // ADD Product
  // ------------------------------
  // ------------------------------
  // ------------------------------
    app.use(express.json());
    app.post('/v1/api/AddProduct', async (req, res) => {
    const productData = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionProd);

        // Insert the product into the collection
        const result = await collection.insertOne(productData);

        res.status(201).json({ message: 'Product added successfully', productId: result.insertedId });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
});

// DELETE Product
app.delete('/v1/api/DeleteProduct/:productId', async (req, res) => {
    const productId = req.params.productId;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionProd);

        // Delete the product from the collection
        const result = await collection.deleteOne({ "_id": new ObjectId(productId) });

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

// UPDATE Product
app.put('/v1/api/UpdateProduct/:productId', async (req, res) => {
    const productId = req.params.productId;
    const updatedProductData = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionProd);

        // Update the product in the collection
        const result = await collection.updateOne(
            { "_id": new ObjectId(productId) },
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


  // ORDERS SEction
  // ------------------------------
  // ------------------------------
  // ------------------------------
  // Retrieve All Orders
    pp.get("/v1/api/Orders", (req, res) => {
    try {
        // Read the contents of the JSON file synchronously
        const jsonData = fs.readFileSync(filePathOrder, 'utf8');
        const orders = JSON.parse(jsonData);

        // Format the orders array to remove the "_id" field and reorder properties
        const formattedOrders = orders.map(order => ({
            orderId: order._id["$oid"],
            customerId: order.customerId["$oid"],
            items: order.items.map(item => ({
                productId: item.productId["$oid"],
                quantity: item.quantity,
                price: parseFloat(item.price["$numberDecimal"])
            })),
            totalPrice: parseFloat(order.totalPrice["$numberDecimal"]),
            status: order.status,
            createdAt: order.createdAt["$date"],
            paymentDetails: order.paymentDetails,
            shippingDetails: order.shippingDetails,
            notes: order.notes
        }));

        // Send the formatted orders as a response
        res.json(formattedOrders);
        console.log("Retrieved orders:", formattedOrders);
    } catch (err) {
        // If an error occurs while reading or parsing the file, send a 500 Internal Server Error response
        res.status(500).send("Error reading JSON file");
        console.error("Error reading JSON file:", err);
    }
});

// Retrieve Specific Order
// I cant get it to work with OrderId for some reason
app.get("/v1/api/OrdersByCustomer/:customerId", (req, res) => {
    try {
        const customerId = req.params.customerId;

        const jsonData = fs.readFileSync(filePathOrder, 'utf8');
        const orders = JSON.parse(jsonData);

        // Find orders with the specified customerId
        const customerOrders = orders.filter(order => order.customerId["$oid"] === customerId);

        if (customerOrders.length === 0) {
            // If no orders are found for the customer, send a 404 Not Found response
            res.status(404).send("No orders found for the customer");
            console.log("No orders found for customer:", customerId);
        } else {
            // Format the orders data
            const formattedOrders = customerOrders.map(order => ({
                orderId: order._id["$oid"],
                customerId: order.customerId["$oid"],
                items: order.items.map(item => ({
                    productId: item.productId["$oid"],
                    quantity: item.quantity,
                    price: parseFloat(item.price["$numberDecimal"])
                })),
                totalPrice: parseFloat(order.totalPrice["$numberDecimal"]),
                status: order.status,
                createdAt: order.createdAt["$date"],
                paymentDetails: order.paymentDetails,
                shippingDetails: order.shippingDetails,
                notes: order.notes
            }));

            // Send the formatted orders as a response
            res.json(formattedOrders);
            console.log("Retrieved orders for customer:", customerId, formattedOrders);
        }
    } catch (err) {
        // If an error occurs while reading or parsing the file, send a 500 Internal Server Error response
        res.status(500).send("Error reading JSON file");
        console.error("Error reading JSON file:", err);
    }
});


// ADD Order

app.post('/v1/api/AddOrder', async (req, res) => {
    try {
        // Request body contains order data
        const orderData = req.body;

        // Create a new MongoClient
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
app.delete('/v1/api/DeleteOrder/:orderId', async (req, res) => {
    let client; // Declare client at a broader scope

    try {
        // Extract orderId from request parameters
        const orderId = req.params.orderId;

        // Create a new MongoClient
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Connect to MongoDB
        await client.connect();

        // Access the database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionOrder);

        // Convert orderId to ObjectId
        const orderObjectId = new ObjectId(orderId); // Adding 'new' keyword here

        // Delete the order from the collection
        const result = await collection.deleteOne({ _id: orderObjectId });

        // Check if order was found and deleted
        if (result.deletedCount === 0) {
            // If order is not found, send a 404 Not Found response
            res.status(404).json({ message: 'Order not found' });
        } else {
            // Send success response
            res.status(200).json({ message: 'Order deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        if (client) {
            client.close();
        }
    }
});

// Update Order
app.put('/v1/api/UpdateOrder/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const updatedOrderData = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
// Test Comment