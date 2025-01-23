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
  async ({ search = '', type = '', status = '', pageKey = '', date = '',shift='',pincode='' } = {}, { rejectWithValue }) => {
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
      if (shift) params.push(`shift=${encodeURIComponent(shift)}`);
      if (pincode) params.push(`pincode=${encodeURIComponent(pincode)}`);


      // If there are any parameters, append them to the URL
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      console.log(url,'order url ');

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

      // dispatch(fetchOrderInventory());
      dispatch(fetchOrderById(orderId))
      dispatch(fetchOrderStats())
      console.log(response.data,"cancel order");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel the order');
    }
  }
);
// Thunk to reattempt a specific order by ID
export const reattempt = createAsyncThunk(
  'orderInventory/reattemptOrder',
  async ({ orderId }, { rejectWithValue, dispatch }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue('Authorization token is missing.');
      }
   console.log(orderId,"from thunk");
      // Construct the URL for the API request
      const url = `${config.REATTEMPT_ORDER}/${orderId}/reattempt`;

      // Make the PUT request to reattempt the order
      const response = await postLoginService.put(url, null, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token in the header
        },
      });

      // Optional: Dispatch other actions based on your application needs
      dispatch(fetchOrderById(orderId)); // Fetch the updated order details
      dispatch(fetchOrderStats()); // Update order stats after reattempt
      
      console.log('Reattempted order:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in reattempt thunk:', error);
      return rejectWithValue(
        error.response?.data || error.message || 'Failed to reattempt the order'
      );
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
// Thunk to fetch users by id
export const fetchUsersbyid = createAsyncThunk(
  'orderInventory/fetchUsersbyid',
  async ( {id}, { rejectWithValue }) => {
    console.log(id,"from thunk");
    
    try {
      const token = getToken();  // Get the JWT token from localStorage
      let url = `${config.FETCH_USERS_BYID}/${id}`;
      console.log(url,"user details url");
 
   
      const response = await postLoginService.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data, 'users by id ');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch users by id');
    }
  }
);
// Thunk to pack orders
export const packOrders = createAsyncThunk(
  'orderInventory/packOrders',
  async (requestBody, { rejectWithValue }) => {
    try {
      const token = getToken(); // Get the JWT token from localStorage

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.PACK_ORDERS}`; // Replace with the correct URL from config
      const response = await postLoginService.put(
        url,
        requestBody, // Send the array of order objects as the request body
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add token here
          },
        }
      );
      console.log(response.data);
  
      return response.data; // Return response data on success
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to pack orders');
    }
  }
);

