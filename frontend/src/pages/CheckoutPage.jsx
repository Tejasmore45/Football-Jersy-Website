import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios'; // Import axios
import './CheckoutPage.css'; // Import CSS for styling

const CheckoutPage = () => {
  const { state, dispatch } = useCart(); // Access cart state and dispatch
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
        const priceString = typeof item.price === 'string' ? item.price : item.price.toString();
        const price = parseFloat(priceString.replace('₹', '').replace(',', '').trim());

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
      const response = await axios.post(
        'https://football-jersy-website-backend.onrender.com/api/orders',
        {
          orderItems: aggregatedItems.map(item => ({
            jersey: item._id,
            qty: item.quantity,
            price: item.totalPrice
          })),
          totalPrice: totalAmount,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
          },
          paymentMethod: formData.paymentMethod
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 201) {
        setOrderPlaced(true);
        dispatch({ type: 'CLEAR_CART' }); // Clear cart after successful order
      } else {
        throw new Error('Order could not be placed.');
      }
    } catch (err) {
      setError('Failed to place the order.');
      console.error('Error details:', err.response?.data || err.message || err);
    }
  };

  const aggregatedItems = state.cart.reduce((acc, item) => {
    const priceString = typeof item.price === 'string' ? item.price : item.price.toString();
    const price = parseFloat(priceString.replace('₹', '').replace(',', '').trim());

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
            <div className="order-summary">
              <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
            </div>
            <button type="submit" className="btn btn-primary">Place Order</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
