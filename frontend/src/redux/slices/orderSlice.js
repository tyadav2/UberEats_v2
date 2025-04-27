import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  status: 'idle', // e.g., idle | pending | confirmed
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    
addToCart: (state, action) => {
  const newItem = action.payload;
  const existingItemIndex = state.cartItems.findIndex(item => item._id === newItem._id);
  
  if (existingItemIndex !== -1) {
    state.cartItems[existingItemIndex].quantity += 1;
  } else {
    state.cartItems.push({ ...newItem, quantity: 1 });
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