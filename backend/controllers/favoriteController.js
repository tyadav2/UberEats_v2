const Favorite = require("../models/Favorite");
const Restaurant = require("../models/Restaurant");

// Add a restaurant to favorites
exports.addFavorite = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Only customers can mark favorites" });
    }

    const { restaurantId } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const existing = await Favorite.findOne({
      userId: req.user.id,
      restaurantId
    });

    if (existing) {
      return res.status(400).json({ message: "Restaurant already marked as favorite" });
    }

    const favorite = new Favorite({
      userId: req.user.id,
      restaurantId
    });

    await favorite.save();

    res.status(201).json({ message: "Restaurant added to favorites", favorite });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Get a customer's favorite restaurants
exports.getFavorites = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Only customers can view favorites" });
    }

    const favorites = await Favorite.find({ userId: req.user.id });

    const favoriteRestaurants = await Promise.all(
      favorites.map(async (fav) => {
        const restaurant = await Restaurant.findById(fav.restaurantId);
        return restaurant;
      })
    );

    res.json(favoriteRestaurants);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Remove a restaurant from favorites
exports.removeFavorite = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Only customers can remove favorites" });
    }

    const { restaurantId } = req.params;

    const favorite = await Favorite.findOne({
      userId: req.user.id,
      restaurantId
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }

    await Favorite.findByIdAndDelete(favorite._id);

    res.json({ message: "Restaurant removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Server error" });
  }
};

