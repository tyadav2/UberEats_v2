import React, { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  removeItemCompletely,
  clearCart,
  addToCart,
} from "../redux/slices/orderSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.order.cartItems);  
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isPickup, setIsPickup] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
  
    const item = cartItems.find((i) => i._id === itemId);
    if (item) {
      // Directly update the item with the new quantity
      dispatch(addToCart({ ...item, quantity: newQuantity }));
    }
  };

  const removeItem = (itemId) => {
    // Use the new action to completely remove the item
    dispatch(removeItemCompletely({ id: itemId }));
  };

  // Address Lookup Feature
  const handleAddressInput = async (e) => {
    const query = e.target.value;
    setDeliveryAddress(query);

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

  const handleSelectAddress = (selectedAddress) => {
    setDeliveryAddress(selectedAddress);
    setSuggestions([]);
  };

  const placeOrder = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("customerToken"));
      if (!token) {
        alert("Unauthorized. Please log in.");
        return;
      }
  
      if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }
  
      // Check if delivery address is provided when not pickup
      if (!isPickup && !deliveryAddress.trim()) {
        alert("Please provide a delivery address.");
        return;
      }
  
      // Extract restaurantId from the first cart item (assuming all items are from the same restaurant)
      const restaurantId = cartItems[0].restaurantId; 
  
      if (!restaurantId) {
        alert("Invalid restaurant. Please try again.");
        return;
      }
  
      // Ensure prices are numbers and construct valid order items array
      const orderItems = cartItems.map(item => ({
        dishId: item._id || item._id, 
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price)  
      }));
  
      const finalTotal = isPickup ? Number(totalPrice) : Number(totalPrice) + Number(deliveryFee);
      
      const orderData = {
        restaurantId,
        totalAmount: finalTotal, 
        items: orderItems,
        paymentMethod: "Credit Card",
        isPickup: isPickup,
        deliveryAddress: isPickup ? null : deliveryAddress,
        deliveryFee: isPickup ? 0 : deliveryFee
      };

      console.log("Order data being sent:", {
        ...orderData,
        items: orderItems,
        deliveryAddress: isPickup ? null : deliveryAddress
      });
  
      await axios.post("http://localhost:5000/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Clear cart on successful order
      dispatch(clearCart());
      setDeliveryFee(0);
  
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert(`Failed to place order: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="cart-page">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 p-10">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart text-center py-8">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 underline">Browse Restaurants</Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Cart Items - THIS SECTION WAS MISSING */}
            <div className="cart-items md:w-2/3">
              {cartItems.map((item) => (
                <div key={item._id || item._id} className="cart-item bg-white p-4 rounded-lg shadow-md mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="item-details flex-1 mb-3 sm:mb-0">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-700">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="item-actions flex items-center">
                    <div className="quantity-controls flex items-center mr-4">
                      <button 
                        onClick={() => updateQuantity(item._id || item._id, item.quantity - 1)}
                        className="bg-gray-200 px-2 py-1 rounded-l text-lg font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-100">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id || item._id, item.quantity + 1)}
                        className="bg-gray-200 px-2 py-1 rounded-r text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item._id || item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="cart-summary md:w-1/3 bg-white p-6 shadow-lg rounded-lg h-fit">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="price-details mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {!isPickup && (
                  <div className="flex justify-between mb-2">
                    <span>Delivery Fee:</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>${(isPickup ? totalPrice : totalPrice + deliveryFee).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="delivery-options mb-4">
                <div className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    id="pickup" 
                    className="mr-2 h-4 w-4" 
                    checked={isPickup}
                    onChange={() => setIsPickup(!isPickup)}
                  />
                  <label htmlFor="pickup" className="text-lg">Pickup instead of delivery</label>
                </div>
                
                {!isPickup && (
                  <div className="mt-3">
                    <label htmlFor="address" className="block text-gray-700 mb-2">Delivery Address:</label>
                    <input
                      id="address"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={deliveryAddress}
                      onChange={handleAddressInput}
                      placeholder="Enter your delivery address"
                    />
                    {suggestions.length > 0 && (
                      <ul className="bg-white shadow-md mt-1 rounded max-h-40 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                          <li 
                            key={index} 
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelectAddress(suggestion.display_name)}
                          >
                            {suggestion.display_name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <button 
                onClick={placeOrder}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg w-full font-bold text-lg transition"
              >
                {isPickup ? 'Place Pickup Order' : 'Place Delivery Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;