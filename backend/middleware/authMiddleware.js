const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

const protect = async (req, res, next) => {
  let token = req.header("Authorization");

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id); //Mongoose
    const restaurant = await Restaurant.findById(decoded.id); //Mongoose

    if (user) {
      req.user = user;
    } else if (restaurant) {
      req.restaurant = restaurant;
    } else {
      return res.status(404).json({ message: "User or Restaurant not found" });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(403).json({ message: "Invalid token" });
  }
};

const protectOrderAccess = async (req, res, next) => {
  const { user, restaurant } = req;

  if (!user && !restaurant) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  next();
};

module.exports = { protect, protectOrderAccess };
