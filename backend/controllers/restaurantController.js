const Restaurant = require("../models/Restaurant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Restaurant signup
exports.registerRestaurant = async (req, res) => {
  const {
    name,
    cuisine,
    category,
    location,
    address,
    phone_number,
    email,
    password,
    description,
    business_hours,
    price_range,
    delivery_time,
    image_url,
    rating,
    is_open
  } = req.body;

  console.log("Received Signup Data:", req.body);

  try {
    if (
      !name || !cuisine || !category || !location || !address ||
      !phone_number || !email || !password || !description ||
      !business_hours || !price_range || !delivery_time
    ) {
      return res.status(400).json({ message: "All required fields must be provided!" });
    }

    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRestaurant = new Restaurant({
      name,
      cuisine,
      category,
      location,
      address,
      phone_number,
      email,
      password: hashedPassword,
      description,
      business_hours,
      price_range,
      delivery_time,
      image_url: image_url || null,
      rating: rating !== undefined ? rating : 0.0,
      is_open: is_open !== undefined ? is_open : true
    });

    await newRestaurant.save();

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant: newRestaurant
    });

  } catch (error) {
    console.error("Error registering restaurant:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Restaurant login
exports.loginRestaurant = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const restaurant = await Restaurant.findOne({ email });
      if (!restaurant) return res.status(400).json({ message: "Restaurant not found" });
  
      const isMatch = await bcrypt.compare(password, restaurant.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      //const token = jwt.sign({ id: restaurant._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const token = jwt.sign(
        { id: restaurant._id, role: "restaurant" },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      res.json({
        message: "Restaurant logged in",
        token,
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          category: restaurant.category,
          location: restaurant.location,
          address: restaurant.address,
          phone_number: restaurant.phone_number,
          email: restaurant.email,
          description: restaurant.description,
          business_hours: restaurant.business_hours,
          rating: restaurant.rating,
          image_url: restaurant.image_url,
          price_range: restaurant.price_range,
          delivery_time: restaurant.delivery_time,
          is_open: restaurant.is_open
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Get Restaurant Profile
exports.getRestaurantProfile = async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.restaurant.id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Error fetching restaurant profile" });
    }
  };
  

// Update Restaurant Profile
exports.updateRestaurantProfile = async (req, res) => {
    try {
      if (!req.restaurant) {
        return res.status(401).json({ message: "Not authorized, token failed" });
      }
  
      const updates = {
        ...req.body
      };
  
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        req.restaurant.id,
        { $set: updates },
        { new: true }
      );
  
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      res.json({ message: "Profile updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
      console.error("Update Profile Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  exports.getRestaurantById = async (req, res) => {
    try {
      console.log("Fetching restaurant with ID:", req.params.id);
  
      const restaurant = await Restaurant.findById(req.params.id);
  
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      res.json(restaurant);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
