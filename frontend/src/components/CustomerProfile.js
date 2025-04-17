import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerProfile = () => {
    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('customerToken')}` }
                });
                setUser(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setCountry(response.data.country);
                setState(response.data.state);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        const data = { name, email, country, state, profilePicture };

        try {
            await axios.put('http://localhost:5000/api/users/profile', data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('customerToken')}` }
            });
            alert('Profile updated successfully');
        } catch (error) {
            alert('Error updating profile');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Customer Profile</h2>
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
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                            type="text"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your country"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">State (Abbreviation)</label>
                        <input
                            type="text"
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your state (abbreviation)"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input
                            type="file"
                            id="profilePicture"
                            onChange={(e) => setProfilePicture(e.target.files[0])}
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerProfile;
