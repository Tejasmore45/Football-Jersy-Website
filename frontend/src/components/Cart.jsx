import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Cart.css'; // Import the CSS file for styling

const Cart = () => {
  const { state, dispatch } = useCart(); // Access cart state and dispatch from CartContext
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [isRemoving, setIsRemoving] = useState(null);
  const [isClearing, setIsClearing] = useState(false);

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

    setIsRemoving(item._id);
    
    // Simulate a slight delay for loading effect
    setTimeout(() => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: state.cart.find(c => c._id === item._id) }); // Dispatch REMOVE_FROM_CART action
      setIsRemoving(null);
    }, 300);
  };

  const handleClearCart = () => {
    if (!isLoggedIn) {
      setShowLoginRequired(true);
      setTimeout(() => setShowLoginRequired(false), 3000); // Hide message after 3 seconds
      return;
    }

    setIsClearing(true);
    
    // Simulate a slight delay for loading effect
    setTimeout(() => {
      dispatch({ type: 'CLEAR_CART' }); // Dispatch CLEAR_CART action
      setIsClearing(false);
    }, 500);
  };

  // Aggregate identical jerseys in the cart
  const aggregateCartItems = () => {
    const itemMap = new Map();
    state.cart.forEach(item => {
      // Ensure price is a number
      let price = 0;
      if (typeof item.price === 'string') {
        // Remove currency symbol and convert to number
        price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      } else if (typeof item.price === 'number') {
        price = item.price;
      }
      
      if (isNaN(price)) {
        price = 0;
        console.warn(`Invalid price format for item ${item._id}`);
      }

      if (itemMap.has(item._id)) {
        const existingItem = itemMap.get(item._id);
        existingItem.quantity += 1;
        existingItem.totalPrice += price;
      } else {
        itemMap.set(item._id, { ...item, quantity: 1, totalPrice: price });
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
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/jerseys">
            <button className="btn btn-primary">Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="cart-items">
          {aggregatedItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>Price: ₹{item.price}</p>
                <p>Size: {item.size}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className={`btn ${isRemoving === item._id ? 'btn-loading' : 'btn-danger'}`}
                  disabled={isRemoving === item._id}
                >
                  {isRemoving === item._id ? (
                    <span className="btn-spinner"></span>
                  ) : (
                    'Remove'
                  )}
                </button>
              </div>
            </div>
          ))}
          <div className="cart-actions">
            <button 
              onClick={handleClearCart} 
              className={`btn ${isClearing ? 'btn-loading' : 'btn-warning'}`}
              disabled={isClearing}
            >
              {isClearing ? (
                <span className="btn-spinner"></span>
              ) : (
                'Clear Cart'
              )}
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
