import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

// Async thunk for sending OTP to reset password
export const forgotPwd = createAsyncThunk(
  "forgotPwd/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const url = config.FORGOT_PASSSWORD;
      const response = await postLoginService.post(url, { email });
      return response.data;
    } catch (error) {
      // Handle error by rejecting with the response data
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
