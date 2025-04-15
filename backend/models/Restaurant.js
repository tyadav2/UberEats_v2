const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  cuisine: { type: String, required: true, maxlength: 50 },
  category: { type: String, required: true, maxlength: 50 },
  location: { type: String, required: true, maxlength: 100 },
  address: { type: String, required: true, maxlength: 255 },
  phone_number: { type: String, required: true, maxlength: 20 },
  email: { type: String, required: true, unique: true, maxlength: 100 },
  password: { type: String, required: true },
  description: { type: String, required: true },
  business_hours: { type: String, required: true, maxlength: 255 },
  rating: { type: Number, default: 0.0 },
  image_url: { type: String, maxlength: 255 },
  price_range: { type: String, enum: ["$", "$$", "$$$"], default: "$" },
  delivery_time: { type: String, required: true, maxlength: 20 },
  is_open: { type: Boolean, default: true }
}, {
  timestamps: false 
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;

