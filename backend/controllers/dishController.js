const Dish = require("../models/Dish");

// add a dish
exports.addDish = async (req, res) => {
  try {
    const { name, ingredients, image, price, description, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    const restaurantId = req.restaurant ? req.restaurant.id : null;
    if (!restaurantId) {
      return res.status(401).json({ message: "Unauthorized: No restaurant identified" });
    }

    const dish = new Dish({
      name,
      ingredients,
      image,
      price,
      description,
      category,
      restaurantId
    });

    await dish.save();

    res.status(201).json({ message: "Dish added successfully", dish });
  } catch (error) {
    console.error("Error adding dish:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// update a dish
exports.updateDish = async (req, res) => {
  try {
    const dishId = req.params.id;
    const { name, ingredients, image, price, description, category } = req.body;

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    if (dish.restaurantId.toString() !== req.restaurant.id) {
      return res.status(403).json({ message: "You are not authorized to update this dish" });
    }

    dish.name = name || dish.name;
    dish.ingredients = ingredients || dish.ingredients;
    dish.image = image || dish.image;
    dish.price = price || dish.price;
    dish.description = description || dish.description;
    dish.category = category || dish.category;

    await dish.save();

    res.json({ message: "Dish updated successfully", dish });
  } catch (error) {
    console.error("Error updating dish:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete a dish
exports.deleteDish = async (req, res) => {
  try {
    const dishId = req.params.id;
    const dish = await Dish.findById(dishId);

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    if (dish.restaurantId.toString() !== req.restaurant.id) {
      return res.status(403).json({ message: "You are not authorized to delete this dish" });
    }

    await Dish.findByIdAndDelete(dishId);

    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Only for authenticated restaurants:
exports.getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ restaurantId: req.restaurant.id });
    return res.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

  
// For public access:
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    return res.json(dishes);
  } catch (error) {
    console.error("Error fetching all dishes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDishesByRestaurantId = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    console.log("Fetching dishes for restaurant ID:", restaurantId);

    const dishes = await Dish.find({ restaurantId });
    console.log("Dishes found:", dishes);

    return res.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDishById = async (req, res) => {
  try {
    const dishId = req.params.id;
    const dish = await Dish.findById(dishId);

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.json(dish);
  } catch (error) {
    console.error("Error fetching dish:", error);
    res.status(500).json({ message: "Server error" });
  }
};


  

  
  
  
  
