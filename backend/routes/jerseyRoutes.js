const express = require('express');
const { createJersey, getJerseys, getJerseyById, updateJersey, deleteJersey } = require('../controllers/jerseyController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getJerseys)                             // GET /api/jerseys
  .post(protect, admin, createJersey);         // POST /api/jerseys (protected, admin only)

router.route('/:id')
  .get(getJerseyById)                          // GET /api/jerseys/:id
  .put(protect, admin, updateJersey)           // PUT /api/jerseys/:id (protected, admin only)
  .delete(protect, admin, deleteJersey);       // DELETE /api/jerseys/:id (protected, admin only)

module.exports = router;
