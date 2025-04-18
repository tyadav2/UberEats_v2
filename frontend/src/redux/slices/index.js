import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import restaurantReducer from './restaurantSlice';
import orderReducer from './orderSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  order: orderReducer,
});

export default rootReducer;