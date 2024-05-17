
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { GridFSBucket, ObjectId } = require('mongodb');
const path = require('path');


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

        router.post('/Product', upload.array('images', 10), async (req, res) => {
            try {
                const db = client.db('Porsche');
                
                // Array to store image paths
                const imagePaths = [];
                
                // Iterate through each uploaded file
                for (const file of req.files) {
                    const filename = file.originalname;
                    const filePath = file.path;
        
                    // Push the file path to the imagePaths array
                    imagePaths.push(filePath);
        
                    // Optionally, you can perform other operations with the uploaded files here
                }
        
                // Extract product data from request body
                const { category, stock, color, gear, make, model, name, year,imageLink } = req.body;
        
                // Insert product data and image paths into the database
                const result = await db.collection('Products').insertOne({
                    category: category,
                    stock: stock,
                    color: color,
                    gear: gear,
                    make: make,
                    model: model,
                    name: name,
                    year: year,
                    imageLink:imageLink,
                    imagePaths: imagePaths
                });
        
                
                    res.status(200).json({ message: 'Product and files uploaded successfully', imagePaths: imagePaths });
            } catch (error) {
                console.error('Error uploading product and files:', error);
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
    router.get('/Product/:id', async (req, res) => {
        const productId = req.params.id;
    
        try {
            // Fetch product details by ID
            const product = await client.db('Porsche').collection('Products').findOne({ _id: new ObjectId(productId) });
    
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Return product details along with image paths
            res.status(200).json(product);
        } catch (error) {
            console.error('Error retrieving product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/product/:imagePath', (req, res) => {
        const imagePath = req.params.imagePath;
        // Construct the absolute path to the image file
        const imagePathAbsolute = path.join(__dirname, 'my-react-app', 'public', 'CarImages', imagePath);
        
        // Send the image file as the response
        res.sendFile(imagePathAbsolute, (err) => {
            if (err) {
                // Handle errors such as file not found
                console.error('Error sending file:', err);
                res.status(404).send('Image not found');
            }
        });
    });


    router.get('/Product', async (req, res) => {
        const product = await client.db('Porsche').collection('Products').find({}).toArray();
        res.json(product);
    });

    // Define other route handlers here...

   
    
    
    // Define other route handlers here...

    return router;
};
