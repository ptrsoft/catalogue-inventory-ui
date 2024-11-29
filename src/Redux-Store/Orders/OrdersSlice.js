// orderInventorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchOrderInventory, fetchOrderById, cancelOrder, fetchOrderStats, fetchUsers, packOrders, fetchUsersbyid } from './OrdersThunk'; // Import the fetchOrderStats thunk
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
    statsError: null,
    users: null,
    usersbyid: [], // Updated to handle multiple users
    userStatusLoading: false,  // Renamed from 'useridstatusloading' for clarity
    cancelUserStatus: 'idle',  // Renamed from 'canceluser' for clarity
    cancelUserError: null,    // Renamed for consistency
    packStatus: null,         // Track packOrders status
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
                const { data } = action.payload;
                const currentPage = action.meta.arg.pageKey || 1;
                state.orders.data[currentPage] = data.items;
                state.orders.nextKey = data.nextKey;
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
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle cancelOrder actions
            .addCase(cancelOrder.pending, (state) => {
                state.cancelStatus = 'loading';
                state.cancelError = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.cancelStatus = 'succeeded';
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.cancelStatus = 'failed';
                state.cancelError = action.payload || action.error.message;
            })

            // Handle fetchOrderStats actions
            .addCase(fetchOrderStats.pending, (state) => {
                state.statsLoading = true;
                state.statsError = null;
            })
            .addCase(fetchOrderStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.orderStats = action.payload;
            })
            .addCase(fetchOrderStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.statsError = action.error.message;
            })

            // Handle fetchUsers actions
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Handle fetchUsers by ID actions
            .addCase(fetchUsersbyid.pending, (state) => {
                state.userStatusLoading = true;
                state.cancelUserError = null;
            })
            .addCase(fetchUsersbyid.fulfilled, (state, action) => {
                state.userStatusLoading = false;

                // Ensure no duplicates in `usersbyid` array
                const newUser = action.payload;
                const userExists = state.usersbyid.some(user => user.id === newUser.id);

                if (!userExists) {
                    state.usersbyid = [...state.usersbyid, newUser];
                }
            })
            .addCase(fetchUsersbyid.rejected, (state, action) => {
                state.userStatusLoading = false;
                state.cancelUserError = action.payload || action.error.message;
            })

            // Handle packOrders actions
            .addCase(packOrders.pending, (state) => {
                state.packStatus = 'loading';
                state.error = null;
            })
            .addCase(packOrders.fulfilled, (state) => {
                state.packStatus = 'succeeded';
                
             
            })
            .addCase(packOrders.rejected, (state, action) => {
                state.packStatus = 'failed';
                state.error = action.payload;
            });
    },
});

// Export the reducer
export default orderInventorySlice.reducer;
