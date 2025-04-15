const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userEmail: { type: String, required: true, maxlength: 100 },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  restaurantName: { type: String, required: true, maxlength: 100 },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pick Up Ready", "Preparing", "Delivered", "On the way", "Cancelled", "New"],
    default: "New"
  },
  estimatedDeliveryTime: { type: String },
  deliveryAddress: { type: String }, // optional for pickup
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Cash", "Online"],
    required: true
  },
  items: { type: Array, required: true }, 
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: false
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
