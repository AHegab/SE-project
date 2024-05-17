import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styleProducts.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/v1/api/Product');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="products-container">
            {products.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className="product-card">
                    <img src={product.imageLink} alt={product.name} className="product-image" />
                    <h3 className="product-name">{product.name}</h3>
                </Link>
            ))}
        </div>
    );
};

export default ProductsPage;
