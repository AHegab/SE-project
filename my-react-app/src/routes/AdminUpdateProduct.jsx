// AdminUpdateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styleAdminUpdateProduct.css';

const AdminUpdateProduct = () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/v1/api/Product/${productId}`, productData);
            navigate('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="update-product-container">
            <h1 className="update-product-title">Update Product</h1>
            <form className="update-product-form" onSubmit={handleSubmit}>
                <label className="form-label">
                    Name:
                    <input className="form-input" type="text" name="name" value={productData.name} onChange={handleChange} />
                </label>
                <label className="form-label">
                    Category:
                    <input className="form-input" type="text" name="category" value={productData.category} onChange={handleChange} />
                </label>
                <label className="form-label">
                    Stock:
                    <input className="form-input" type="text" name="stock" value={productData.stock} onChange={handleChange} />
                </label>
                <label className="form-label">
                    Color:
                    <input className="form-input" type="text" name="color" value={productData.color} onChange={handleChange} />
                </label>
                <label className="form-label">
                    Gear:
                    <input className="form-input" type="text" name="gear" value={productData.gear} onChange={handleChange} />
                </label>
                <label className="form-label">
                    Make:
                    <input className="form-input" type="text" name="make" value={productData.make} onChange={handleChange} />
                </label>
                <label className="form-label">
                    Model:
                    <input className="form-input" type="text" name="model" value={productData.model} onChange={handleChange} />
                </label>
                <label className="form-label">
                    Year:
                    <input className="form-input" type="text" name="year" value={productData.year} onChange={handleChange} />
                </label>
                <label className="form-label">
                    Image Link:
                    <input className="form-input" type="text" name="imageLink" value={productData.imageLink} onChange={handleChange} />
                </label>
                <button className="form-button" type="submit">Update Product</button>
            </form>
        </div>
    );
};

export default AdminUpdateProduct;
