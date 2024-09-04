import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios'; // Make sure to import axios
import './CheckoutPage.css'; // Import the CSS file for styling

const CheckoutPage = () => {
  const { state, dispatch } = useCart(); // Assuming you have a dispatch method to clear the cart
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '', // Replaced state with country
    postalCode: '',
    paymentMethod: 'Cash on Delivery'
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aggregate cart items
    const aggregateCartItems = () => {
      const itemMap = new Map();
      state.cart.forEach(item => {
        // Ensure item.price is a string and convert to number
        const priceString = typeof item.price === 'string' ? item.price : item.price.toString();
        const price = parseFloat(priceString.replace('₹', '').replace(',', '').trim()); // Convert to number
        
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
    const totalAmount = aggregatedItems.reduce((acc, item) => acc + item.totalPrice, 0);

    try {
      // Make an API request to place the order
      const response = await axios.post('http://localhost:5000/api/orders', {
        orderItems: aggregatedItems.map(item => ({
          jersey: item.id,
          qty: item.quantity,
          price: item.totalPrice
        })),
        totalPrice: totalAmount,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country // Include country in the request
        },
        paymentMethod: formData.paymentMethod
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        setOrderPlaced(true);
        // Optionally, clear the cart
        dispatch({ type: 'CLEAR_CART' });
      } else {
        throw new Error('Order could not be placed.');
      }
    } catch (err) {
      setError('Failed to place the order.');
      console.error('Error details:', err.response?.data || err.message || err);
    }
  };

  // Define aggregateCartItems function here
  const aggregateCartItems = () => {
    const itemMap = new Map();
    state.cart.forEach(item => {
      // Ensure item.price is a string and convert to number
      const priceString = typeof item.price === 'string' ? item.price : item.price.toString();
      const price = parseFloat(priceString.replace('₹', '').replace(',', '').trim()); // Convert to number
      
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
  const totalAmount = aggregatedItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {orderPlaced ? (
        <div className="order-placed-message">Order placed successfully!</div>
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="checkout-form">
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
            <div className="form-group">
              <label>Payment Method</label>
              <p>{formData.paymentMethod}</p>
            </div>
            <div className="order-summary">
              <h3>Order Summary</h3>
              <ul>
                {aggregatedItems.map(item => (
                  <li key={item.id}>
                    <div>{item.name}</div>
                    <div>Quantity: {item.quantity}</div>
                    <div>Price: ₹{item.totalPrice.toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="total-amount">
                <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Place Order</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
