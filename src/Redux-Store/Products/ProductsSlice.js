import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, PutToggle, updateProductsStatus } from './ProductThunk'; // Ensure to import updateProductsStatus
import status from "Redux-Store/Constants";

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
        state.products.status = status.IN_PROGRESS;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.data = action.payload;
        state.products.status = status.SUCCESS;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.status = status.FAILURE;
        state.products.error = action.error.message;
      })
      // Toggle Product Active/Inactive Status
      .addCase(PutToggle.pending, (state) => {
        state.products.status = status.IN_PROGRESS;
      })
      .addCase(PutToggle.fulfilled, (state, { payload }) => {
        state.products.status = status.SUCCESS;
        // Update the specific product in the `products.data` array
        state.products.data = state.products.data.map((product) =>
          product.id === payload.id ? { ...product, active: payload.active } : product
        );
      })
      .addCase(PutToggle.rejected, (state) => {
        state.products.status = status.FAILURE;
      })
      // Update Multiple Products Status
      .addCase(updateProductsStatus.pending, (state) => {
        state.products.status = status.IN_PROGRESS;
      })
      .addCase(updateProductsStatus.fulfilled, (state, { payload }) => {
        state.products.status = status.SUCCESS;
        // Assume payload contains updated product data; adjust accordingly
        const updatedIds = payload.id.split(','); // Split the IDs
        const activeStatus = payload.active; // Get active status

        // Update the status of products in the `products.data` array
        state.products.data = state.products.data.map((product) =>
          updatedIds.includes(product.id) ? { ...product, active: activeStatus } : product
        );
      })
      .addCase(updateProductsStatus.rejected, (state, action) => {
        state.products.status = status.FAILURE;
        state.products.error = action.error.message;
      });
  },
});

export const { toggleStatus } = productsSlice.actions;
export default productsSlice.reducer;
