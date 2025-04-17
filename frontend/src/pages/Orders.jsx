import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClockIcon, TruckIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

// Assuming you have this component in your project
import DashboardNavbar from "../components/DashboardNavbar";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("customerToken");
      if (!token) {
        setError("You must be logged in to view orders");
        setLoading(false);
        return;
      }

      const parsedToken = JSON.parse(token);
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${parsedToken}` },
      });

      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = JSON.parse(localStorage.getItem("customerToken"));
      if (!token) {
        setError("Unauthorized. Please log in.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
      
      // Using browser notification instead of alert for better UX
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50 animate-fade-in-out';
      notification.textContent = 'Order canceled successfully!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
    } catch (error) {
      console.error("Error canceling order:", error);
      setError("Failed to cancel order. Please try again later.");
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case "Preparing":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "On the way":
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case "Delivered":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "Cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="max-w-6xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage your food delivery orders
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <ClockIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your order history will appear here once you place your first order.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/restaurants")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Browse Restaurants
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order #{order._id}
                      </h2>
                      <span
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Preparing" ? "bg-yellow-100 text-yellow-800" :
                          order.status === "On the way" ? "bg-blue-100 text-blue-800" :
                          order.status === "Delivered" ? "bg-green-100 text-green-800" :
                          order.status === "Cancelled" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                      {order.createdAt && formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="mr-2">🍽️</span> {order.restaurantName}
                    </h3>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Order Items
                  </h4>
                  <div className="space-y-3">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm">🍲</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.dishName || `Dish ID: ${item.dishId || 'Unknown'}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                              x{item.quantity || 1}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No items listed</p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="text-sm">
                    <span className="text-gray-500">Total:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                    </span>
                  </div>
                  
                  {(order.status === "Preparing" || order.status === "Pending" || order.status === "On the way") && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard Button */}
        <div className="mt-8 mb-12 flex justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Orders;