import { createSlice } from '@reduxjs/toolkit';
import { authSignIn } from './authThunk';

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    signout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true; // Automatically set to true when setting user
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(authSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { signout, setUser } = authSlice.actions; // Export setUser
export default authSlice.reducer;