const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const { loginRestaurant, registerRestaurant, getRestaurantProfile, updateRestaurantProfile, getRestaurantById } = require("../controllers/restaurantController");
const { protect } = require("../middleware/authMiddleware");

// GET all restaurants
router.get("/", async (req, res) => {
    try {
        console.log(req.headers);
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/signup", registerRestaurant)

// New route for restaurant login
router.post("/login", loginRestaurant);

//router.post("/signup", registerRestaurant);
router.get("/profile", protect, getRestaurantProfile);
router.put("/profile", protect, updateRestaurantProfile);

// getting restaurant by id
router.get("/:id", getRestaurantById);

module.exports = router;
