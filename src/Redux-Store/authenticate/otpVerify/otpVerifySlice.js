// src/Redux-Store/ForgotPwd/forgotPwdSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  otp: "",  // Initialize otp in the state
  loading: false,
  success: null,
  error: null,
};

// Slice to handle the state
const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    setOtp: (state, action) => {
      state.otp = action.payload; // Store the OTP value in the state
    },
    resetState: (state) => {
      state.otp = ""; // Reset OTP
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
});

export const { setOtp, resetState } = otpSlice.actions;

export default otpSlice.reducer;
