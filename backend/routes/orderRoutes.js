const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrderById,
  getUserOrders
} = require('../controllers/orderController');

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, getUserOrders);
router.route('/:id').get(protect, getOrderById);

module.exports = router;
