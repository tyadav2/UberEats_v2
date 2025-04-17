import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Favorites from './pages/Favorites';
import RestaurantSignup from "./pages/RestaurantSignup";
import RestaurantLogin from "./pages/RestaurantLogin";
import RestaurantList from './components/RestaurantList';
import RestaurantDashboard from "./pages/RestaurantDashboard";
import Profile from "./pages/UserProfile";
import Orders from "./pages/Orders";
import CartPage from "./pages/CartPage";
import RestaurantPage from "./pages/RestaurantPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    

    return (
        <Router>
            <Routes>
            <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/restaurant/signup" element={<RestaurantSignup />} />
                <Route path="/restaurant/login" element={<RestaurantLogin />} />
                <Route path ="/restaurant/dashboard" element={<RestaurantDashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/restaurant/list" element={<RestaurantList />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/restaurants/:restaurantId" element={<RestaurantPage />} />
                <Route path="/cart" element={<CartPage />} />
            </Routes>
        </Router>
    );
}

export default App;
