// src/redux/thunks/ridersThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to fetch all riders from the API
export const fetchRiders = createAsyncThunk('riders/fetchRiders', async () => {
    const response = await axios.get('https://api.admin.promodeagro.com/rider');
    return response.data;
});

// Async Thunk to fetch a specific rider by ID from the API
export const fetchRiderById = createAsyncThunk('riders/fetchRiderById', async (id) => {
    const response = await axios.get(`https://api.admin.promodeagro.com/rider/${id}`);
    return response.data;
});

// Async Thunk to verify or reject a document for a rider
export const verifyOrRejectDocument = createAsyncThunk(
    'riders/verifyOrRejectDocument',
    async ({ id, name, status, reason }, { rejectWithValue }) => {
        try {
            // Check if reason is required for rejection
            if (status === 'rejected' && !reason) {
                throw new Error('Reason is required if the status is rejected.');
            }

            const response = await axios.patch(
                `https://api.admin.promodeagro.com/rider/${id}/document`,
                {
                    status,
                    reason: status === 'rejected' ? reason : undefined, // Include reason only if status is rejected
                },
                {
                    params: { name },
                }
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            // Return the error response data if available, otherwise return a general error message
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);
