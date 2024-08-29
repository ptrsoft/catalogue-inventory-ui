import { createSlice } from '@reduxjs/toolkit';
import { fetchProducts, PutToggle  } from './ProductThunk';
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
          state.products.data = state.products.data.items.map((product) =>
            product.id === payload.id ? { ...product, active: payload.isActive } : product
          );
        })
        .addCase(PutToggle.rejected, (state) => {
          state.products.status = status.FAILURE;
        });
  },
});

export const { toggleStatus } = productsSlice.actions;
export default productsSlice.reducer;
