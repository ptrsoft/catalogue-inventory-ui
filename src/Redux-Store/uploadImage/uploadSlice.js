import { createSlice } from "@reduxjs/toolkit";
import { uploadImage } from "./uploadThunk"; // Update with the correct path

const imageUploadSlice = createSlice({
  name: "imageUpload",
  initialState: {
    imageUrl: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUrl = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default imageUploadSlice.reducer;
