import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (params, { rejectWithValue }) => {
    try {
      let url = config.FETCH_INVENTORY;
      let queryParams = [];
      // Add search term, category, and active status if provided
      if (params?.search) {
        queryParams.push(`search=${encodeURIComponent(params.search)}`);
      }
      if (params?.category) {
        queryParams.push(`category=${encodeURIComponent(params.category)}`);
      }
      if (params?.active) {
        queryParams.push(`active=${encodeURIComponent(params.active)}`);
      }
      // Add pageKey if it exists
      if (params?.pageKey) {
        queryParams.push(`pageKey=${encodeURIComponent(params.pageKey)}`);
      }
      // Form final URL
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }
      // Fetch data from API
      const response = await postLoginService.get(url);
      return {
        data: response.data,
      // assuming your API returns the next page key
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);






export const PutToggle = createAsyncThunk(
  "products/putActiveInactive",
  async ({ ids, active }, { rejectWithValue }) => {
    try {
      const url = `${config.PUT_ACTIVE_INACTIVE}`;

      
      let isActive;
      if (typeof active === 'string') {
        isActive = active === 'inactive'; 
      } else {
        isActive = !active;  
      }

      const items = ids.map(id => ({ id, active: isActive }));

      console.log("Sending request to:", url);
      console.log("Payload:", items);  // This should now be in the correct format

      const response = await postLoginService.put(url, items);  // Send the array directly

      console.log(response.data, "async put of toggle successful");
      return response.data;
    } catch (error) {
      console.error("API error:", error);  // Log API error
      return rejectWithValue(
        error?.response?.data || error.message
      );
    }
  }
);

export const addProduct = createAsyncThunk("products/add", async (newProduct, { rejectWithValue }) => {
  try {
    const url = config.ADD_ITEM;
    const response = await postLoginService.post(url, newProduct);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateProductsStatus = createAsyncThunk(
  "products/updateStatus",
  async ({ ids, active }, { rejectWithValue }) => {
    try {
      const url = `${config.PUT_ACTIVE_INACTIVE}`;
      
      // Prepare the request body as an array of objects
      const requestBody = ids.map(id => ({
        id,
        active
      }));

      console.log("Sending request to:", url);
      console.log("Payload:", requestBody);

      // Send a PUT request with the request body
      const response = await postLoginService.put(url, requestBody);
      console.log(response.data, "async update of product status successful");
      
      return response.data; // Return the response data to the Redux store
    } catch (error) {
      console.error("API error:", error);
      
      // Use rejectWithValue to handle errors in the slice
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      const url = config.DELETE.replace("{id}", id);
      const response = await postLoginService.delete(url);
      return response.data; // Assuming this returns the ID of the deleted product
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


export const fetchProductById = createAsyncThunk("products/fetchById", async (id, { rejectWithValue }) => {
  try {
    const url = `${config.PRODUCT_DETAIL.replace("{id}", id)}`; // Use the config for the product detail URL
    const response = await postLoginService.get(url);
    return response.data; // Return the fetched product data
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateProductDetails = createAsyncThunk(
  "products/updateProductDetails",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const url = `${config.PRODUCT_DETAIL.replace("{id}", id)}`; // Construct the URL
      const response = await postLoginService.put(url, productData); // Send PUT request
      return response.data; // Return the updated product data
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors
    }
  }
);
