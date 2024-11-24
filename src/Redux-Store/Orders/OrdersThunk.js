import { createAsyncThunk } from '@reduxjs/toolkit';
import config from 'Views/Config';
import { postLoginService } from 'Services'; // Assuming you have a service for making API calls

// Thunk to fetch all orders with optional parameters for search, category, and pageKey
export const fetchOrderInventory = createAsyncThunk(
  'orderInventory/fetchOrderInventory',
  async ({ search = '', type = '', status = '', pageKey = '',date='' } = {}) => {
    // Construct the URL
    let url = `${config.FETCH_ORDERS}`;
    const params = [];
  console.log(pageKey,"pagekey");
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

    const response = await postLoginService.get(url);
    console.log(url, 'url');
    console.log(response, 'order');
    return {
      data: response.data.items,
      nextKey: response.data.nextKey, // nextKey for pagination
    };
  }
);

// Thunk to fetch a specific order by ID
export const fetchOrderById = createAsyncThunk(
  'orderInventory/fetchOrderById',
  async (orderId) => {
    const url = `${config.FETCH_ORDERBYID}/${orderId}`; // Update this line to match your API
    const response = await postLoginService.get(url);
    console.log(response, 'specific order');
    return response.data; // Axios automatically parses JSON
  }
);

// Thunk to cancel a specific order by ID
export const cancelOrder = createAsyncThunk(
  'orderInventory/cancelOrder',
  async ({ orderId, reason }, { rejectWithValue,dispatch }) => {
    try {
      // Construct the URL for the API request
      const url = `${config.CANCEL_ORDER}/${orderId}/cancel`;

      // Make the POST request to cancel the order with the reason in the request body
      const response = await postLoginService.put(url, { reason });

      // Return the response data on success
      console.log(response.data, 'cancel');
      dispatch(fetchOrderInventory())
      return response.data;
    } catch (error) {
      // Handle error by returning a rejected action
      return rejectWithValue(error.response?.data || 'Failed to cancel the order');
    }
  }
);

// Thunk to fetch order stats (new)
export const fetchOrderStats = createAsyncThunk(
  'orderInventory/fetchOrderStats',
  async () => {
    try {
      // Hit the stats API endpoint
      const url = `${config.FETCH_ORDERBYID}/stats`;
      const response = await postLoginService.get(url);
      console.log(response.data, 'order stats');
      
      // Return the data from the API
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
);
const getToken = () => {
  const token = localStorage.getItem("user");
  return token ? JSON.parse(token).accessToken : null;
};
// Thunk to fetch users
export const fetchUsers = createAsyncThunk(
  'orderInventory/fetchUsers',
  async ( {search = ''}, { rejectWithValue }) => {
    try {
      const token = getToken();  // Get the JWT token from localStorage
      let url = `${config.FETCH_USERS}`;
      const params = [];
          // Add parameters if they are provided
          if (search) params.push(`search=${encodeURIComponent(search)}`);
                 // If there are any parameters, append them to the URL
    if (params.length > 0) {
      url += `&${params.join('&')}`;
    }
    console.log(url,"packer url");
      const response = await postLoginService.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data, 'users');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
  }
);
