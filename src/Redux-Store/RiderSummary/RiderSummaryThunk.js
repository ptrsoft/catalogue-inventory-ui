// src/redux/thunks/ridersThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import config from 'Views/Config';
import { postLoginService } from 'Services';

// Async Thunk to fetch all riders from the API
export const fetchRiders = createAsyncThunk('riders/fetchRiders', async ( {status ='', pageKey = '',search=''}) => {
    //  console.log(status,"from thunk");
      // Construct the URL
      let url = `${config.FETCH_RIDERS}`;
      const params = [];
      if (pageKey) params.push(`pageKey=${encodeURIComponent(pageKey)}`);
      if (status) params.push(`status=${encodeURIComponent(status)}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      // If there are any parameters, append them to the URL
    if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await postLoginService.get(url);
      console.log(url,"rider url");
    return response.data;
});

// Async Thunk to fetch a specific rider by ID from the API
export const fetchRiderById = createAsyncThunk('riders/fetchRiderById', async (id) => {
      // Construct the URL
      let url = `${config.FETCH_RIDERS}/${id}`;
      const response = await postLoginService.get(url);
    
    return response.data;
});

// Async Thunk to verify or reject a document for a rider
export const verifyOrRejectDocument = createAsyncThunk(
    'riders/verifyOrRejectDocument',
    async ({ id, document, status, reason }, { rejectWithValue,dispatch }) => {
        try {
            // Check if reason is required for rejection
            if (status === 'rejected' && !reason) {
                throw new Error('Reason is required if the status is rejected.');
            }
            console.log(id,"idd ");
            let url = `${config.FETCH_RIDERS}/${id}/document`;
            console.log(url,"url");
            const response = await postLoginService.patch(
                url,
                {
                    document,
                    status,
                    reason: status === 'rejected' ? reason : undefined, // Include reason only if status is rejected
                },
                // {
                //     params: { name },
                // }
            );
            console.log(response);
            dispatch(fetchRiderById(id))
            return response.data;
        } catch (error) {
            // Return the error response data if available, otherwise return a general error message
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Async Thunk to activate, inactivate, or reject a rider
export const updateRiderStatus = createAsyncThunk(
    'riders/updateRiderStatus',
    async ({ id, status, reason }, { rejectWithValue,dispatch }) => {
        console.log(id,status,reason,"directly approving or rejecting");
        try {
            // Check if reason is required for rejection
            if (status === 'rejected' && !reason) {
                throw new Error('Reason is required if the status is rejected.');
            }
            let url = `${config.FETCH_RIDERS}/${id}`;
            const response = await postLoginService.patch(
                url,
                {
                    status,
                    reason: status === 'rejected' ? reason : undefined, // Include reason only if status is rejected
                }
            );
            console.log(response.data);
            dispatch(fetchRiders())
            return response.data;
        } catch (error) {
            // Return the error response data if available, otherwise return a general error message
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);
