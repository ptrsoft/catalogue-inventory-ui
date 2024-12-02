import { createSlice } from '@reduxjs/toolkit';
import { 
    fetchOrderInventory, 
    fetchOrderById, 
    cancelOrder, 
    fetchOrderStats, 
    fetchUsers, 
    packOrders, 
    fetchUsersbyid 
} from './OrdersThunk'; 
import status from 'Redux-Store/Constants';


// Initial state
const initialState = {
    orders: {
        nextKey: null,
        data: {}, // Object for paginated data
        status: 'idle',
        error: null,
    },
    count: 0,
    loading: false,
    error: null,
    selectedOrder: null,
    cancelStatus: 'idle',
    cancelError: null,
    orderStats: null,
    statsLoading: false,
    statsError: null,
    users: null,
    usersbyid: [],
    userStatusLoading: false,
    cancelUserStatus: 'idle',
    cancelUserError: null,
    packStatus: null,
};

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
                const currentPageKey = action.meta.arg?.pageKey || 1; // Fallback to page 1
                console.log('Fetching orders for pageKey:', currentPageKey);

                if (typeof state.orders.data !== 'object' || state.orders.data === null) {
                    console.error('state.orders.data not initialized properly, resetting.');
                    state.orders.data = {}; // Initialize as an empty object
                }

                // Ensure the page key is initialized as an array
                state.orders.data[currentPageKey] = Array.isArray(data.items) ? data.items : [];
                state.orders.nextKey = data.nextKey;
                state.loading = false;
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
                const canceledOrderId = action.payload.id;

                // Update the order's status to "Cancelled"
                state.orders.data = Object.keys(state.orders.data).reduce((acc, pageKey) => {
                    acc[pageKey] = state.orders.data[pageKey].map(order =>
                        order.id === canceledOrderId
                            ? { ...order, orderStatus: 'Cancelled' }
                            : order
                    );
                    return acc;
                }, {});

                state.cancelStatus = status.SUCCESS;
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

            // Handle fetchUsersbyid actions
            .addCase(fetchUsersbyid.pending, (state) => {
                state.userStatusLoading = true;
                state.cancelUserError = null;
            })
            .addCase(fetchUsersbyid.fulfilled, (state, action) => {
                state.userStatusLoading = false;
                const newUser = action.payload;
                const userExists = state.usersbyid.some(user => user.id === newUser.id);
                if (!userExists) {
                    state.usersbyid.push(newUser);
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
            .addCase(packOrders.fulfilled, (state, action) => {
                const updatedOrderId = action.payload.id;

                // Update the order's status to "Packed"
                state.orders.data = Object.keys(state.orders.data).reduce((acc, pageKey) => {
                    acc[pageKey] = state.orders.data[pageKey].map(order =>
                        order.id === updatedOrderId
                            ? { ...order, orderStatus: 'Packed' }
                            : order
                    );
                    return acc;
                }, {});

                state.packStatus = status.SUCCESS;
            })
            
            .addCase(packOrders.rejected, (state, action) => {
                state.packStatus = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

// Export the reducer
export default orderInventorySlice.reducer;
