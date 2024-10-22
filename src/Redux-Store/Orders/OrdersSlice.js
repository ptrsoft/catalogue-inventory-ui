// orderInventorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchOrderInventory, fetchOrderById, cancelOrder } from './OrdersThunk'; // Import the cancelOrder thunk

// Define the initial state
const initialState = {
    orders: [],
    count: 0,
    loading: false,
    error: null,
    selectedOrder: null, // To hold the specific order fetched by ID
    cancelStatus: 'idle', // To track the cancel order request status
    cancelError: null,    // To track errors related to order cancellation
};

// Create the slice
const orderInventorySlice = createSlice({
    name: 'orderInventory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetchOrderInventory actions
            .addCase(fetchOrderInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.items;
                state.count = action.payload.count;
            })
            .addCase(fetchOrderInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle fetchOrderById actions
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload; // Store the specific order
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle cancelOrder actions
            .addCase(cancelOrder.pending, (state) => {
                state.cancelStatus = 'loading';
                state.cancelError = null; // Reset the error state for cancel order
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.cancelStatus = 'succeeded';
                // Optionally update the order's status in the list
                const cancelledOrderId = action.meta.arg.orderId; // Get the orderId from the action
                state.orders = state.orders.map(order => 
                    order.id === cancelledOrderId ? { ...order, status: 'Cancelled' } : order
                );
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.cancelStatus = 'failed';
                state.cancelError = action.payload || action.error.message;
            });
    },
});

// Export the reducer
export default orderInventorySlice.reducer;
