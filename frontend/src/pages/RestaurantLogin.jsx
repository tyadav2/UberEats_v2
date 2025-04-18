import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';

const RestaurantLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const data = { email, password };
      
        try {
          const response = await axios.post('http://localhost:5000/api/restaurants/login', data);
      
          dispatch(login({
            token: response.data.token,
            user: response.data.restaurant || { email },
            role: 'restaurant',
          }));
      
          alert(response.data.message);
          navigate('/restaurant/dashboard');
        } catch (error) {
          alert('Error: ' + (error.response?.data?.message || 'Login failed!'));
        }
      };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Navbar hideBranding={true} />
            {/* Logo with Home Redirection */}
            <div className="absolute top-6 left-12 cursor-pointer" onClick={() => navigate('/')}>
                <h1 className="text-2xl font-bold text-green-600">
                    Uber Eats <span className="text-gray-700">for Merchants</span>
                </h1>
            </div>

            {/* Login Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Restaurant Login</h2>
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your restaurant email"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestaurantLogin;