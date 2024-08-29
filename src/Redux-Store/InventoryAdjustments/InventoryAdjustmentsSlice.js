import { createSlice } from '@reduxjs/toolkit';
import status from 'Redux-Store/Constants';
import { CreateAdjustment, fetchAdjustments } from './InventoryAdjustmentsThunk';

const inventoryAdjustmentsSlice = createSlice({
  name: 'adjustments',
  initialState: {
    adjustments: {
      data: [],
      status: 'idle',
      error: null
    },
    createAdjustment: {
      status: 'idle',
      error: null,
    },
  },
  extraReducers: (builder) => {
    // For GET API
    builder
      .addCase(fetchAdjustments.pending, (state) => {
        state.adjustments.status = status.IN_PROGRESS;
      })
      .addCase(fetchAdjustments.fulfilled, (state, action) => {
        state.adjustments.data = action.payload;
        state.adjustments.status = status.SUCCESS;
      })
      .addCase(fetchAdjustments.rejected, (state, action) => {
        state.adjustments.status = status.FAILURE;
        state.adjustments.error = action.error.message;
      });

    // For POST API
    builder
      .addCase(CreateAdjustment.pending, (state) => {
        state.createAdjustment.status = status.IN_PROGRESS;
        state.createAdjustment.error = null;
      })
      .addCase(CreateAdjustment.fulfilled, (state, action) => {
        state.createAdjustment.status = status.SUCCESS;
        state.adjustments.data.push(action.payload); // Add the new adjustment to the list
      })
      .addCase(CreateAdjustment.rejected, (state, action) => {
        state.createAdjustment.status = status.FAILURE;
        state.createAdjustment.error = action.error.message;
      });
  },
});

export default inventoryAdjustmentsSlice.reducer;
