// src/redux/slices/ridersSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchRiders } from './RiderSummaryThunk';

const ridersSlice = createSlice({
    name: 'riders',
    initialState: {
        items: [],
        count: 0,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRiders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRiders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.count = action.payload.count;
            })
            .addCase(fetchRiders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default ridersSlice.reducer;
