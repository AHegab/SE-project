import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './styleProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/v1/api/Product/${id}`);
                // Rewrite image paths before setting the product state
                const updatedProduct = { ...response.data, imagePaths: rewriteImagePaths(response.data.imagePaths) };
                setProduct(updatedProduct);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
    
        fetchProduct();
    }, [id]);
    
    // Method to rewrite image paths
    const rewriteImagePaths = (imagePaths) => {
        return imagePaths.map((path) => {
            // Correct the path to format it properly for web usage
            return path.replace(/^.*?\\public\\/, '/public/').replace(/\\/g, '/');
        });
    };
    
    

    // Method to handle adding product to cart
    const addToCart = async () => {
        try {
            const response = await axios.post('http://localhost:3001/v1/api/cart', { productId: product._id, quantity: 1 }, { withCredentials: true });
            if (response.status === 201) {
                alert('Product added to cart successfully!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add product to cart.');
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-card">
                <h2 className="product-title">{product.name}</h2>

                <Carousel showThumbs={false} showStatus={false} autoPlay infiniteLoop>
                    {product.imagePaths.map((imagePath, index) => (
                        <div key={index}>
                            <img src={imagePath} alt="Example Image" />
                        </div>
                    ))}
                </Carousel>
                <div className="product-info">
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Color:</strong> {product.color}</p>
                    <p><strong>Gear:</strong> {product.gear}</p>
                    <p><strong>Make:</strong> {product.make}</p>
                    <p><strong>Model:</strong> {product.model}</p>
                    <p><strong>Year:</strong> {product.year}</p>
                </div>
                <button className="add-to-cart-button" onClick={addToCart}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductDetailPage;
