import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

export const authSignOut = createAsyncThunk(
  "auth/signOut",
  async ({ accessToken }, { rejectWithValue }) => { // Expect an object with accessToken
    try {
      const url = config.SIGNOUT;
      const response = await postLoginService.post(url, { accessToken }); // Use the expected payload
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: 'Unknown error' });
    }
  }
);
