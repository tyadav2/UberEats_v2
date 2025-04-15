const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  }
});

const Dish = mongoose.model("Dish", dishSchema);
module.exports = Dish;
