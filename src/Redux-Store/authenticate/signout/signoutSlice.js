// signoutThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

const authSignOut = createAsyncThunk("auth/signOut", async (token, { rejectWithValue }) => {
  try {
    const url = config.SIGNOUT;
    const response = await postLoginService.post(url, { token });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
export default authSignOut;