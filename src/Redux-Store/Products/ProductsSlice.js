import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, addProduct } from "Redux-Store/Products/ProductThunk";
import productlist from "Redux-Store/Products/dummy/productlist.json";

const initialState = {
  products: {
    status: "SUCCESS",
    data: productlist,
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
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
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.status = "SUCCESS";
        state.products.data = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.data.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.products.status = "ERROR";
        state.products.error = action.payload;
      });
  },
});

export const { toggleStatus } = productsSlice.actions;

export default productsSlice.reducer;
