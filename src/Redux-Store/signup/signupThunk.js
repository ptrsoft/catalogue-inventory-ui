import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

export const signup = createAsyncThunk("signup", async (params, { rejectWithValue }) => {
  try {
    const url = config.SIGNUP;
    const response = await postLoginService.post(url, {params});
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
