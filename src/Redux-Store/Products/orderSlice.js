import { createSlice } from "@reduxjs/toolkit";
import orderlist from "Redux-Store/Products/dummy/orderHistory.json";

const initialState = {
  orders: {
    status: "SUCCESS",
    data: orderlist,
  },
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrders: (state, action) => {
      state.orders.data.push(action.payload);
    },
  },
});

export const { addOrders} = orderSlice.actions;

export default orderSlice.reducer;
