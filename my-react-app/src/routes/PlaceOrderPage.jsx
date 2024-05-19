import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './stylePlaceOrderPage.css';
import Cookies from 'js-cookie';

const PlaceOrderPage = () => {
    const [cart, setCart] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [notes, setNotes] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    
    const userCookie = Cookies.get('userInfo');

    useEffect(() => {
        if (userCookie) {
            try {
                const parsedUserInfo = JSON.parse(userCookie);
                setUserInfo(parsedUserInfo);
            } catch (error) {
                console.error("Error parsing user info:", error);
            }
        }
    }, [userCookie]);

    useEffect(() => {
        const fetchCart = async () => {
            if (userInfo) {
                try {
                    const response = await axios.get(`http://localhost:3001/v1/api/cart/user/${userInfo.userId}`, { withCredentials: true });
                    setCart(response.data.productIds);
                    
                    fetchProducts(response.data.productIds);
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            }
        };

        const fetchProducts = async (productIds) => {
            try {
                const productDetails = await Promise.all(productIds.map(id => axios.get(`http://localhost:3001/v1/api/Product/${id}`)));
                setProducts(productDetails.map(response => response.data));
                const totalPrice = productDetails.reduce((total, product) => total + product.data.price, 0);
                setTotalPrice(totalPrice);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        if (userInfo) {
            fetchCart();
        }
    }, [userInfo]);

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };

    const placeOrder = async () => {
        if (!userInfo || cart.length === 0) {
            alert('User not logged in or cart is empty.');
            return;
        }

        try {
            const { userId } = userInfo;
            const response2 = await axios.get(`http://localhost:3001/v1/api/cart/user/${userInfo.userId}`, { withCredentials: true });
            const response = await axios.post('http://localhost:3001/v1/api/addOrder', {
            userId: userId,
             productIds: cart,
            datetime: new Date().toISOString(),
            notes: notes,
            total: totalPrice}, { withCredentials: true });

            if (response.status === 201 || response.status === 200) {
                alert('Order placed successfully!');
                const cartID=response2.data._id;
                axios.delete(`http://localhost:3001/v1/api/cart/${cartID}`)
                setCart([]);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order.');
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="place-order-container">
            <h2>Place Your Order</h2>
            <div className="cart-items">
                {products.map((product) => (
                    <div key={product._id} className="cart-item">
                        <img src={product.imagePaths[0]} alt={product.name} />
                        <div className="cart-item-info">
                            <h3>{product.name}</h3>
                            <p>Price: ${product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="order-summary">
                <textarea
                    placeholder="Add notes (optional)"
                    value={notes}
                    onChange={handleNotesChange}
                />
                <p>Total Price: ${totalPrice}</p>
            </div>
            <button className="place-order-button" onClick={placeOrder}>Place Order</button>
        </div>
    );
};

export default PlaceOrderPage;
