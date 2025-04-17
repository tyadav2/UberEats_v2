import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  status: 'idle', // e.g., idle | pending | confirmed
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addToCart(state, action) {
      state.cartItems.push(action.payload);
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload.id);
    },
    clearCart(state) {
      state.cartItems = [];
    },
    setOrderStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;