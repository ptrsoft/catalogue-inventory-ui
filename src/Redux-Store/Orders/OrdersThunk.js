import { createAsyncThunk } from '@reduxjs/toolkit';
import config from 'Views/Config';
import { postLoginService } from 'Services'; // Assuming you have a service for making API calls

// Helper function to get the token from localStorage
const getToken = () => {
  const token = localStorage.getItem("user");
  return token ? JSON.parse(token).accessToken : null;
};

// Thunk to fetch all orders with optional parameters for search, category, and pageKey
export const fetchOrderInventory = createAsyncThunk(
  'orderInventory/fetchOrderInventory',
  async ({ search = '', type = '', status = '', pageKey = '', date = '' } = {}, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      // Construct the URL
      let url = `${config.FETCH_ORDERS}`;
      const params = [];

      // Add parameters if they are provided
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (type) params.push(`type=${encodeURIComponent(type)}`);
      if (status) params.push(`status=${encodeURIComponent(status)}`);
      if (pageKey) params.push(`pageKey=${encodeURIComponent(pageKey)}`);
      if (date) params.push(`date=${encodeURIComponent(date)}`);

      // If there are any parameters, append them to the URL
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await postLoginService.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });

      return {
        data: response.data.items,
        nextKey: response.data.nextKey, // nextKey for pagination
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to fetch a specific order by ID
export const fetchOrderById = createAsyncThunk(
  'orderInventory/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.FETCH_ORDERBYID}/${orderId}`; // Update this line to match your API
      const response = await postLoginService.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });

      return response.data; // Axios automatically parses JSON
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk to cancel a specific order by ID
export const cancelOrder = createAsyncThunk(
  'orderInventory/cancelOrder',
  async ({ orderId, reason }, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      // Construct the URL for the API request
      const url = `${config.CANCEL_ORDER}/${orderId}/cancel`;

      // Make the POST request to cancel the order with the reason in the request body
      const response = await postLoginService.put(url, { reason }, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });

      dispatch(fetchOrderInventory());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel the order');
    }
  }
);

// Thunk to fetch order stats (new)
export const fetchOrderStats = createAsyncThunk(
  'orderInventory/fetchOrderStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      // Hit the stats API endpoint
      const url = `${config.FETCH_ORDERBYID}/stats`;
      const response = await postLoginService.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
