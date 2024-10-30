// src/features/cashCollection/cashCollectionSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { fetchCashCollection } from './cashCollectionThunk';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const cashCollectionSlice = createSlice({
  name: 'cashCollection',
  initialState,
  reducers: {
    resetData: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCashCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCashCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCashCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetData } = cashCollectionSlice.actions;

export default cashCollectionSlice.reducer;
