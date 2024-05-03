const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    category: {
        type: String,
        
    },
    stock: {
        type: Number,
        
    },
    color: {
        type: String,
        
    },
    gear: {
        type: String,
        
    },
    make: {
        type: String,
        
    },
    model: {
        type: String,
        
    },
});

const Product = mongoose.model("Products", ProductSchema); // Define Product model

module.exports = Product; // Export Product model
