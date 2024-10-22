// src/redux/thunks/ridersThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk to fetch riders from the API
export const fetchRiders = createAsyncThunk('riders/fetchRiders', async () => {
    const response = await axios.get('https://api.admin.promodeagro.com/rider');
    return response.data;
});
