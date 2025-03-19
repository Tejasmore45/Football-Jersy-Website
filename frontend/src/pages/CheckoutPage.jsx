import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css'; // Import CSS for styling

const CheckoutPage = () => {
  const { state, dispatch } = useCart(); // Access cart state and dispatch
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery'
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Aggregate cart items
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
    const totalAmount = aggregatedItems.reduce((acc, item) => acc + item.totalPrice, 0);

    try {
      // Debug log the data we're sending
      const orderData = {
        orderItems: aggregatedItems.map(item => ({
          jersey: item._id || item.id, // Try both possible ID formats
          qty: item.quantity,
          price: parseFloat(item.totalPrice)
        })),
        totalPrice: parseFloat(totalAmount),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        taxPrice: 0,
        shippingPrice: 0
      };
      
      console.log('Sending order data:', orderData);
      
      const response = await axios.post(
        'https://football-jersy-website-backend.onrender.com/api/orders',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 201) {
        setOrderPlaced(true);
        dispatch({ type: 'CLEAR_CART' }); // Clear cart after successful order
        // Redirect to orders page after 2 seconds
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        throw new Error('Order could not be placed.');
      }
    } catch (err) {
      setError('Failed to place the order. ' + (err.response?.data?.message || err.message || ''));
      console.error('Error details:', err.response?.data || err.message || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const aggregatedItems = state.cart.reduce((acc, item) => {
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

    const existingItem = acc.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice += price;
    } else {
      acc.push({ ...item, quantity: 1, totalPrice: price });
    }

    return acc;
  }, []);

  const totalAmount = aggregatedItems.reduce((acc, item) => acc + item.totalPrice, 0);

  // Check if cart is empty
  if (aggregatedItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-container empty-checkout">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before checkout.</p>
        <button className="btn btn-primary" onClick={() => navigate('/jerseys')}>
          Browse Jerseys
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {orderPlaced ? (
        <div className="order-placed-message">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
            </div>
          </div>
          <p>Order placed successfully!</p>
          <p>Redirecting to your orders...</p>
        </div>
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {aggregatedItems.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-name">{item.name} (x{item.quantity})</div>
                  <div className="summary-item-price">₹{item.totalPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <div>Total</div>
              <div>₹{totalAmount.toFixed(2)}</div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            <h3>Shipping Information</h3>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className={`btn ${isSubmitting ? 'btn-loading' : 'btn-primary'}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  <span className="loading-text">Processing...</span>
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
