import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock } from "react-icons/fa"; 
import Navbar from '../components/Navbar'; 

function Home() {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

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
    }
  };

  const handleSelect = (selectedAddress) => {
    setAddress(selectedAddress);
    setSuggestions([]);
  };

  return (
    
    <div
      className="h-screen bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: "url('https://www.hodgsonmill.com/cdn/shop/files/pancakes_slider_2882x1322_fe03788b-01c5-4dde-87ff-11cba8b9328f_1200x.jpg?v=1613696401')",
      }}
    >
      <Navbar />
      <div className="flex-grow flex flex-col justify-center px-8 md:px-20">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Order delivery near you
        </h1>

        {/* Search Bar Section */}
        <div className="mt-6 flex flex-col md:flex-row items-center gap-3 w-full max-w-2xl">
          {/* Address Input with Icon */}
          <div className="relative flex items-center rounded-lg shadow-md w-full">
            <FaMapMarkerAlt className="absolute left-4 text-gray-500" />
            <input
              type="text"
              placeholder="Enter delivery address"
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none"
              value={address}
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border shadow-lg mt-1 w-full max-h-40 overflow-auto left-0 top-12 rounded-lg">
                {suggestions.map((item, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelect(item.display_name)}
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Dropdown with Icon */}
          <div className="relative flex items-center rounded-lg shadow-md">
            <FaClock className="absolute left-4 text-gray-500" />
            <select className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none">
              <option>Deliver now</option>
              <option>Schedule for later</option>
            </select>
          </div>

          {/* Styled Search Button */}
          <button className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition whitespace-nowrap">
            Search here
          </button>
        </div>

        {/* Updated Sign-In Link */}
        <p className="mt-4 text-black">
          Or{" "}
          <span
            className="underline cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Home;
