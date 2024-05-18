// AdminProductList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/v1/api/Product');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleUpdateClick = (productId) => {
        navigate(`/admin/update-product/${productId}`);
    };

    return (
        <div>
            <h1>All Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        {product.name} - {product.model} - {product.year}
                        <button onClick={() => handleUpdateClick(product._id)}>Update</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminProductList;
