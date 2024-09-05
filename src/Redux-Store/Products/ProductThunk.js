import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

// Fetch products
export const fetchProducts = createAsyncThunk("products/fetch", async (params, { rejectWithValue }) => {
  try {
    let url = config.FETCH_INVENTORY;

    // Initialize an array to hold query parameters
    let queryParams = [];

    // Add search term to query parameters if provided
    if (params?.search) {
      queryParams.push(`search=${encodeURIComponent(params.search)}`);
    }

    // Add category to query parameters if provided
    if (params?.category) {
      queryParams.push(`category=${encodeURIComponent(params.category)}`);
    }
    if (params?.active) {
      queryParams.push(`active=${encodeURIComponent(params.active)}`);
    }

    // Join the query parameters and append to the URL if there are any
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await postLoginService.get(url);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const PutToggle = createAsyncThunk(
  "products/putActiveInactive",
  async ({ id, active }, { rejectWithValue }) => {
    try {
      const url = `${config.PUT_ACTIVE_INACTIVE}`;
      // Log the payload to verify its structure
      console.log("Sending request to:", url);
      console.log("Payload:", { id, active });

      // Ensure `isActive` is a boolean value
      const response = await postLoginService.put(url, { id, active });

      console.log(response.data, "async put of toggle successful");
      return response.data;
    } catch (error) {
      console.error("API error:", error); // Log API error
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
// Add a new product
export const addProduct = createAsyncThunk("products/add", async (newProduct, { rejectWithValue }) => {
  try {
    const url = config.ADD_ITEM;
    const response = await postLoginService.post(url, newProduct);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

