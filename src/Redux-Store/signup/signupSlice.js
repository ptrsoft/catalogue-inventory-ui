import { createSlice } from "@reduxjs/toolkit";
import { signup } from "./signupThunk"; // Adjust the path as necessary

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetSignupState } = signupSlice.actions;
export default signupSlice.reducer;
