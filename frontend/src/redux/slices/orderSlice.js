import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cartItems: [],
  status: 'idle',
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex(order => order._id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
      }
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.cartItems.findIndex(item => item._id === newItem._id);
      
      if (existingItemIndex !== -1) {
        // If quantity is provided, use it, otherwise increment by 1
        if (newItem.quantity) {
          state.cartItems[existingItemIndex].quantity = newItem.quantity;
        } else {
          state.cartItems[existingItemIndex].quantity += 1;
        }
      } else {
        state.cartItems.push({ ...newItem, quantity: newItem.quantity || 1 });
      }
    },
    removeFromCart: (state, action) => {
      const { id } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(item => item._id === id);
      
      if (existingItemIndex !== -1) {
        const existingItem = state.cartItems[existingItemIndex];
        
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter(item => item._id !== id);
        } else {
          state.cartItems[existingItemIndex].quantity -= 1;
        }
      }
    },
    removeItemCompletely: (state, action) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter(item => item._id !== id);
    },
    clearCart(state) {
      state.cartItems = [];
    },
    setOrderStatus(state, action) {
      state.status = action.payload;
    },
    cancelOrderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    cancelOrderSuccess: (state, action) => {
      state.loading = false;
      state.orders = state.orders.filter(order => order._id !== action.payload);
    },
    cancelOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchOrdersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  removeItemCompletely,
  clearCart, 
  setOrderStatus,
  cancelOrderStart,
  cancelOrderSuccess,
  cancelOrderFailure,
  fetchOrdersStart,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrderStatus
} = orderSlice.actions;

// Thunk action to fetch orders using Redux auth state
export const fetchOrders = () => async (dispatch, getState) => {
  try {
    dispatch(fetchOrdersStart());
    
    // Get token from Redux auth state
    const { token } = getState().persistedReducer.auth;
    
    if (!token) {
      throw new Error("You must be logged in to view orders");
    }

    const response = await axios.get("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(fetchOrdersSuccess(response.data));
  } catch (error) {
    console.error("Error fetching orders:", error);
    dispatch(fetchOrdersFailure(error.response?.data?.message || "Failed to load your orders"));
  }
};

// Thunk action to cancel an order using Redux auth state
export const cancelOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch(cancelOrderStart());
    
    // Get token from Redux auth state
    const { token } = getState().persistedReducer.auth;
    
    if (!token) {
      throw new Error("Unauthorized. Please log in.");
    }

    await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(cancelOrderSuccess(orderId));
    return true;
  } catch (error) {
    console.error("Error canceling order:", error);
    dispatch(cancelOrderFailure(error.response?.data?.message || "Failed to cancel order"));
    return false;
  }
};

export default orderSlice.reducer;