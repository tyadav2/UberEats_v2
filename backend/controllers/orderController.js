const Order = require("../models/Order");
const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");

// Get Orders for Logged-in Customer
exports.getUserOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Access denied: Not a customer" });
    }

    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const itemsWithNames = await Promise.all(
          order.items.map(async (item) => {
            const dish = await Dish.findById(item.dishId);
            return {
              dishId: item.dishId,
              dishName: dish ? dish.name : "Unknown Dish",
              quantity: item.quantity
            };
          })
        );

        return {
          ...order.toObject(),
          items: itemsWithNames
        };
      })
    );

    res.json(enrichedOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Orders for a Restaurant
exports.getRestaurantOrders = async (req, res) => {
    try {
      if (!req.restaurant) {
        return res.status(403).json({ message: "Access denied: Not a restaurant" });
      }
  
      const filter = { restaurantId: req.restaurant.id };
      if (req.query.status) filter.status = req.query.status;
  
      const orders = await Order.find(filter).sort({ createdAt: -1 });
  
      if (!orders.length) {
        return res.status(404).json({ message: "No orders found" });
      }
  
      res.json(orders);
    } catch (error) {
      console.error("Error fetching restaurant orders:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
// Create a New Order
exports.createOrder = async (req, res) => {
    try {
      const { restaurantId, totalAmount, items, paymentMethod, deliveryAddress } = req.body;
  
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      const itemsWithNames = await Promise.all(
        items.map(async (item) => {
          const dish = await Dish.findById(item.dishId);
          return {
            dishId: item.dishId,
            dishName: dish ? dish.name : "Unknown Dish",
            quantity: item.quantity
          };
        })
      );
  
      const newOrder = new Order({
        userId: req.user.id,
        userEmail: req.user.email,
        restaurantId,
        restaurantName: restaurant.name,
        totalAmount,
        status: "New",
        estimatedDeliveryTime: "30 min",
        paymentMethod,
        items: itemsWithNames,
        deliveryAddress
      });
  
      await newOrder.save();
  
      res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
      console.error("Error in order creation:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
// Update Order Status (Restaurant Only)
exports.updateOrderStatus = async (req, res) => {
    try {
      if (!req.restaurant) {
        return res.status(403).json({ error: "Only restaurants can update orders" });
      }
  
      const { orderId } = req.params;
      const { status } = req.body;
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      order.status = status;
      await order.save();
  
      res.json({ message: "Order status updated successfully", order });
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

// Cancel an Order
exports.cancelOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      if (order.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized: You can only cancel your own orders." });
      }
  
      if (!["Pending", "Preparing", "New"].includes(order.status)) {
        return res.status(400).json({ message: "Order cannot be canceled once delivered." });
      }
  
      order.status = "Cancelled";
      await order.save();
  
      res.json({ message: "Order cancelled successfully" });
    } catch (error) {
      console.error("Error canceling order:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
