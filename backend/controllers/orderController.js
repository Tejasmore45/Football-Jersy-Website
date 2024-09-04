const Order = require('../models/Order');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;
    
    // Create a new order instance
    const order = new Order({
      user: req.user._id,  // Reference to the logged-in user
      orderItems,          // Array of order items
      shippingAddress,     // Shipping details
      paymentMethod,       // Payment method chosen by user
      taxPrice,            // Calculated tax price
      shippingPrice,       // Calculated shipping price
      totalPrice           // Total price including tax and shipping
    });
    
    // Save the order to the database
    const createdOrder = await order.save();
    
    // Return the created order with a 201 status
    res.status(201).json(createdOrder);
  } catch (error) {
    // Handle errors and send a 400 status with error message
    res.status(400).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    // Find the order by ID and populate the user field with name and email
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      // If the order is not found, return a 404 status with a message
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Return the order details
    res.json(order);
  } catch (error) {
    // Handle errors and send a 400 status with error message
    res.status(400).json({ message: error.message });
  }
};

// Get orders of the logged-in user
const getUserOrders = async (req, res) => {
  try {
    // Find all orders for the logged-in user
    const orders = await Order.find({ user: req.user._id });
    
    // Log the fetched orders data for debugging
    console.log('Backend Orders Data:', orders);
    
    // Return the orders
    res.json(orders);
  } catch (error) {
    // Handle errors and send a 400 status with error message
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrderById, getUserOrders };
