// src/Redux-Store/ForgotPwd/forgotPwdSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { forgotPwd } from "./forgotPwdThunk";

const initialState = {
  email: "", // Add email to the initial state
  loading: false,
  success: null,
  error: null,
};

// Slice to handle the state
const forgotPwdSlice = createSlice({
  name: "forgotPwd",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
      state.email = ""; // Reset email as well
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPwd.pending, (state, action) => {
        state.loading = true;
        state.success = null;
        state.error = null;
        state.email = action.meta.arg; // Store the email in state
      })
      .addCase(forgotPwd.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(forgotPwd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = forgotPwdSlice.actions;

export default forgotPwdSlice.reducer;
