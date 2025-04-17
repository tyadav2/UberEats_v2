import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";

const RestaurantPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // Function to fetch restaurant details and dishes
  useEffect(() => {
    const fetchRestaurantAndDishes = async () => {
      try {
        setLoading(true);

        // Fetch restaurant details
        const restaurantResponse = await axios.get(
          `http://localhost:5000/api/restaurants/${restaurantId}`
        );
        setRestaurant(restaurantResponse.data);

        // Fetch dishes for the restaurant
        const dishesResponse = await axios.get(
          `http://localhost:5000/api/dishes/restaurant/${restaurantId}`
        );
        setDishes(dishesResponse.data);

        console.log("Dishes API Response:", dishesResponse.data); // Debugging

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
        setLoading(false);
      }
    };

    fetchRestaurantAndDishes();
  }, [restaurantId]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Helper function to update cart in both state and localStorage
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Function to add items to cart
  const addToCart = (dish) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex((item) => item._id === dish._id);

    if (existingItemIndex >= 0) {
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart.push({ ...dish, quantity: 1 });
    }

    updateCart(updatedCart);
  };

  // Function to reduce quantity in cart
  const removeFromCart = (dish) => {
    const updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex((item) => item._id === dish._id);

    if (existingItemIndex >= 0) {
      if (updatedCart[existingItemIndex].quantity > 1) {
        updatedCart[existingItemIndex].quantity -= 1;
      } else {
        // Remove item completely if quantity becomes 0
        updatedCart.splice(existingItemIndex, 1);
      }
      updateCart(updatedCart);
    }
  };

  // Function to get quantity of item in cart
  const getItemQuantity = (dishId) => {
    const item = cart.find(item => item._id === dishId);
    return item ? item.quantity : 0;
  };

  // If loading, show loader
  if (loading) return (
    <div>
      <DashboardNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    </div>
  );

  // If error, show error message
  if (error) return (
    <div>
      <DashboardNavbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      {/* Hero Section */}
      <div className="relative w-full h-96 mt-16">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ 
            backgroundImage: restaurant?.image_url 
              ? `url(${restaurant.image_url})` 
              : "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80')"
          }}
        ></div>
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            {restaurant?.name || "Restaurant"}
          </h1>
          <div className="bg-white/90 px-6 py-3 rounded-lg max-w-xl">
            <p className="text-gray-800 text-lg">
              {restaurant?.description || "No description available"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        {/* Cart Button*/}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => navigate("/cart")}
            className="bg-green-500 text-white px-5 py-3 rounded-full hover:bg-green-600 shadow-lg flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <span className="text-xl">🛒</span>
            <span className="font-medium">
              {cart.length > 0 && cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </button>
        </div>

        {/* Menu Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-green-500 pb-2">Our Menu</h2>
            <div className="flex items-center space-x-2 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium">{dishes.length} items</span>
            </div>
          </div>

          {dishes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 mt-4 text-lg">No dishes available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dishes.map((dish) => (
                <div
                  key={dish._id}
                  className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    {dish.image ? (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg font-bold">
                      ${Number(dish.price).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{dish.name}</h3>
                    <p className="text-gray-600 mb-4 h-12 overflow-hidden">{dish.ingredients}</p>
                    
                    {getItemQuantity(dish._id) > 0 ? (
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-2">
                        <button
                          onClick={() => removeFromCart(dish)}
                          className="text-black-700 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                        >
                          -
                        </button>
                        <span className="text-blue-800 font-medium">
                          {getItemQuantity(dish._id)}
                        </span>
                        <button
                          onClick={() => addToCart(dish)}
                          className="text-blue-700 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 transition"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(dish)}
                        className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPage;