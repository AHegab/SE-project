import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        name: '',
        category: '',
        stock: '',
        color: '',
        gear: '',
        make: '',
        model: '',
        year: '',
        imageLink: ''
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/v1/api/Product/${productId}`);
                const data = response.data;
                delete data._id; // Ensure _id is not included in the product data
                setProductData(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleIncrementStock = () => {
        setProductData((prevData) => ({
            ...prevData,
            stock: parseInt(prevData.stock) + 1
        }));
    };

    const handleDecrementStock = () => {
        const newStock = parseInt(productData.stock) - 1;
        if (newStock >= 0) {
            setProductData((prevData) => ({
                ...prevData,
                stock: newStock
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/v1/api/Product/${productId}`, productData);
            navigate('/Product');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div>
            <h1>Update Product</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" value={productData.name} onChange={handleChange} />
                </label>
                <label>
                    Category:
                    <input type="text" name="category" value={productData.category} onChange={handleChange} />
                </label>
                <label>
                    Stock:
                    <input type="text" name="stock" value={productData.stock} onChange={handleChange} />
                    <button type="button" onClick={handleIncrementStock}>+</button>
                    <button type="button" onClick={handleDecrementStock}>-</button>
                </label>
                <label>
                    Color:
                    <input type="text" name="color" value={productData.color} onChange={handleChange} />
                </label>
                <label>
                    Gear:
                    <input type="text" name="gear" value={productData.gear} onChange={handleChange} />
                </label>
                <label>
                    Make:
                    <input type="text" name="make" value={productData.make} onChange={handleChange} />
                </label>
                <label>
                    Model:
                    <input type="text" name="model" value={productData.model} onChange={handleChange} />
                </label>
                <label>
                    Year:
                    <input type="text" name="year" value={productData.year} onChange={handleChange} />
                </label>
                <label>
                    Image Link:
                    <input type="text" name="imageLink" value={productData.imageLink} onChange={handleChange} />
                </label>
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
