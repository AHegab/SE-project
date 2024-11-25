import React, { useState } from 'react';
import axios from 'axios';
import './styleAddProduct.css'; // Import the CSS file for styling

const AddProduct = () => {
    const [product, setProduct] = useState({
        category: '',
        stock: '',
        color: '',
        gear: '',
        make: '',
        model: '',
        name: '',
        year: ''
    });
    const [images, setImages] = useState([]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImages([...images, ...e.target.files]); // merge new files with existing ones
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('category', product.category);
        formData.append('stock', product.stock);
        formData.append('color', product.color);
        formData.append('gear', product.gear);
        formData.append('make', product.make);
        formData.append('model', product.model);
        formData.append('name', product.name);
        formData.append('year', product.year);

        // Append each image file with the field name 'images'
        images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        try {
            const response = await axios.post('http://localhost:3001/v1/api/Product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Files uploaded:', response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    return (
        <div className="center-container"> {/* Center container */}
            <form className="add-product-form" onSubmit={handleSubmit}>
                <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} />
                <input type="number" name="stock" placeholder="Stock" value={product.stock} onChange={handleChange} />
                <input type="text" name="color" placeholder="Color" value={product.color} onChange={handleChange} />
                <input type="text" name="gear" placeholder="Gear" value={product.gear} onChange={handleChange} />
                <input type="text" name="make" placeholder="Make" value={product.make} onChange={handleChange} />
                <input type="text" name="model" placeholder="Model" value={product.model} onChange={handleChange} />
                <input type="text" name="name" placeholder="Name" value={product.name} onChange={handleChange} />
                <input type="text" name="year" placeholder="Year" value={product.year} onChange={handleChange} />
                <input type="text" name="imageLink" placeholder="imageLink" value={product.imageLink} onChange={handleChange} />
                <input type="file" name="images" onChange={handleImageChange} multiple />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default AddProduct;
