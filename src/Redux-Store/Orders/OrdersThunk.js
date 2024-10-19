import { createAsyncThunk } from '@reduxjs/toolkit';
import config from 'Views/Config';
import { postLoginService } from 'Services'; // Assuming you have a service for making API calls

// Thunk to fetch all orders with optional parameters for search, category, and pageKey
export const fetchOrderInventory = createAsyncThunk(
  'orderInventory/fetchOrderInventory',
  async ({ search = '', type = '', pageKey = '' } = {}) => {
    // Construct the URL
    let url = `${config.FETCH_ORDERS}`;
    const params = [];

    // Add parameters if they are provided
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (type) params.push(`type=${encodeURIComponent(type)}`);
    if (pageKey) params.push(`pageKey=${encodeURIComponent(pageKey)}`);

    // If there are any parameters, append them to the URL
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const response = await postLoginService.get(url);
    console.log(url,"url");
    console.log(response, 'order');
    return response.data; // Axios automatically parses JSON
  }
);


// Thunk to fetch a specific order by ID
export const fetchOrderById = createAsyncThunk(
  'orderInventory/fetchOrderById',
  async (orderId) => {
    const url = `${config.FETCH_ORDERBYID}/${orderId}`; // Update this line to match your API
    const response = await postLoginService.get(url);
    console.log(response, "specific order");
    return response.data; // Axios automatically parses JSON
  }
);
