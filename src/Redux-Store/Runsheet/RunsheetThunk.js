// runsheetThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import config from "Views/Config";
import { postLoginService } from "Services"; // Assuming you have a service for making API calls

// Thunk for creating a runsheet (already implemented)
export const createRunsheet = createAsyncThunk(
  'runsheet/createRunsheet',
  async (payload, { rejectWithValue }) => {
    try {
      const url = `${config.CREATE_RUNSHEET}`;
      const response = await postLoginService.post(url, payload);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// New thunk for fetching all runsheet data
export const fetchRunsheet = createAsyncThunk(
  'runsheet/fetchRunsheet',
  async ({search = '',pageKey = '' }) => {
    // try {
      let url = `${config.FETCH_RUNSHEET}`; // Define FETCH_RUNSHEET in Config for the GET endpoint
      const params = [];

      // Add parameters if they are provided
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (pageKey) params.push(`pageKey=${encodeURIComponent(pageKey)}`);
         // If there are any parameters, append them to the URL
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
      const response = await postLoginService.get(url);
      console.log(response, "fetch runsheet");
      console.log(url,"url");
      return response.data; // assuming response.data is the array you provided
    }
    //  catch (error) {
    //   return rejectWithValue(error.response ? error.response.data : error.message);
    // }
  // }
);

// New thunk for fetching runsheet by ID
export const fetchRunsheetById = createAsyncThunk(
  'runsheet/fetchRunsheetById',
  async (id, { rejectWithValue }) => {
    try {
      const url = `${config.FETCH_RUNSHEET}/${id}`; // Use the ID to construct the URL
      const response = await postLoginService.get(url);
      console.log(response, "fetch runsheet by ID");
      return response.data; // assuming response.data is the object you provided
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);