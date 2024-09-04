import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OrderDetailsPage.css'; // Import the CSS file for styling

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`https://football-jersy-website-backend.onrender.com/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data) {
          setOrder(response.data);
        } else {
          throw new Error('Order data is missing');
        }
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="order-details-container">
      <h1>Order Details</h1>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      <p><strong>Shipping Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
      <h2>Items</h2>
      <ul>
        {order.orderItems && order.orderItems.length > 0 ? (
          order.orderItems.map(item => (
            <li key={item._id} className="order-item">
              <p><strong>Jersey ID:</strong> {item.jersey}</p>
              <p><strong>Quantity:</strong> {item.qty}</p>
              <p><strong>Price:</strong> ₹{item.price}</p>
            </li>
          ))
        ) : (
          <li>No items found</li>
        )}
      </ul>
    </div>
  );
};

export default OrderDetailsPage;
