import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Cart.css'; // Import the CSS file for styling

const Cart = () => {
  const { state, dispatch } = useCart(); // Access cart state and dispatch from CartContext
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  // Update isLoggedIn state based on localStorage changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleRemoveFromCart = (item) => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      setTimeout(() => setShowLoginRequired(false), 3000); // Hide message after 3 seconds
      return;
    }

    dispatch({ type: 'REMOVE_FROM_CART', payload: item }); // Dispatch REMOVE_FROM_CART action
  };

  const handleClearCart = () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      setTimeout(() => setShowLoginRequired(false), 3000); // Hide message after 3 seconds
      return;
    }

    dispatch({ type: 'CLEAR_CART' }); // Dispatch CLEAR_CART action
  };

  // Aggregate identical jerseys in the cart
  const aggregateCartItems = () => {
    const itemMap = new Map();
    state.cart.forEach(item => {
      let price = item.price;
  
      // Ensure price is a number
      if (typeof price === 'string') {
        price = Number(price.replace('₹', ''));
      } else if (typeof price === 'number') {
        // If price is already a number, use it directly
        price = Number(price);
      } else {
        console.warn(`Unexpected price format for item ${item.id}`);
        return;
      }
  
      if (itemMap.has(item.id)) {
        const existingItem = itemMap.get(item.id);
        existingItem.quantity += 1;
        existingItem.totalPrice += price;
      } else {
        itemMap.set(item.id, { ...item, quantity: 1, totalPrice: price });
      }
    });
    return Array.from(itemMap.values());
  };
  

  const aggregatedItems = aggregateCartItems();
  const totalAmount = aggregatedItems.reduce((total, item) => total + item.totalPrice, 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {showLoginRequired && (
        <div className="login-required-popup">Login required to modify cart</div>
      )}
      {aggregatedItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-items">
          {aggregatedItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>Price: ₹{item.price}</p>
                <p>Size: {item.size}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-actions">
            <button onClick={handleClearCart} className="btn btn-warning">
              Clear Cart
            </button>
            <div className="cart-total">
              <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
            </div>
            <Link to="/checkout">
              <button className="btn btn-primary">Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;