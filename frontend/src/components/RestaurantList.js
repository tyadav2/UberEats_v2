import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../redux/slices/restaurantSlice';

function RestaurantList() {
  const dispatch = useDispatch();
  const { restaurants, loading, error } = useSelector((state) => state.restaurant);
  const [sortOrder, setSortOrder] = useState('default');
  const [sortedRestaurants, setSortedRestaurants] = useState([]);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  useEffect(() => {
    let sorted = [...restaurants];
    if (sortOrder === 'asc') {
      sorted.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === 'desc') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    setSortedRestaurants(sorted);
  }, [restaurants, sortOrder]);

  if (loading) return <p>Loading restaurants...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Restaurants</h2>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="default">Sort by Default</option>
        <option value="asc">Sort by Rating (Asc)</option>
        <option value="desc">Sort by Rating (Desc)</option>
      </select>
      <ul>
        {sortedRestaurants.map((restaurant) => (
          <li key={restaurant._id} className="border-b py-2">
            {restaurant.name} - Rating: {restaurant.rating}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RestaurantList;
