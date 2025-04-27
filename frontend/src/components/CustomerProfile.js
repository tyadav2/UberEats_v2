import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerProfile = () => {
    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dob, setDob] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('customerToken')}` }
            });
            
            const userData = response.data;
            setUser(userData);
            setName(userData.name || '');
            setEmail(userData.email || '');
            setCountry(userData.country || '');
            setState(userData.state || '');
            setCity(userData.city || '');
            setPhoneNumber(userData.phoneNumber || '');
            setProfilePic(userData.profilePic || '');
            
            // Format date for input if it exists
            if (userData.dob) {
                const date = new Date(userData.dob);
                setDob(date.toISOString().split('T')[0]);
            }
            
            console.log("Fetched user data:", userData);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setMessage('Failed to load profile data');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const userData = {};
        if (name) userData.name = name;
        if (email) userData.email = email;
        if (country) userData.country = country;
        if (state) userData.state = state;
        if (city) userData.city = city;
        if (phoneNumber) userData.phoneNumber = phoneNumber;
        if (profilePic) userData.profilePic = profilePic;
        if (dob) userData.dob = dob;

        console.log("Sending update with data:", userData);

        try {
            const response = await axios.put(
                'http://localhost:5000/api/users/profile', 
                userData, 
                {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('customerToken')}`
                    }
                }
            );
            
            console.log("Update response:", response.data);
            setMessage('Profile updated successfully!');
            
            // Refresh user data after update
            fetchUserData();
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMsg = error.response?.data?.message || error.message;
            console.error('Error details:', error.response?.data);
            setMessage('Error updating profile: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Customer Profile</h2>
                
                {message && (
                    <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                
                <form onSubmit={handleProfileUpdate}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your city"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                        <input
                            type="text"
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your state"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your country"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                        <input
                            type="text"
                            id="profilePic"
                            value={profilePic}
                            onChange={(e) => setProfilePic(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter URL to your profile picture"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerProfile;
