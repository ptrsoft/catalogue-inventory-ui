// runsheetSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createRunsheet, fetchRunsheet, fetchRunsheetById,closeRunsheet } from './RunsheetThunk'; // Import the thunk

// Define the initial state
const initialState = {
  message: '',
  loading: false,
  error: null,
  runsheetData: [], // Array to store fetched runsheet data
  selectedRunsheet: null, // Add this line to store fetched runsheet by ID
};

// Create the slice
const runsheetSlice = createSlice({
  name: 'runsheet',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling createRunsheet actions
    builder
      .addCase(createRunsheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRunsheet.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message; // Adjust this according to your response structure
      })
      .addCase(createRunsheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling fetchRunsheet actions
      .addCase(fetchRunsheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRunsheet.fulfilled, (state, action) => {
        state.loading = false;
        state.runsheetData = action.payload; // Store the fetched runsheet data
      })
      .addCase(fetchRunsheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handling fetchRunsheetById actions
      .addCase(fetchRunsheetById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedRunsheet = null; // Reset selected runsheet on new fetch
      })
      .addCase(fetchRunsheetById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRunsheet = action.payload; // Store the fetched runsheet by ID
      })
      .addCase(fetchRunsheetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(closeRunsheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closeRunsheet.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRunsheet = { ...state.selectedRunsheet, status: "closed" };
      })
      .addCase(closeRunsheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  
  },
});

export default runsheetSlice.reducer;
