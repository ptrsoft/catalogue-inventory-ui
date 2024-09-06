// Redux-Store/authenticate/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { authSignOut } from "./signoutThunk";

const initialState = {
  isSigningOut: false,
  signOutError: null,
};

const authSlice = createSlice({
  name: "signOut",
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(authSignOut.pending, (state) => {
        state.isSigningOut = true;
        state.signOutError = null;
      })
      .addCase(authSignOut.fulfilled, (state) => {
        state.isSigningOut = false;
        state.signOutError = null;
      })
      .addCase(authSignOut.rejected, (state, action) => {
        state.isSigningOut = false;
        state.signOutError = action.payload || action.error.message;
      });
  },
});

export const { actions, reducer } = authSlice;
export default reducer;
