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

    if (decoded.role === "restaurant") {
      const restaurant = await Restaurant.findById(decoded.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
      req.restaurant = restaurant;
    }
     else if (decoded.role === "user") {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;

    } else {
      return res.status(403).json({ message: "Invalid token role" });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(403).json({ message: "Invalid token" });
  }
};

const protectOrderAccess = (req, res, next) => {
  if (!req.user && !req.restaurant) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
};

module.exports = { protect, protectOrderAccess };