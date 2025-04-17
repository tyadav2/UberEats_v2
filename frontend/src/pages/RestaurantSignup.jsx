import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RestaurantSignup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [description, setDescription] = useState('');
    const [businessHours, setBusinessHours] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [rating, setRating] = useState(0);
    const [priceRange, setPriceRange] = useState('$');
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name, email, password, cuisine, category, location, address, phone_number: phoneNumber,
            description, business_hours: businessHours, delivery_time: deliveryTime, image_url: imageUrl,
            rating, price_range: priceRange, is_open: isOpen
        };

        try {
            const response = await axios.post('http://localhost:5000/api/restaurants/signup', data);
            alert(response.data.message);
            navigate('/restaurant/login');
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || "Signup failed!"));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <Navbar hideBranding={true} />
            {/* Logo with Home Redirection */}
            <div className="absolute top-6 left-12 cursor-pointer" onClick={() => navigate('/')}>
                <h1 className="text-2xl font-bold text-green-600">
                    Uber Eats <span className="text-gray-700">for Merchants</span>
                </h1>
            </div>

            {/* Signup Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Add Your Restaurant</h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Cuisine */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cuisine</label>
                        <input type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Decription */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Business Hours */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Business Hours</label>
                        <input type="text" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Delivery Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Delivery Time</label>
                        <input type="text" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} className="w-full p-2 border rounded-lg" required />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price Range</label>
                        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full p-2 border rounded-lg">
                            <option value="$">$ (Budget)</option>
                            <option value="$$">$$ (Moderate)</option>
                            <option value="$$$">$$$ (Expensive)</option>
                        </select>
                    </div>

                    {/* Is Open Checkbox */}
                    <div className="col-span-2 flex items-center">
                        <input type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        <label className="ml-2 text-sm text-gray-700">Is Open?</label>
                    </div>

                    {/* Signup Button */}
                    <div className="col-span-2">
                        <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RestaurantSignup;