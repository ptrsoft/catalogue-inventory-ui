import { createSlice } from "@reduxjs/toolkit";
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
    addProduct: (state, action) => {
      state.products.data.push(action.payload);
    },
    toggleStatus: (state, action) => {
      const product = state.products.data.find(p => p.itemCode === action.payload.itemCode);
      if (product) {
        product.status = product.status === "Active" ? "Inactive" : "Active";
      }
    },
  },
});

export const { addProduct, toggleStatus } = productsSlice.actions;

export default productsSlice.reducer;
