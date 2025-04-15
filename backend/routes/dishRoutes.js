const express = require("express");
const router = express.Router();
const { addDish, updateDish, deleteDish, getDishes, getDishesByRestaurantId, getDishById} = require("../controllers/dishController");
const { getAllDishes } = require("../controllers/dishController");
const { protect } = require("../middleware/authMiddleware");

// Route to add a new dish
router.post("/", protect, addDish);

// Update an existing dish (Restaurant Only)
router.put("/:id", protect, updateDish);

// Delete a dish (Restaurant Only)
router.delete("/:id", protect, deleteDish);

router.get("/", protect, getDishes);

// Public route to get all dishes (no token required)
router.get("/public", getAllDishes);

// Public route to get dishes by restaurant ID
router.get("/restaurant/:restaurantId", getDishesByRestaurantId);

// Route to get dish details by ID
router.get("/:id", getDishById);


module.exports = router;