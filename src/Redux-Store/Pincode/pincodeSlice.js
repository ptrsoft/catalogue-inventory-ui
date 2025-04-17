import { createSlice } from '@reduxjs/toolkit';
import { checkPincode,updatePincode, getPincodes,updateDeliveryType,updateStatus } from './pincodeThunk';

const pincodeSlice = createSlice({
  name: 'pincode',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPincodeState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPincode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPincode.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(checkPincode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePincode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePincode.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updatePincode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add your getPincodes case here
      .addCase(getPincodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPincodes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getPincodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // New case for the updateDeliveryType thunk
      .addCase(updateDeliveryType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryType.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateDeliveryType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
  },
});

export const { resetPincodeState } = pincodeSlice.actions;

export default pincodeSlice.reducer;
