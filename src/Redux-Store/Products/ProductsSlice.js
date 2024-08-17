import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts,addProduct, uploadImage  } from './ProductThunk';

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
      const product = state.products.data.find(p => p.itemCode === action.payload.itemCode);
      if (product) {
        product.status = product.status === "Active" ? "Inactive" : "Active";
      }
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
      })
      .addCase(uploadImage.pending, (state) => {
        state.status = 'uploading';
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // You can save the image URL if needed
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { toggleStatus } = productsSlice.actions;
export default productsSlice.reducer;
