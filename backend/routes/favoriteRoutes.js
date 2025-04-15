const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const { addFavorite,getFavorites, removeFavorite} = require("../controllers/favoriteController");

// Add a restaurant to favorites
router.post('/', protect, addFavorite);

// Remove a restaurant from favorites
router.delete('/:restaurantId', protect, removeFavorite);

// Get all favorite restaurants for a user
router.get('/', protect, getFavorites);

module.exports = router;