import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import DashboardNavbar from '../components/DashboardNavbar';
import { useNavigate } from 'react-router-dom';


function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("customerToken"));

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRestaurants(response.data);
      const favIds = new Set(response.data.map(restaurant => restaurant._id));
      setFavorites(favIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (e, restaurantId) => {
    e.stopPropagation(); // Prevent navigation to restaurant details
    
    try {
      if (favorites.has(restaurantId)) {
        // Remove from favorites
        await axios.delete(`http://localhost:5000/api/favorites/${restaurantId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(restaurantId);
          return newFavorites;
        });
      } else {
        // Add to favorites
        await axios.post('http://localhost:5000/api/favorites', 
          { restaurantId },
          { 
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.add(restaurantId);
          return newFavorites;
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // If unauthorized, redirect to login
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />
      
      <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Your Favorite Restaurants
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={restaurant.image_url || 'default-restaurant-image.jpg'}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={(e) => toggleFavorite(e, restaurant._id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md"
                >
                  <FaHeart 
                    className={`text-xl ${
                      favorites.has(restaurant._id) 
                        ? 'text-red-500' 
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 mt-1">{restaurant.cuisine}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-gray-600">
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-600">
                    {restaurant.delivery_time}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{restaurant.price_range}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
