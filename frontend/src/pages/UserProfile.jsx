import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, ChevronRight, Image, MapPin, Phone, User, Mail } from "lucide-react";

function UserProfile() {
  const navigate = useNavigate();

  // Local state for user profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [newProfilePicUrl, setNewProfilePicUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("customerToken"));

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;

      // Populate state
      setName(userData.name || "");
      setEmail(userData.email || "");
      setCity(userData.city || "");
      setStateVal(userData.state || "");
      setCountry(userData.country || "");
      setPhoneNumber(userData.phoneNumber || "");
      setDob(userData.dob || "");
      if (userData.profilePic) {
        setProfilePicUrl(userData.profilePic);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calendar date picker functionality
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const dateFormat = { month: 'long', year: 'numeric' };
    const monthYearLabel = currentMonth.toLocaleDateString('en-US', dateFormat);

    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }

    const handleDateClick = (date) => {
      const selectedDate = new Date(date);
      setDob(selectedDate.toLocaleDateString('en-US'));
      setShowCalendar(false);
    };

    return (
      <div className="absolute z-10 bg-white border shadow-lg rounded-lg p-3 mt-2 w-64">
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="text-gray-600 hover:text-green-500"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-medium text-center">{monthYearLabel}</h3>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="text-gray-600 hover:text-green-500"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="font-medium text-gray-500">{day}</div>
          ))}
          {days.map((day, i) => (
            <div
              key={i}
              onClick={() => handleDateClick(day)}
              className={`
                h-7 w-7 flex items-center justify-center rounded-full cursor-pointer
                ${day.getMonth() !== currentMonth.getMonth() ? 'text-gray-300' : 'text-gray-800'}
                ${new Date(dob).toDateString() === day.toDateString() ? 'bg-green-500 text-white' : 'hover:bg-green-100'}
              `}
            >
              {day.getDate()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("customerToken"));
  
      if (!token) {
        alert("Unauthorized: Please log in again.");
        return;
      }
  
      // For direct API request with JSON instead of FormData
      const userData = {
        name,
        city,
        state: stateVal,
        country,
        phoneNumber,
        dob,
        // Only include profilePic if there's a new URL
        ...(newProfilePicUrl && { profilePic: newProfilePicUrl })
      };
  
      // Make API request
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update profile pic URL in UI if successful
      if (response.data && newProfilePicUrl) {
        setProfilePicUrl(newProfilePicUrl);
        setNewProfilePicUrl("");
      }
      
      // Show success notification
      const notification = document.getElementById("notification");
      notification.classList.remove("hidden");
      notification.classList.add("flex");
      
      setTimeout(() => {
        notification.classList.add("hidden");
        notification.classList.remove("flex");
      }, 3000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Countries list
  const countries = [
    "USA", "Canada", "Mexico", "Brazil", "Argentina", 
    "UK", "France", "Germany", "Italy", "Spain", 
    "China", "Japan", "India", "Australia", "South Africa"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      {/* Success notification */}
      <div 
        id="notification" 
        className="hidden fixed top-5 right-5 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md items-center space-x-2 z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Profile updated successfully!</span>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mt-12">
          
          {/* Header with profile image */}
          <div className="p-6  flex flex-col items-center relative h-[300px] bg-cover bg-center"
                style={{backgroundImage: `url('https://images.prismic.io/next-tryotter/Z135zZbqstJ98gcw_uber-eats-promo-codes-for-existing-users.jpeg?auto=compress,format')`}}
>
            
            <div className="absolute bottom-0 translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl.startsWith('http') ? profilePicUrl : `http://localhost:5000${profilePicUrl}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={48} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>
          
          {/* Form */}
          <div className="p-6 pt-20">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Your Profile</h2>
            
            <form onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Name */}
                <div className="relative">
                  <label className="block mb-2 font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                {/* Date of Birth */}
                <div className="relative">
                  <label className="block mb-2 font-medium text-gray-700">Date of Birth</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={dob}
                      readOnly
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Select your birth date"
                    />
                    {showCalendar && renderCalendar()}
                  </div>
                </div>
                
                {/* Phone */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                
                {/* Profile Picture URL */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Profile Picture URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={newProfilePicUrl}
                      onChange={(e) => setNewProfilePicUrl(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>
                
                {/* City */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">City</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter city"
                    />
                  </div>
                </div>
                
                {/* State */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">State/Province</label>
                  <input
                    type="text"
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter state or province"
                  />
                </div>
                
                {/* Country */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Country</option>
                    {countries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-gray-100 text-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Return to Dashboard
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex justify-center items-center"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <span className="mr-2">Save Changes</span>
                      <span className="inline-block w-4 h-4 bg-green-500 rounded-full"></span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;