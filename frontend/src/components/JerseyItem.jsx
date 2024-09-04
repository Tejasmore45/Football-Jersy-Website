import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './JerseyItem.css';

const JerseyItem = ({ id, name, price, description, imageUrl }) => {
  const { dispatch } = useCart();
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  const addToCart = () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      setTimeout(() => {
        setShowLoginRequired(false);
        window.location.href = '/login'; // Redirect to login page
      }, 3000); // Hide message after 3 seconds and redirect
      return;
    }

    // If logged in, add item to cart
    const jersey = { id, name, price, description, imageUrl };
    dispatch({ type: 'ADD_TO_CART', payload: jersey });
  };

  return (
    <div className="jersey-card">
      <img
        src={imageUrl}
        alt={name}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300'; // Larger placeholder image
        }}
        className="jersey-card-image"
      />
      <div className="jersey-card-content">
        <h2 className="jersey-card-title">{name}</h2>
        <p className="jersey-card-price">₹{price}</p>
        <p className="jersey-card-description">{description}</p>
        <button className="btn btn-primary" onClick={addToCart}>
          Add to Cart
        </button>
        {showLoginRequired && (
          <div className="login-required-message">
            Login required to add to cart
          </div>
        )}
      </div>
    </div>
  );
};

export default JerseyItem;
