import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

export const authSignOut = createAsyncThunk("products/fetch", async (params, { rejectWithValue }) => {
    try {
      let url = config.SIGNOUT;
      const response = await postLoginService.post(url, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });