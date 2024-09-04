import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyOrdersPage.css'; // Import the CSS file for styling

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://football-jersy-website-backend.onrender.com/api/orders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log("Fetched orders:", response.data); // Log response data
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error("Fetch error:", err); // Log error
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order._id} className="order-item">
            <h2>Order ID: {order._id}</h2>
            <p>Total Price: ₹{order.totalPrice}</p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <Link to={`/orders/${order._id}`}>
              <button className="view-details-button">View Details</button>
            </Link>
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default MyOrdersPage;
