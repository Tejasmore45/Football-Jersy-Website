import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './JerseyItem.css';

const JerseyItem = ({ id, name, price, description, imageUrl, size = "M" }) => {
  const { dispatch } = useCart();
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  // Clear the added to cart message after 3 seconds
  useEffect(() => {
    let timer;
    if (addedToCart) {
      timer = setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [addedToCart]);

  const addToCart = () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      setTimeout(() => {
        setShowLoginRequired(false);
        window.location.href = '/login'; // Redirect to login page
      }, 3000); // Hide message after 3 seconds and redirect
      return;
    }

    // Show loading state
    setIsLoading(true);

    // Simulate a slight delay for loading effect
    setTimeout(() => {
      // If logged in, add item to cart
      const jersey = { _id: id, name, price, description, imageUrl, size };
      dispatch({ type: 'ADD_TO_CART', payload: jersey });
      setIsLoading(false);
      setAddedToCart(true);
    }, 500);
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
        <p className="jersey-card-size">Size: {size}</p>
        <button 
          className={`btn ${isLoading ? 'btn-loading' : 'btn-primary'}`} 
          onClick={addToCart}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="btn-spinner"></span>
          ) : (
            'Add to Cart'
          )}
        </button>
        {showLoginRequired && (
          <div className="login-required-message">
            Login required to add to cart
          </div>
        )}
        {addedToCart && (
          <div className="added-to-cart-message">
            Item added to cart!
          </div>
        )}
      </div>
    </div>
  );
};

export default JerseyItem;
