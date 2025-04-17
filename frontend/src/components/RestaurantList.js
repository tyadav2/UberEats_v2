import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');

  // Fetch restaurants when the component mounts
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Update sorted restaurants whenever restaurants data or sortOrder changes
  useEffect(() => {
    sortRestaurants();
  }, [restaurants, sortOrder]);

  // Function to fetch restaurants from backend API
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(res.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  // Function to sort the restaurants based on rating
  const sortRestaurants = () => {
    let sorted = [...restaurants];
    if (sortOrder === 'asc') {
      sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === 'desc') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    setSortedRestaurants(sorted);
  };

  // Handler for when sort order is changed
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Handler to reset sorting to default (unsorted order)
  const resetSorting = () => {
    setSortOrder('default');
    setSortedRestaurants(restaurants);
  };

  return (
    <div>
      <h2>Restaurant List</h2>
      <div>
        <label htmlFor="sort">Sort by rating: </label>
        <select id="sort" value={sortOrder} onChange={handleSortChange}>
          <option value="default">Default</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
        <button onClick={resetSorting}>Reset</button>
      </div>
      <ul>
        {sortedRestaurants.map((restaurant) => (
          <li key={restaurant._id}>
            <h3>{restaurant.name}</h3>
            <p>Rating: {restaurant.rating}</p>
            <p>{restaurant.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RestaurantList;
