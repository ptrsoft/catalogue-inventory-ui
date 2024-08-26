import { createSlice } from "@reduxjs/toolkit";
import { resetPassword } from "./newPwdThunk" // Adjust the import path as necessary

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const resetPwdSlice = createSlice({
  name: "resetPwd",
  initialState,
  reducers: {
    resetState: (state) => {
        state.loading = false;
        state.success = null;
        state.error = null;
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to sign in";
      });
  },
});

export const { clearError, signOut } = resetPwdSlice.actions;

export default resetPwdSlice.reducer;
