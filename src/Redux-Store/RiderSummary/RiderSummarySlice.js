// src/redux/slices/ridersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchRiders, fetchRiderById, verifyOrRejectDocument, updateRiderStatus } from './RiderSummaryThunk'; // Adjust import path as necessary

const ridersSlice = createSlice({
    name: 'riders',
    initialState: {
        items: [],           // List of all riders
        count: 0,            // Count of riders
        status: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,         // Error message for fetching all riders
        rider: null,         // Data for a single rider
        riderStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        riderError: null,    // Error message for fetching a specific rider
        documentStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        documentError: null, // Error message for document verification/rejection
        updateStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        updateError: null,   // Error message for updating rider status
    },
    reducers: {},
    extraReducers: (builder) => {
        // Handling fetchRiders (Fetching all riders)
        builder
            .addCase(fetchRiders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRiders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.count = action.payload.count;
                state.error = null; // Clear any previous errors
            })
            .addCase(fetchRiders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message; // Store the error message
            });

        // Handling fetchRiderById (Fetching a rider by ID)
        builder
            .addCase(fetchRiderById.pending, (state) => {
                state.riderStatus = 'loading';
            })
            .addCase(fetchRiderById.fulfilled, (state, action) => {
                state.riderStatus = 'succeeded';
                state.rider = action.payload; // Assuming API returns the rider data directly
                state.riderError = null; // Clear any previous errors
            })
            .addCase(fetchRiderById.rejected, (state, action) => {
                state.riderStatus = 'failed';
                state.riderError = action.error.message; // Store the error message
            });

        // Handling verifyOrRejectDocument (Verifying or rejecting a document)
        builder
            .addCase(verifyOrRejectDocument.pending, (state) => {
                state.documentStatus = 'loading';
                state.documentError = null; // Clear previous errors
            })
            .addCase(verifyOrRejectDocument.fulfilled, (state, action) => {
                state.documentStatus = 'succeeded';
                const { id, name, status } = action.meta.arg; // Get parameters passed when thunk was dispatched

                // Find the rider in the items array by ID
                const riderIndex = state.items.findIndex((rider) => rider.id === id);
                if (riderIndex !== -1) {
                    // Update the specific document status for the rider
                    if (!state.items[riderIndex].documents) {
                        state.items[riderIndex].documents = {}; // Initialize documents if not present
                    }
                    state.items[riderIndex].documents[name] = status; // Update the specific document status
                }
                fetchRiderById()
            })
            .addCase(verifyOrRejectDocument.rejected, (state, action) => {
                state.documentStatus = 'failed';
                state.documentError = action.error.message; // Store the error message if the request fails
            });

        // Handling updateRiderStatus (Updating rider status)
        builder
            .addCase(updateRiderStatus.pending, (state) => {
                state.updateStatus = 'loading';
                state.updateError = null; // Clear previous errors
            })
            .addCase(updateRiderStatus.fulfilled, (state, action) => {
                state.updateStatus = 'succeeded';
                
                const { id, status } = action.meta.arg; // Get parameters passed when thunk was dispatched

                // Find the rider in the items array by ID and update status
                const riderIndex = state.items.findIndex((rider) => rider.id === id);
                if (riderIndex !== -1) {
                    state.items[riderIndex].status = status; // Update rider's status
                }
                fetchRiders()
            })
            .addCase(updateRiderStatus.rejected, (state, action) => {
                state.updateStatus = 'failed';
                state.updateError = action.error.message; // Store the error message if the request fails
            });
    }
});

export default ridersSlice.reducer;
