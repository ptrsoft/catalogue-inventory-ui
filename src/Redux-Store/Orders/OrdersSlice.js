// orderInventorySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchOrderInventory, fetchOrderById } from './OrdersThunk'; // Import the new thunk

// Define the initial state
const initialState = {
    orders: [],
    count: 0,
    loading: false,
    error: null,
    selectedOrder: null, // To hold the specific order fetched by ID
};

// Create the slice
const orderInventorySlice = createSlice({
    name: 'orderInventory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            });
    },
});

// Export the reducer
export default orderInventorySlice.reducer;
