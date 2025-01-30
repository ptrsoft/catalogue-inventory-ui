// src/features/pincode/pincodeThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import config from 'Views/Config';
import { postLoginService } from 'Services'; // Assuming postLoginService uses Axios

export const checkPincode = createAsyncThunk(
  'pincode/addpincode',
  async ({ pincode, deliveryTypes, shifts,active }, { rejectWithValue }) => {
    console.log(pincode, deliveryTypes, shifts,active, "all values");
    try {
      const url = `${config.Add_PINCODE}`;
      
      const response = await postLoginService.post(url, {
        pincode,
        deliveryTypes,
        shifts,
        active,
      });

      console.log(response.data);
      return response.data; // Axios automatically returns data inside 'data' property
    } catch (error) {
      console.error("Error in checkPincode thunk:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to check pincode"
      );
    }
  }
);
export const updatePincode = createAsyncThunk(
    'pincode/updatePincode',
    async ({ pincode, deliveryTypes, shifts,active }, { rejectWithValue }) => {
      console.log(pincode, deliveryTypes, shifts,active, "all values");
  
      try {
        // Make sure the URL is correct
        const url = `${config.Add_PINCODE}`;
  
        // Make the PUT request to update the pincode
        const response = await postLoginService.put(url, {
          pincode,
          deliveryTypes,
          shifts,
          active
        });
  
        console.log(response.data);
        
        // Axios automatically returns data inside 'data' property
        return response.data;  
      } catch (error) {
        console.error("Error in updatePincode thunk:", error);
  
        // Return a custom error message if available
        return rejectWithValue(
          error.response?.data?.message || error.message || "Failed to update pincode"
        );
      }
    }
  );
  

  export const getPincodes = createAsyncThunk(
    'pincode/getPincodes', // Unique action type for getPincodes
    async ({ search = '', type = '', status = '', }, { rejectWithValue }) => { // Default to an empty string
      try {
        console.log(String(search),status, type, "search",typeof(search)); // Convert search to string here
  
        let url = `${config.GET_PINCODE}`; // Base URL for the request
        const params = [];
  
        // Add search parameter if it’s provided
        if (String(search).trim()) {
          params.push(`search=${encodeURIComponent(String(search))}`);
        }
        if (type) params.push(`type=${encodeURIComponent(type)}`);
        if (status === true || status === false) {
          params.push(`status=${encodeURIComponent(status)}`);
        }
        
  
        // Append parameters to the URL if they exist
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }
  
        const response = await postLoginService.get(url); // Use .get() for GET requests
      console.log(url,"pincode url");
        console.log(response.data,"pincodes");
        return response.data; // Axios automatically returns data inside the 'data' property
      } catch (error) {
        console.error("Error in getPincodes thunk:", error);
        return rejectWithValue(
          error.response?.data?.message || error.message || "Failed to fetch pincodes"
        );
      }
    }
  );
  
// New thunk for PATCH request
export const updateDeliveryType = createAsyncThunk(
    'pincode/updateDeliveryType',
    async ({ type, pincodes }, { rejectWithValue,dispatch }) => {
      console.log(type, pincodes, "all values for delivery type");
      try {
        const url = `${config.GET_PINCODE}/delivery-type`;
  
        const response = await postLoginService.patch(url, {
          type,      // 'same day' or 'next day'
          pincodes,  // Array of pincode strings
        });
  
        console.log(response.data);
        dispatch(getPincodes())
        return response.data;  // Axios returns data inside 'data' property
      } catch (error) {
        console.error("Error in updateDeliveryType thunk:", error);
        return rejectWithValue(
          error.response?.data?.message || error.message || "Failed to update delivery type"
        );
      }
    }
  );

  export const updateStatus = createAsyncThunk(
    'pincode/updateStatus',
    async ({ status, pincodes }, { rejectWithValue,dispatch }) => {
      try {
        const url = `${config.GET_PINCODE}/status`;
        const response = await postLoginService.patch(url, {
          status,
          pincodes,
        });
        console.log(response.data);
        dispatch(getPincodes())
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );