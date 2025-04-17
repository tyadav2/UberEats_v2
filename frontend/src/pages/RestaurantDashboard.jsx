import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RestaurantDashboard = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [dishes, setDishes] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newDish, setNewDish] = useState({ name: "", ingredients: "", price: "", image: null, category: "Appetizer", description: "" });
    const [dishPreview, setDishPreview] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingDish, setEditingDish] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("restaurantToken");


    useEffect(() => {
        if (!token) {
            console.error("No token found! Redirecting to login.");
            navigate("/restaurant/login");
            return;
        }
        fetchRestaurantProfile();
        fetchDishes();
        fetchOrders();
    }, []);

    // Fetch restaurant profile
    const fetchRestaurantProfile = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/restaurants/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRestaurant(response.data);
            setImagePreview(response.data.image_url);
        } catch (error) {
            console.error("Error fetching restaurant profile:", error);
            alert("Authentication failed! Please log in again.");
            navigate("/restaurant/login");
        }
    };

    // Fetch dishes
    const fetchDishes = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/dishes", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDishes(response.data);
        } catch (error) {
            console.error("Error fetching dishes:", error);
        }
    };

    // Fetch dish details
    const fetchDishDetails = async (dishId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/dishes/${dishId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching details for dish ${dishId}:`, error);
            return null;
        }
    };

    // Fetch orders
    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/orders/restaurant", {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Get orders
            const fetchedOrders = response.data;
            
            // Enhance orders with dish details
            const enhancedOrders = await Promise.all(fetchedOrders.map(async (order) => {
                // Process each order's items to get full dish details
                const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
                    const dishDetails = await fetchDishDetails(item.dishId);
                    return {
                        ...item,
                        dishName: dishDetails ? dishDetails.name : `Dish #${item.dishId}`,
                        price: dishDetails ? dishDetails.price : 0,
                        image: dishDetails ? dishDetails.image : null
                    };
                }));
                
                // Return order with enhanced items
                return {
                    ...order,
                    items: itemsWithDetails
                };
            }));
            
            setOrders(enhancedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${orderId}`, 
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            fetchOrders(); // Refresh orders after update
            
            if (orderDetails && orderDetails._id === orderId) {
                setOrderDetails({...orderDetails, status: newStatus});
            }
            
            alert(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update order status!");
        }
    };

    // Show order details
    const showOrderDetails = (order) => {
        setOrderDetails(order);
    };

    // Update restaurant profile
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put("http://localhost:5000/api/restaurants/profile", restaurant, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Profile updated successfully!");
            fetchRestaurantProfile();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Update failed!");
        }
    };

    // Handle Profile Image Upload
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRestaurant({ ...restaurant, image_url: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handle Dish Image Upload
    const handleDishImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewDish({ ...newDish, image: file });
            setDishPreview(URL.createObjectURL(file));
        }
    };

    // Add a new dish
    const handleAddDish = async (e) => {
        e.preventDefault();

        // Create regular JSON object instead of FormData
        const dishData = {
            name: newDish.name,
            ingredients: newDish.ingredients,
            price: newDish.price,
            category: newDish.category,
            description: newDish.description
        };

        // Handle image: if it's a file, we need to handle it differently
        if (typeof newDish.image === 'string' && newDish.image.startsWith('http')) {
            dishData.image = newDish.image;
        } else if (newDish.image instanceof File) {
            // If we need file upload, we would need to handle it differently
            // For now, let's skip this part and rely on image URLs
            alert("Please use an image URL instead of file upload for now.");
            return;
        } else {
            // If no image is provided, use a placeholder
            dishData.image = "https://via.placeholder.com/300";
        }

        try {
            await axios.post("http://localhost:5000/api/dishes", dishData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            alert("Dish added successfully!");
            setNewDish({ name: "", ingredients: "", price: "", image: null, category: "Appetizer", description: "" });
            setDishPreview(null);
            fetchDishes();
        } catch (error) {
            console.error("Error adding dish:", error);
            if (error.response) {
                // Log more detailed error information
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                alert(`Failed to add dish: ${error.response.data.message || error.response.statusText}`);
            } else {
                alert("Failed to add dish! Check console for details.");
            }
        }
    };

    // Delete a dish
    const handleDeleteDish = async (dishId) => {
        try {
            await axios.delete(`http://localhost:5000/api/dishes/${dishId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Dish deleted successfully!");
            fetchDishes();
            setConfirmDelete(null);
        } catch (error) {
            console.error("Error deleting dish:", error);
            alert("Failed to delete dish!");
        }
    };

    // Start editing a dish
    const startEditDish = (dish) => {
        setEditingDish({
            ...dish,
            ingredients: dish.ingredients || "",
        });
        setActiveTab("editDish");
    };

    // Handle update dish
    const handleUpdateDish = async (e) => {
        e.preventDefault();
        
        const dishData = {
            name: editingDish.name,
            ingredients: editingDish.ingredients,
            price: editingDish.price,
            category: editingDish.category,
            description: editingDish.description,
            image: editingDish.image
        };

        try {
            await axios.put(`http://localhost:5000/api/dishes/${editingDish._id}`, dishData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            
            alert("Dish updated successfully!");
            setEditingDish(null);
            setActiveTab("manageDishes");
            fetchDishes();
        } catch (error) {
            console.error("Error updating dish:", error);
            alert("Failed to update dish!");
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("restaurantToken");
        navigate("/restaurant/login");
    };

    if (!restaurant) {
        return <div className="flex justify-center items-center h-screen text-gray-600 text-lg">Loading...</div>;
    }

    // Get counts for order status types
    // Update the getOrderCounts function
const getOrderCounts = () => {
    const counts = {
        new: 0,
        preparing: 0,
        onTheWay: 0,
        delivered: 0
    };
    
    orders.forEach(order => {
        if (order.status === "New") counts.new++;
        else if (order.status === "Preparing") counts.preparing++;
        else if (order.status === "On the way") counts.onTheWay++;
        else if (order.status === "Delivered") counts.delivered++;
    });
    
    return counts;
};
    
    const orderCounts = getOrderCounts();

    // Format date
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

    // Get status badge color
    const getStatusColor = (status) => {
        switch(status) {
            case "New": return "bg-blue-500";
            case "Preparing": return "bg-yellow-500";
            case "On the way": return "bg-purple-500";
            case "Pick Up Ready": return "bg-pink-500";
            case "Delivered": return "bg-green-500";
            case "Cancelled": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar Navigation */}
            <div className="w-1/5 bg-gray-900 text-white p-6 fixed h-screen">
                <h1 className="text-2xl font-bold text-green-400 mb-4">Uber Eats <span className="text-gray-200">for Merchants</span></h1>
                <h2 className="text-lg font-semibold mb-6">{restaurant.name} - Dashboard</h2>

                <ul className="space-y-4">
                    <li className={`cursor-pointer p-3 rounded ${activeTab === "profile" ? "bg-green-600" : ""}`} onClick={() => setActiveTab("profile")}>
                        Profile Management
                    </li>
                    <li className={`cursor-pointer p-3 rounded ${activeTab === "addDish" ? "bg-green-600" : ""}`} onClick={() => setActiveTab("addDish")}>
                        Add New Dish
                    </li>
                    <li className={`cursor-pointer p-3 rounded ${activeTab === "manageDishes" ? "bg-green-600" : ""}`} onClick={() => setActiveTab("manageDishes")}>
                        View / Manage Dishes
                    </li>
                    <li className={`cursor-pointer p-3 rounded ${activeTab === "orders" ? "bg-green-600" : ""}`} onClick={() => {
                        setActiveTab("orders");
                        setOrderDetails(null);
                    }}>
                        Orders {orderCounts.new > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-2">{orderCounts.new} new</span>}
                    </li>
                    <li className="cursor-pointer p-3 rounded bg-red-500 mt-10 text-center" onClick={handleLogout}>
                        Logout
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-4/5 ml-auto p-6 overflow-auto">
                {/* Profile Management Section */}
                {activeTab === "profile" && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Manage Profile</h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <input type="text" placeholder="Restaurant Name" value={restaurant.name} onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })} className="w-full p-3 border rounded" required />
                            <input type="text" placeholder="Location" value={restaurant.location} onChange={(e) => setRestaurant({ ...restaurant, location: e.target.value })} className="w-full p-3 border rounded" required />
                            <input type="text" placeholder="Contact Info" value={restaurant.phone_number} onChange={(e) => setRestaurant({ ...restaurant, phone_number: e.target.value })} className="w-full p-3 border rounded" required />
                            <textarea placeholder="Description" value={restaurant.description} onChange={(e) => setRestaurant({ ...restaurant, description: e.target.value })} className="w-full p-3 border rounded" required />

                            {/* Profile Image */}
                            <div className="flex items-center space-x-4">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Profile Preview" className="w-24 h-24 rounded-lg border" />
                                )}
                                <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                                    Change Profile Image
                                    <input type="file" name="profileImage" onChange={handleProfileImageChange} className="hidden" />
                                </label>
                            </div>

                            <button type="submit" className="bg-green-600 text-white p-3 rounded w-full">Update Profile</button>
                        </form>
                    </div>
                )}

                {/* Add New Dish Section */}
                {activeTab === "addDish" && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Add New Dish</h3>
                        <form onSubmit={handleAddDish} className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Dish Name" 
                                value={newDish.name} 
                                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })} 
                                className="w-full p-3 border rounded" 
                                required 
                            />
                            
                            <textarea 
                                placeholder="Ingredients" 
                                value={newDish.ingredients} 
                                onChange={(e) => setNewDish({ ...newDish, ingredients: e.target.value })} 
                                className="w-full p-3 border rounded" 
                                required 
                            />
                            
                            <input 
                                type="number" 
                                placeholder="Price ($)" 
                                value={newDish.price} 
                                onChange={(e) => setNewDish({ ...newDish, price: e.target.value })} 
                                className="w-full p-3 border rounded" 
                                min="0.01" 
                                step="0.01" 
                                required 
                            />
                            
                            <select 
                                value={newDish.category} 
                                onChange={(e) => setNewDish({ ...newDish, category: e.target.value })} 
                                className="w-full p-3 border rounded" 
                                required
                            >
                                <option value="Appetizer">Appetizer</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Beverage">Beverage</option>
                                <option value="Side Dish">Side Dish</option>
                                <option value="Salad">Salad</option>
                            </select>
                            
                           

                            {/* Image Input - Now with URL option */}
                            <div className="space-y-4">
                                <h4 className="font-medium">Dish Image</h4>
                                
                                {/* Option to input URL */}
                                <input 
                                    type="text" 
                                    placeholder="Image URL (e.g., https://example.com/image.jpg)" 
                                    value={typeof newDish.image === 'string' ? newDish.image : ''} 
                                    onChange={(e) => {
                                        setNewDish({ ...newDish, image: e.target.value });
                                        setDishPreview(e.target.value);
                                    }} 
                                    className="w-full p-3 border rounded" 
                                />
                                
                                <p className="text-sm text-gray-500">-- OR --</p>
                                
                                {/* Option to upload file */}
                                <div className="flex items-center space-x-4">
                                    {dishPreview && (
                                        <img src={dishPreview} alt="Dish Preview" className="w-24 h-24 rounded-lg border object-cover" />
                                    )}
                                    <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                                        Upload Dish Image
                                        <input type="file" name="dishImage" onChange={handleDishImageChange} className="hidden" accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="bg-green-600 text-white p-3 rounded w-full">Add Dish</button>
                        </form>
                    </div>
                )}

                {/* Edit Dish Section */}
                {activeTab === "editDish" && editingDish && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Edit Dish</h3>
                            <button 
                                onClick={() => {
                                    setEditingDish(null);
                                    setActiveTab("manageDishes");
                                }}
                                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                        <form onSubmit={handleUpdateDish} className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Dish Name" 
                                value={editingDish.name} 
                                onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })} 
                                className="w-full p-3 border rounded" 
                                required 
                            />
                            
                            <textarea 
                                placeholder="Ingredients" 
                                value={editingDish.ingredients} 
                                onChange={(e) => setEditingDish({ ...editingDish, ingredients: e.target.value })} 
                                className="w-full p-3 border rounded" 
                                required 
                            />
                            
                            <input 
                                type="number" 
                                placeholder="Price ($)" 
                                value={editingDish.price} 
                                onChange={(e) => setEditingDish({ ...editingDish, price: e.target.value })} 
                                className="w-full p-3 border rounded" 
                                min="0.01" 
                                step="0.01" 
                                required 
                            />
                            
                            <select 
                                value={editingDish.category} 
                                onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })} 
                                className="w-full p-3 border rounded" 
                                required
                            >
                                <option value="Appetizer">Appetizer</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Beverage">Beverage</option>
                                <option value="Side Dish">Side Dish</option>
                                <option value="Salad">Salad</option>
                            </select>
                            

                            {/* Image URL for editing */}
                            <div className="space-y-4">
                                <h4 className="font-medium">Dish Image</h4>
                                
                                <div className="flex items-center space-x-4 mb-4">
                                    <img src={editingDish.image} alt={editingDish.name} className="w-24 h-24 rounded-lg border object-cover" />
                                </div>
                                
                                <input 
                                    type="text" 
                                    placeholder="Image URL" 
                                    value={editingDish.image} 
                                    onChange={(e) => setEditingDish({ ...editingDish, image: e.target.value })} 
                                    className="w-full p-3 border rounded" 
                                />
                            </div>

                            <div className="flex space-x-4">
                                <button type="submit" className="bg-green-600 text-white p-3 rounded flex-1">Save Changes</button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setEditingDish(null);
                                        setActiveTab("manageDishes");
                                    }}
                                    className="bg-gray-300 p-3 rounded flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* View / Manage Dishes Section - Enhanced with Edit and Delete capabilities */}
                {activeTab === "manageDishes" && (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">View / Manage Dishes</h3>
                        {dishes.length === 0 ? (
                            <p className="text-gray-500">No dishes available. Add your first dish!</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dishes.map(dish => (
                                    <div key={dish._id} className="border rounded-lg overflow-hidden shadow-md">
                                        {/* Confirmation Dialog */}
                                        {confirmDelete === dish._id && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                                                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                                                    <h4 className="text-lg font-semibold mb-4">Confirm Delete</h4>
                                                    <p>Are you sure you want to delete "{dish.name}"? This action cannot be undone.</p>
                                                    <div className="flex space-x-4 mt-6">
                                                        <button 
                                                            onClick={() => handleDeleteDish(dish._id)} 
                                                            className="bg-red-500 text-white px-4 py-2 rounded flex-1"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button 
                                                            onClick={() => setConfirmDelete(null)} 
                                                            className="bg-gray-300 px-4 py-2 rounded flex-1"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                
                                        <div className="relative">
                                            <img 
                                                src={dish.image} 
                                                alt={dish.name} 
                                                className="w-full h-48 object-cover" 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/300?text=No+Image";
                                                }}
                                            />
                                            <div className="absolute top-2 right-2 flex space-x-2">
                                                <button 
                                                    onClick={() => startEditDish(dish)} 
                                                    className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-600"
                                                    title="Edit Dish"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => setConfirmDelete(dish._id)} 
                                                    className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600"
                                                    title="Delete Dish"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-semibold text-lg">{dish.name}</h4>
                                            <p className="text-green-600 font-bold">${parseFloat(dish.price).toFixed(2)}</p>
                                            <p className="text-sm text-gray-600 mb-2">{dish.category}</p>
                                            <p className="text-sm line-clamp-2 text-gray-700">{dish.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Section - List View */}
                {activeTab === "orders" && !orderDetails && (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-6">Manage Orders</h3>
        
        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-700 mb-2">New Orders</h4>
                <p className="text-3xl font-bold text-blue-600">
                    {orders.filter(order => order.status === "New").length}
                </p>
                <p className="text-sm text-blue-500 mt-1">Awaiting processing</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-yellow-700 mb-2">Preparing</h4>
                <p className="text-3xl font-bold text-yellow-600">
                    {orders.filter(order => order.status === "Preparing").length}
                </p>
                <p className="text-sm text-yellow-500 mt-1">In the kitchen</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-700 mb-2">On The Way</h4>
                <p className="text-3xl font-bold text-purple-600">
                    {orders.filter(order => order.status === "On the way").length}
                </p>
                <p className="text-sm text-purple-500 mt-1">Out for delivery</p>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-pink-700 mb-2">Pick Up Ready</h4>
                <p className="text-3xl font-bold text-pink-600">
                    {orders.filter(order => order.status === "Pick Up Ready").length}
                </p>
                <p className="text-sm text-pink-500 mt-1">Ready for pickup</p>
            </div>

            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-green-700 mb-2">Delivered</h4>
                <p className="text-3xl font-bold text-green-600">
                    {orders.filter(order => order.status === "Delivered").length}
                </p>
                <p className="text-sm text-green-500 mt-1">Completed orders</p>
            </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-red-700 mb-2">Cancelled</h4>
            <p className="text-3xl font-bold text-red-600">
                {orders.filter(order => order.status === "Cancelled").length}
            </p>
            <p className="text-sm text-red-500 mt-1">Cancelled orders</p>
        </div>

                        
                        {/* Orders Table */}
                        {orders.length === 0 ? (
            <p className="text-gray-500">No orders available yet.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left">Order ID</th>
                            <th className="py-3 px-4 text-left">Customer</th>
                            <th className="py-3 px-4 text-left">Address</th>
                            <th className="py-3 px-4 text-left">Date & Time</th>
                            <th className="py-3 px-4 text-left">Total</th>
                            <th className="py-3 px-4 text-left">Est. Delivery</th>
                            <th className="py-3 px-4 text-left">Payment</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4">#{order._id}</td>
                                <td className="py-3 px-4">{order.userEmail}</td>
                                <td className="py-3 px-4">{order.deliveryAddress || <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">Pick Up Order</span>}</td>
                                <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                                <td className="py-3 px-4">${parseFloat(order.totalAmount).toFixed(2)}</td>
                                <td className="py-3 px-4">{order.estimatedDeliveryTime}</td>
                                <td className="py-3 px-4">{order.paymentMethod}</td>
                                <td className="py-3 px-4">
                                    <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <button 
                                        onClick={() => showOrderDetails(order)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 mr-2"
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
)}

                {/* Order Details View */}
                {activeTab === "orders" && orderDetails && (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Order #{orderDetails._id} Details</h3>
            <button 
                onClick={() => setOrderDetails(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
                Back to Orders
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">Customer Information</h4>
                <p><span className="font-medium">Delivery Address:</span> {orderDetails.deliveryAddress || <span> Pick Up Order</span>}</p>
                <p><span className="font-medium">Email:</span> {orderDetails.userEmail}</p>
                
                <p><span className="font-medium">Order Date:</span> {formatDate(orderDetails.createdAt)}</p>
                <p><span className="font-medium">Payment Method:</span> {orderDetails.paymentMethod}</p>
                <p><span className="font-medium">Estimated Delivery:</span> {orderDetails.estimatedDeliveryTime}</p>
            </div>

            <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-3">Order Status</h4>
                <div className="mb-4">
                    <span className={`inline-block px-4 py-2 text-sm font-semibold text-white rounded-md ${getStatusColor(orderDetails.status)}`}>
                        {orderDetails.status}
                    </span>
                </div>
                
                <h5 className="font-medium mb-2">Update Status:</h5>
                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => updateOrderStatus(orderDetails._id, "New")}
                        className={`px-3 py-1 text-sm rounded ${orderDetails.status === "New" ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}
                        disabled={orderDetails.status === "New"}
                    >
                        New
                    </button>
                    <button 
                        onClick={() => updateOrderStatus(orderDetails._id, "Preparing")}
                        className={`px-3 py-1 text-sm rounded ${orderDetails.status === "Preparing" ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'}`}
                        disabled={orderDetails.status === "Preparing"}
                    >
                        Preparing
                    </button>
                    
                    {!orderDetails.deliveryAddress && (
                        <button 
                            onClick={() => updateOrderStatus(orderDetails._id, "Pick Up Ready")}
                            className={`px-3 py-1 text-sm rounded ${orderDetails.status === "Pick Up Ready" ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700'}`}
                            disabled={orderDetails.status === "Pick Up Ready"}
                        >
                            Pick Up Ready
                        </button>
                    )}

                    <button 
                        onClick={() => updateOrderStatus(orderDetails._id, "On the way")}
                        className={`px-3 py-1 text-sm rounded ${orderDetails.status === "On the way" ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}
                        disabled={orderDetails.status === "On the way"}
                    >
                        On The Way
                    </button>
                    <button 
                        onClick={() => updateOrderStatus(orderDetails._id, "Delivered")}
                        className={`px-3 py-1 text-sm rounded ${orderDetails.status === "Delivered" ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
                        disabled={orderDetails.status === "Delivered"}
                    >
                        Delivered
                    </button>
                    <button 
                        onClick={() => updateOrderStatus(orderDetails._id, "Cancelled")}
                        className={`px-3 py-1 text-sm rounded ${orderDetails.status === "Cancelled" ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
                        disabled={orderDetails.status === "Cancelled" || orderDetails.status === "Delivered"}
                    >
                        Cancel Order
                    </button>

                </div>
            </div>
        </div>

        <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-3">Order Items</h4>
            <table className="min-w-full">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left">Item</th>
                        <th className="py-2 px-4 text-right">Quantity</th>
                        <th className="py-2 px-4 text-right">Price</th>
                        <th className="py-2 px-4 text-right">Taxes</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.items.map((item, index) => (
                        <tr key={index} className="border-t">
                            <td className="py-3 px-4">{item.dishName || `Dish #${item.dishId}`}</td>
                            <td className="py-3 px-4 text-right">{item.quantity}</td>
                            <td className="py-3 px-4 text-right">${parseFloat(orderDetails.totalAmount).toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">No taxes</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="border-t font-bold text-lg">
                        <td colSpan="3" className="py-3 px-4 text-right">Total:</td>
                        <td className="py-3 px-4 text-right">${parseFloat(orderDetails.totalAmount).toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
)}

            </div>
        </div>
    );
};

export default RestaurantDashboard;