import { createSlice } from '@reduxjs/toolkit';
import { authSignIn } from './signinThunk';

const authSlice = createSlice({
    name: "auth",
    initialState: {
      user: null,
      loading: false,
      error: null,
    },
    reducers: {
      // Optional: define other reducers if needed
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
        })
        .addCase(authSignIn.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export default authSlice.reducer;