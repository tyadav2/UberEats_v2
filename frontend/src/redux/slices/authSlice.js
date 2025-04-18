import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;