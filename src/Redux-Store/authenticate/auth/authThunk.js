import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config"; // Ensure the correct import path
import { postLoginService } from "Services";

// Thunk for signing in
export const authSignIn = createAsyncThunk("auth/signin", async (params, { rejectWithValue }) => {
  console.log("Params received for login:", params); // Log parameters

  try {
    const url = config.AUTH_USER; // Ensure this URL is correct
    const response = await postLoginService.post(url, params);
    console.log("Response from API:", response); // Log the response
    
    
    // Check if the response has the expected data structure
    if (response.data) {
      return response.data; // Return the payload for fulfilled state
    }
    
    // Handle unexpected response format
    return rejectWithValue("Unexpected response format");
  } catch (error) {
    console.error("API error:", error); // Log any API errors
      return rejectWithValue(error.response?.data || "An error occurred");
  }
});

