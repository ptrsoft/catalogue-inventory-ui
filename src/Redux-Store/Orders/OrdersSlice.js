// orderInventorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchOrderInventory, fetchOrderById, cancelOrder, fetchOrderStats,fetchUsers } from './OrdersThunk'; // Import the fetchOrderStats thunk
import status from "Redux-Store/Constants";

// Define the initial state
const initialState = {
    orders: {
        nextKey: null, 
        data: {},  // Change from array to object for pagination
        status: 'idle',
        error: null,

    },
    count: 0,
    loading: false,
    error: null,
    selectedOrder: null,  // To hold the specific order fetched by ID
    cancelStatus: 'idle', // To track the cancel order request status
    cancelError: null,    // To track errors related to order cancellation
    orderStats: null,     // To hold order stats data
    statsLoading: false,  // To track loading state for stats API
    statsError: null ,
    users:null,

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
                const { data } = action.payload; // Directly access data from the API response
                 // Get the current page based on the request
            
      const currentPage = action.meta.arg.pageKey ? action.meta.arg.pageKey : 1;
      state.orders.data[currentPage] = data.items; // Store items directly in the state
        // Set nextKey for pagination
        console.log(data.items,"data");
        state.orders.nextKey = data.nextKey; // Save nextKey for further requests
           
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
                fetchOrderInventory()
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.cancelStatus = 'failed';
                state.cancelError = action.payload || action.error.message;
            })

            // Handle fetchOrderStats actions (New)
            .addCase(fetchOrderStats.pending, (state) => {
                state.statsLoading = true;
                state.statsError = null; // Reset the stats error
            })
            .addCase(fetchOrderStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.orderStats = action.payload; // Store the stats data
            })
            .addCase(fetchOrderStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.statsError = action.error.message;
            })
                    // Handle fetchUsers actions
                    .addCase(fetchUsers.pending, (state) => {
                        state.statsLoading = true;
                        state.statsError = null;
                    })
                    .addCase(fetchUsers.fulfilled, (state, action) => {
                        state.loading = false;
                        state.users = action.payload; // Assuming user stats or list is stored here
                    })
                    .addCase(fetchUsers.rejected, (state, action) => {
                        state.statsLoading = false;
                        state.statsError = action.payload || action.error.message;
                    });
        
    },
});

// Export the reducer
export default orderInventorySlice.reducer;
