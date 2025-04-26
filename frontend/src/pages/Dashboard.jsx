import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import DashboardNavbar from '../components/DashboardNavbar';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaStar, FaClock, FaMotorcycle } from 'react-icons/fa';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [favorites, setFavorites] = useState(new Set()); 
  const [sortOrder, setSortOrder] = useState("default");
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("customerToken"));

  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(response.data);
      setSortedRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Create a Set of restaurant IDs that are favorited
      const favIds = new Set(response.data.map(restaurant => restaurant._id));
      setFavorites(favIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchRestaurants();
    fetchFavorites();
  }, [fetchRestaurants, fetchFavorites]);

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

  useEffect(() => {
    let filtered = [...restaurants];
    
    // Filter by category if one is selected
    if (activeCategory) {
      filtered = filtered.filter(restaurant => 
        restaurant.category && restaurant.category.includes(activeCategory)
      );
    }
    
    // Then apply sorting
    if (sortOrder === 'asc') {
      setSortedRestaurants(filtered.sort((a, b) => a.rating - b.rating));
    } else if (sortOrder === 'desc') {
      setSortedRestaurants(filtered.sort((a, b) => b.rating - a.rating));
    } else {
      setSortedRestaurants(filtered);
    }
  }, [sortOrder, restaurants, activeCategory]);

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName === activeCategory ? null : categoryName);
  };

  const foodCategories = [
    { name: 'Burger', image: 'https://img.freepik.com/premium-vector/burger-icon-cartoon-hamburger-fast-food-symbol_80590-14811.jpg' },
    { name: 'Steakhouse', image: 'https://cdn.vectorstock.com/i/1000v/22/61/steak-house-logo-icon-on-black-vector-23892261.jpg' },
    { name: 'Drinks', image: 'https://cdn-icons-png.flaticon.com/512/820/820603.png' },
    { name: 'Fast Food', image: 'https://cdn3.vectorstock.com/i/1000x1000/53/47/french-fries-icon-design-template-isolated-vector-48915347.jpg' },
    { name: 'Grocery', image: 'https://thumbs.dreamstime.com/b/isolated-grocery-bag-icon-groceries-icons-vector-191341179.jpg' },
    { name: 'Dessert', image: 'https://cdn-icons-png.flaticon.com/512/1205/1205153.png' },
    { name: 'Japanese', image: 'https://static.vecteezy.com/system/resources/previews/012/450/052/non_2x/ramen-noodle-illustration-cartoon-food-and-drink-logo-japanese-food-icon-bowl-and-chopsticks-symbol-free-vector.jpg' },
    { name: 'Italian', image: 'https://st2.depositphotos.com/36103482/49106/v/450/depositphotos_491068272-stock-illustration-fried-noodle-on-plate-vintage.jpg' },
    { name: 'Vegetarian Friendly', image: 'https://png.pngtree.com/png-vector/20220630/ourmid/pngtree-vegetarian-food-icon-featuring-leaves-fork-and-spoon-in-vector-format-vector-png-image_37487134.png' },
    { name: 'Halal', image: 'https://c8.alamy.com/comp/2G0PAKR/vector-red-circle-stamp-sign-halal-allowed-to-eat-and-drink-in-islam-people-at-transparent-effect-background-2G0PAKR.jpg' },
    { name: 'Sushi', image: 'https://img.freepik.com/premium-vector/sushi-icon-isometric-3d-style-isolated-white-background-food-symbol_96318-12374.jpg' },
    { name: 'Alcohol', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6ycKycUpkZiYvTiIfzrAatAgrXkOOfbpoOw&s' },
    { name: 'Wings', image: 'https://static.vecteezy.com/system/resources/previews/008/441/867/non_2x/crispy-fried-chicken-leg-illustration-flat-icon-illustration-design-fast-food-fried-chicken-leg-flat-design-vector.jpg' }
  ];

  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full z-10"
      onClick={onClick}
    >
      <FaChevronLeft className="text-black text-lg" />
    </button>
  );
  
  const NextArrow = ({ onClick }) => (
    <button
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-md rounded-full z-10"
      onClick={onClick}
    >
      <FaChevronRight className="text-black text-lg" />
    </button>
  );
  
  // Carousel settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 11,
    slidesToScroll: 2,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 6, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 3, slidesToScroll: 1 } }
    ]
  };

  // Function to get random delivery time between 15-45 minutes
  const getRandomDeliveryTime = () => {
    return Math.floor(Math.random() * (45 - 15 + 1)) + 15;
  };

  // Function to get random delivery fee between $1.99-$5.99
  const getRandomDeliveryFee = () => {
    return (Math.floor(Math.random() * (599 - 199 + 1)) + 199) / 100;
  };

  return (
    <div className="dashboard-container min-h-screen flex flex-col bg-gray-50">
      <DashboardNavbar />

      <main className="flex-grow">
        {/* Hero Banner */}
          <div 
            className="relative bg-cover bg-center text-white py-12 px-6 mt-20 h-[400px]" 
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://techcrunch.com/wp-content/uploads/2019/07/uber-eats-Dine-In.png')`
            }}
          >
            <div className="max-w-7xl mx-auto relative z-10">
              <h1 className="text-4xl font-bold mb-4">Food delivery and more</h1>
              <p className="text-xl mb-6">Your favorite restaurants delivered to your door</p>
            </div>
          </div>


        {/* Food Categories Carousel */}
        <div className="food-carousel-container py-6 px-6 max-w-7xl mx-auto mt-4">
          <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
          <Slider {...sliderSettings}>
            {foodCategories.map((category, index) => (
              <div 
                key={index} 
                className={`text-center cursor-pointer ${activeCategory === category.name ? 'scale-110 transition-transform' : ''}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center p-3 ${activeCategory === category.name ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-100'}`}>
                    <img src={category.image} alt={category.name} className="w-10 h-10 object-contain" />
                  </div>
                  <span className={`text-sm font-medium mt-2 ${activeCategory === category.name ? 'text-green-500' : ''}`}>
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Sorting Controls */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Featured on Uber Eats</h2>
              
              <div className="flex space-x-3">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${sortOrder === 'desc' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => handleSortChange('desc')}
                >
                  Top Rated
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${sortOrder === 'asc' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => handleSortChange('asc')}
                >
                  Lowest Rated
                </button>
                {sortOrder !== 'default' && (
                  <button
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
                    onClick={() => handleSortChange('default')}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
              
            {activeCategory && (
              <div className="mb-4 flex items-center">
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium flex items-center">
                  {activeCategory}
                  <button 
                    className="ml-2 text-green-800 hover:text-green-600" 
                    onClick={() => setActiveCategory(null)}
                  >
                    ✕
                  </button>
                </span>
                <span className="ml-3 text-sm text-gray-500">
                  {sortedRestaurants.length} {sortedRestaurants.length === 1 ? 'restaurant' : 'restaurants'}
                </span>
              </div>
            )}
          </div>
          
          {/* Restaurant Grid - Improved Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedRestaurants.length > 0 ? (
              sortedRestaurants.map((rest) => {
                const deliveryTime = getRandomDeliveryTime();
                const deliveryFee = getRandomDeliveryFee();
                
                return (
                  <div 
                    key={rest._id} 
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/restaurants/${rest._id}`)}
                  >
                    {/* Restaurant Image with better aspect ratio */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={rest.image_url || 'https://via.placeholder.com/300'}
                        alt={rest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Favorite Heart Icon - repositioned */}
                      <button 
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm z-10 transition-transform hover:scale-110"
                        onClick={(e) => toggleFavorite(e, rest._id)}
                      >
                        {favorites.has(rest._id) ? (
                          <FaHeart className="text-red-500 text-lg" />
                        ) : (
                          <FaRegHeart className="text-gray-400 text-lg" />
                        )}
                      </button>
                      
                      {/* Promotional Tag */}
                      {Math.random() > 0.7 && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Top Pick
                        </div>
                      )}
                    </div>
                    
                    {/* Restaurant Details */}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-green-600 transition-colors">{rest.name}</h3>
                          <div className="flex items-center space-x-1 text-sm mb-2">
                            <FaStar className="text-yellow-400" />
                            <span className="font-medium">{rest.rating}</span>
                            <span className="text-gray-500">(100+)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-3">
                        {rest.category}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-1" /> 
                          <span>{deliveryTime} min</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FaMotorcycle className="mr-1" />
                          <span>${deliveryFee.toFixed(2)} Fee</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // No results state
              <div className="col-span-full text-center py-16">
                <div className="text-gray-400 text-5xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
                <p className="text-gray-500">Try changing your filters or check back later.</p>
                {activeCategory && (
                  <button 
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-full font-medium"
                    onClick={() => setActiveCategory(null)}
                  >
                    Clear category filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Uber Eats</h3>
              <ul className="space-y-2">
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">About us</a></li>
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">Become a partner</a></li>
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">Add your restaurant</a></li>
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">Sign up to deliver</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Get Help</h3>
              <ul className="space-y-2">
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">View all cities</a></li>
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">Restaurants near me</a></li>
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">English</a></li>
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">Help</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Uber</h3>
              <ul className="space-y-2">
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">Ride</a></li>
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">Drive</a></li>
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">Uber for Business</a></li>
                <li><a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">Uber Freight</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4 text-2xl">
                <a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://about.ubereats.com/" className="text-gray-300 hover:text-white">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Get the app</h4>
                <div className="flex space-x-2">
                  <a href="https://apps.apple.com/us/app/uber-eats-food-delivery" className="border border-white rounded px-3 py-2 text-sm inline-block hover:bg-white hover:text-black transition-colors" target="_blank" rel="noreferrer"> 
                    App Store
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.ubercab.eats" className="border border-white rounded px-3 py-2 text-sm inline-block hover:bg-white hover:text-black transition-colors" target="_blank" rel="noreferrer">
                    Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <a href="https://about.ubereats.com/" className="hover:text-white">Privacy Policy</a>
                <a href="https://about.ubereats.com/" className="hover:text-white">Terms of Service</a>
                <a href="https://about.ubereats.com/" className="hover:text-white">Pricing</a>
              </div>
              <div>
                © 2025 Uber Technologies Inc. Lab Assignment
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;