import { createSlice } from "@reduxjs/toolkit";
import { fetchOrders, ordersDetails, fetchOrderStatus, updateOrderStatus, assignDeliveryBoyAndMoveToOnTheWay } from "Redux-Store/Orders/OrdersThunk";
import status from "Redux-Store/Constants";

const OrderSlice = createSlice({
  name: "orders",
  initialState: {
    ordersData: {
      status: null,
      data: [], // Ensure this is an array
      nextKey: null, // Add this line
    },
    order_details: {
      status: null,
    },
    order_status: {
      status: null,
    },
    updateOrderStatus: {
      status: null,
    },
    assignDeliveryBoyAndMoveToOnTheWay: {
      status: null,
    },
    filteredOrders: {
      status: null,
      data: [], // Ensure this is an array
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending.toString(), (state, action) => {
        return {
          ...state,
          ordersData: {
            status: status.IN_PROGRESS,
          },
        };
      })
      .addCase(fetchOrders.fulfilled.toString(), (state, { payload }) => {
        return {
          ...state,
          ordersData: {
            status: status.SUCCESS,
            data: payload,
            
          },
        };
      })
      .addCase(fetchOrders.rejected.toString(), (state, action) => {
        return {
          ...state,
          ordersData: {
            status: status.FAILURE,
          },
        };
      })
      .addCase(ordersDetails.pending.toString(), (state, action) => {
        return {
          ...state,
          order_details: {
            status: status.IN_PROGRESS,
          },
        };
      })
      .addCase(ordersDetails.fulfilled.toString(), (state, { payload }) => {
        return {
          ...state,
          order_details: {
            status: status.SUCCESS,
            data: payload,
          },
        };
      })
      .addCase(ordersDetails.rejected.toString(), (state, action) => {
        return {
          ...state,
          order_details: {
            status: status.FAILURE,
          },
        };
      })
      .addCase(fetchOrderStatus.pending.toString(), (state) => {
        state.order_status.status = status.IN_PROGRESS;
      })
      .addCase(fetchOrderStatus.fulfilled.toString(), (state, { payload }) => {
        state.order_status = {
          status: status.SUCCESS,
          data: payload,
        };
      })
      .addCase(fetchOrderStatus.rejected.toString(), (state) => {
        state.order_status.status = status.FAILURE;
      })
      .addCase(updateOrderStatus.pending.toString(), (state) => {
        state.updateOrderStatus.status = status.IN_PROGRESS;
      })
      .addCase(updateOrderStatus.fulfilled.toString(), (state, { payload }) => {
        state.updateOrderStatus = {
          status: status.SUCCESS,
          data: payload,
        };
      })
      .addCase(updateOrderStatus.rejected.toString(), (state) => {
        state.updateOrderStatus.status = status.FAILURE;
      })
      .addCase(assignDeliveryBoyAndMoveToOnTheWay.pending.toString(), (state) => {
        state.assignDeliveryBoyAndMoveToOnTheWay.status = status.IN_PROGRESS;
      })
      .addCase(assignDeliveryBoyAndMoveToOnTheWay.fulfilled.toString(), (state, { payload }) => {
        state.assignDeliveryBoyAndMoveToOnTheWay = {
          status: status.SUCCESS,
          data: payload,
        };
      })
      .addCase(assignDeliveryBoyAndMoveToOnTheWay.rejected.toString(), (state) => {
        state.assignDeliveryBoyAndMoveToOnTheWay.status = status.FAILURE;
      });
      // .addCase(fetchFilteredOrders.pending, (state) => {
      //   state.filteredOrders.status = status.IN_PROGRESS;
      //   state.filteredOrders.error = null;
      // })
      // .addCase(fetchFilteredOrders.fulfilled, (state, action) => {
      //   state.filteredOrders.status = status.SUCCESS;
      //   state.filteredOrders.data = action.payload; 
      // })
      // .addCase(fetchFilteredOrders.rejected, (state, action) => {
      //   state.filteredOrders.status = status.FAILURE;
      //   state.filteredOrders.error = action.payload;
      // });
        },
});

export default OrderSlice.reducer;