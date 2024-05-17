import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CreateOrder = () => {
    const [datetime, setDatetime] = useState('');
    const [notes, setNotes] = useState('');
    const [total, setTotal] = useState(0);

    const userInfo = JSON.parse(Cookies.get('userInfo'));
    const userId = userInfo.id;
    const cart = {
        userId: "663e27c0a653faacaf62a324",
        productIds: ["6647240990c0e1faec2f7161", "664742b8988354ccacf2141e"]
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/api/orders/addOrder', {
                userId: cart.userId,
                productIds: cart.productIds,
                datetime,
                notes,
                total
            });

            console.log('Order created:', response.data);
        } catch (error) {
            console.error('Error creating order:', error.response?.data || error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Date and Time:</label>
                <input
                    type="datetime-local"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                />
            </div>
            <div>
                <label>Notes:</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
            <div>
                <label>Total:</label>
                <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                />
            </div>
            <button type="submit">Create Order</button>
        </form>
    );
};

export default CreateOrder;