import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ hideBranding }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    navigate("/login");
    setIsOpen(false);
  };

  const handleSignup = () => {
    navigate("/signup");
    setIsOpen(false);
  };

  const handleRestaurantLogin = () => {
    navigate("/restaurant/login");
    setIsOpen(false);
  };

  const handleRestaurantSignup = () => {
    navigate("/restaurant/signup");
    setIsOpen(false);
  };


  return (
    <>
      {/* Navbar */}
      <nav className="main-navbar absolute top-0 left-0 w-full flex justify-between items-center p-4 bg-transparent z-10">
        {/* Hamburger Button */}
        <button onClick={() => setIsOpen(true)} className="text-2xl font-bold">
          ☰
        </button>

        {/* Clickable Uber Eats Branding */}
        {!hideBranding && (
          <div
            className="text-2xl font-bold ml-4 flex-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Uber <span className="text-green-600 ml-1">Eats</span>
          </div>
        )}

        <ul className="flex gap-6 items-center text-lg font-medium">
          <li>
            <button onClick={handleLogin} className="text-black">
              Login
            </button>
          </li>
          <li>
            <button
              onClick={handleSignup}
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
            >
              Sign Up
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

      {/* Sidebar Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white p-6 z-30 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="mb-6 text-xl font-semibold"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {/* Clickable Uber Eats Branding */}
        <div
          className="text-2xl font-bold text-black flex items-center mb-6 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Uber <span className="text-green-600 ml-1">Eats</span>
        </div>

        {/* Sidebar Links */}
        <ul className="space-y-4">
          <li>
            <button onClick={handleSignup} className="bg-black text-white px-4 py-2 w-full rounded-md">
              Sign Up
            </button>
          </li>
          <li>
            <button onClick={handleLogin} className="border border-black px-4 py-2 w-full rounded-md">
              Log in
            </button>
          </li>
          {/* Restaurant Links */}
          <li>
            <button onClick={handleRestaurantSignup} className="hover:text-green-600">
              Add Your Restaurant
            </button>
          </li>
          <li>
            <button onClick={handleRestaurantLogin} className="hover:text-green-600">
              Restaurant Login
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;