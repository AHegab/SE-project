const express = require('express');
const router = express.Router();
router.use(express.json());


const dbName = 'Porsche';
const collectionProd = 'Products';

module.exports = function(client) {
    router.post('/Product', async (req, res) => {
    
        const {category,stock,color,gear,make,model} = req.body;
        //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
        try {
            
    
            const result = await client.db('Porsche').collection('Products').insertOne({category,stock,color,gear,make,model});
    
            res.status(201).json({ message: 'Product added successfully', productId: result.insertedId });
        } catch (error) {
            console.error('Error adding product:', error);
            res.status(500).json({ message: 'Internal server error' });
        } 
    });
    
    
    router.delete('/Product/:productId', async (req, res) => {
        const productId = req.params.productId;
    
        //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
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
    
    
    router.put('/Product/:productId', async (req, res) => {
        const productId = req.params.productId;
        const updatedProductData = req.body;
    
        //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
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

// router.post('/Product', async (req, res) => {
    
//     const {category,stock,color,gear,make,model} = req.body;
//     //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
        

//         const result = await client.db('Porsche').collection('Products').insertOne({category,stock,color,gear,make,model});

//         res.status(201).json({ message: 'Product added successfully', productId: result.insertedId });
//     } catch (error) {
//         console.error('Error adding product:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     } 
// });


// router.delete('/Product/:productId', async (req, res) => {
//     const productId = req.params.productId;

//     //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         // Connect to MongoDB
//         await client.connect();

//         // Access the database and collection
//         const db = client.db(dbName);
//         const collection = db.collection(collectionProd);

//         // Delete the product from the collection
//         const result = await collection.deleteOne({ "_id": new ObjectId(productId) });

//         if (result.deletedCount === 1) {
//             res.status(200).json({ message: 'Product deleted successfully' });
//         } else {
//             res.status(404).json({ message: 'Product not found' });
//         }
//     } catch (error) {
//         console.error('Error deleting product:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     } finally {
//         // Close the MongoDB connection
//         await client.close();
//     }
// });


// router.put('/Product/:productId', async (req, res) => {
//     const productId = req.params.productId;
//     const updatedProductData = req.body;

//     //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         // Connect to MongoDB
//         await client.connect();

//         // Access the database and collection
//         const db = client.db(dbName);
//         const collection = db.collection(collectionProd);

//         // Update the product in the collection
//         const result = await collection.updateOne(
//             { "_id": new ObjectId(productId) },
//             { $set: updatedProductData }
//         );

//         if (result.matchedCount === 1) {
//             res.status(200).json({ message: 'Product updated successfully' });
//         } else {
//             res.status(404).json({ message: 'Product not found' });
//         }
//     } catch (error) {
//         console.error('Error updating product:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     } finally {
//         // Close the MongoDB connection
//         await client.close();
//     }
// });

// router.get('/Product', async (req, res) => {
//     const product = await client.db('Porsche').collection('Products').find({}).toArray();
//     res.json(product);
// });

// router.get('/Product/:id', async (req, res) => {
    
//     const product = await client.db('Porsche').collection('Products').findOne({ _id:new mongoose.Types.ObjectId(req.params.id) });
    
//     if (!product) {
//         return res.status(404).json({ error: "Product not found" });
//     }
    
//     res.json(product);
// });

//module.exports = router;