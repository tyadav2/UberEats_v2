import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from "../redux/slices/authSlice.js";
import ToggleButtons from "./ToggleButtons.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaReceipt,
  FaHeart,
  FaUser,
  FaBuilding,
  FaPlusCircle,
  FaMotorcycle,
  FaSignOutAlt,
  FaSearch,
  FaShoppingCart,
  FaApple,
  FaAndroid,
  FaTimes
} from "react-icons/fa";

function DashboardNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch address suggestions from OpenStreetMap
  const handleInputChange = async (e) => {
    const query = e.target.value;
    setAddress(query);

    if (query.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
          {
            headers: {
              "User-Agent": "UberEatsClone/1.0 (contact: adi.tekale99@gmail.com)",
              "Accept-Language": "en",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch address suggestions");
        }

        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Address fetch error:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle address selection
  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setSuggestions([]);
  };

  const handleLogout = () => {
    localStorage.clear();
    localStorage.removeItem("customerToken");
    localStorage.removeItem("user");
    // Redux logout
    dispatch(logout());

    toast.success('Successfully logged out!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
    
    setTimeout(() => {
      navigate("/login", { replace: true });
      setIsOpen(false);
    }, 500);
  };
  
  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleAppClick = (platform) => {
    if (platform === 'ios') {
      window.open('https://apps.apple.com/us/app/uber-eats-food-delivery', '_blank');
    } else if (platform === 'android') {
      window.open('https://play.google.com/store/apps/details?id=com.ubercab.eats', '_blank');
    }
  };

  return (
    <>
    <ToastContainer />
      {/* Navbar */}
      <nav className="main-navbar absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-transparent z-10">
        {/* Hamburger Button */}
        <button onClick={() => setIsOpen(true)} className="text-2xl font-bold">
          ☰
        </button>

        {/* Clickable Uber Eats Branding */}
        <div
          className="text-2xl font-bold flex items-center pl-5 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Uber <span className="text-green-600 ml-1">Eats</span>
        </div>

        {/* Include the Toggle Buttons Component */}
        <div className="ml-6">
          <ToggleButtons />
        </div>
        
        {/* Address Lookup Input */}
        <div className="nav-center flex-1 mx-4 relative">
          <input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={handleInputChange}
            className="address-input w-full p-2 rounded-full border border-gray-300 relative z-20"
          />
          {/* Address Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 w-full bg-white border border-gray-300 mt-20 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(suggestion.display_name)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search input */}
        <div className="nav-center flex-1 mx-4 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search UberEats"
            className="pl-10 pr-80 py-2 w-98 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Logout button on the main navbar */}
        <ul className="flex gap-6 items-center text-lg font-medium">
          <li>
            <button onClick={handleCartClick}>
              <FaShoppingCart />
            </button>
          </li>
          <li>
            <button onClick={handleLogout}>
              <FaSignOutAlt className="text-xl" />
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Enhanced Sidebar Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-30 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes className="text-xl" />
          </button>

          {/* Clickable Uber Eats Branding */}
          <div
            className="text-2xl font-bold text-black flex items-center mb-8 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Uber <span className="text-green-600 ml-1">Eats</span>
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-1">
            <li className="rounded-lg overflow-hidden hover:bg-gray-100">
              <button 
                onClick={() => navigate("/orders")} 
                className="flex items-center w-full p-3 text-gray-700 hover:text-green-600 transition duration-200"
              >
                <FaReceipt className="mr-4 text-gray-500" />
                <span className="font-medium">Orders</span>
              </button>
            </li>
            
            <li className="rounded-lg overflow-hidden hover:bg-gray-100">
              <button 
                onClick={() => navigate("/favorites")} 
                className="flex items-center w-full p-3 text-gray-700 hover:text-green-600 transition duration-200"
              >
                <FaHeart className="mr-4 text-gray-500" />
                <span className="font-medium">Favorites</span>
              </button>
            </li>
            
            <li className="rounded-lg overflow-hidden hover:bg-gray-100">
              <button 
                onClick={() => navigate("/profile")} 
                className="flex items-center w-full p-3 text-gray-700 hover:text-green-600 transition duration-200"
              >
                <FaUser className="mr-4 text-gray-500" />
                <span className="font-medium">Profile</span>
              </button>
            </li>
            
            <li className="rounded-lg overflow-hidden hover:bg-gray-100">
              <button 
                onClick={() => navigate("/restaurant/signup")} 
                className="flex items-center w-full p-3 text-gray-700 hover:text-green-600 transition duration-200"
              >
                <FaBuilding className="mr-4 text-gray-500" />
                <span className="font-medium">Create a Business Account</span>
              </button>
            </li>
            
            <li className="rounded-lg overflow-hidden hover:bg-gray-100">
              <button 
                onClick={() => navigate("/restaurant/signup")} 
                className="flex items-center w-full p-3 text-gray-700 hover:text-green-600 transition duration-200"
              >
                <FaPlusCircle className="mr-4 text-gray-500" />
                <span className="font-medium">Add your restaurant</span>
              </button>
            </li>
            
            <li className="rounded-lg overflow-hidden hover:bg-gray-100">
              <button 
                onClick={() => navigate("/restaurant/signup")} 
                className="flex items-center w-full p-3 text-gray-700 hover:text-green-600 transition duration-200"
              >
                <FaMotorcycle className="mr-4 text-gray-500" />
                <span className="font-medium">Sign up to deliver</span>
              </button>
            </li>
          </ul>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <button 
              onClick={handleLogout} 
              className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-gray-100 transition duration-200"
            >
              <FaSignOutAlt className="mr-4 text-gray-500" />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </div>
        
        {/* App Download Section at Bottom */}
        <div className="mt-auto p-6 bg-gray-50 rounded-t-lg border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-3 font-medium">Get the app</p>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleAppClick('ios')} 
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              <FaApple className="text-xl" />
              <span className="text-sm">iOS</span>
            </button>
            <button 
              onClick={() => handleAppClick('android')} 
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-200"
            >
              <FaAndroid className="text-xl" />
              <span className="text-sm">Android</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardNavbar;