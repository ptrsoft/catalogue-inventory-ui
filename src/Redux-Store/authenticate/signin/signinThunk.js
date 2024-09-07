import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

// Fetch products
export const authSignIn = createAsyncThunk("user/details", async (params, { rejectWithValue }) => {
  try {
    let url = config.AUTH_USER;
    const response = await postLoginService.post(url, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});