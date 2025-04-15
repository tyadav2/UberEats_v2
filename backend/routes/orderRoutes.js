const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getUserOrders,
    getRestaurantOrders,
    createOrder,
    updateOrderStatus,
    cancelOrder
} = require("../controllers/orderController");

// Route to Place a New Order (Customer Only)
router.post("/", protect, createOrder);

// Route to Get Orders for the Logged-in Customer
router.get("/", protect, getUserOrders);

// Route to Get Orders for a Restaurant
router.get("/restaurant", protect, getRestaurantOrders);

// Route to Update Order Status (Restaurant Only)
router.put("/:orderId", protect, updateOrderStatus);

// Customer cancels an order
router.patch("/:orderId", protect, cancelOrder);

module.exports = router;
