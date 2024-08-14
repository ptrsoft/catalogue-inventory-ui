import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts } from './ProductThunk';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: {
      data: [],
      status: 'idle',
      error: null
    }
  },
  reducers: {
    toggleStatus: (state, action) => {
      // Your toggle status logic here
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.products.status = 'LOADING';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.data = action.payload;
        state.products.status = 'SUCCEEDED';
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.status = 'ERROR';
        state.products.error = action.error.message;
      });
  },
});

export const { toggleStatus } = productsSlice.actions;
export default productsSlice.reducer;
