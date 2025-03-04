import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

const getToken = () => {
  const token = localStorage.getItem("user");
  return token ? JSON.parse(token).accessToken : null;
};

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (params, { rejectWithValue }) => {
    console.log(params,"paramss on inventory");
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      let url = config.FETCH_INVENTORY;
      let queryParams = [];

      // Add search term, category, subCategory, etc.
      if (params?.search) queryParams.push(`search=${encodeURIComponent(params.search)}`);
      if (params?.category) queryParams.push(`category=${encodeURIComponent(params.category)}`);
      if (params?.subCategory) queryParams.push(`subCategory=${encodeURIComponent(params.subCategory)}`);
      if (params?.active !== undefined) {
        queryParams.push(`active=${encodeURIComponent(params.active)}`);
      }
      
      
      // Add pageKey for pagination (use categoryNextKey if category is selected)
      if (params?.pageKey && !params.category) queryParams.push(`pageKey=${encodeURIComponent(params.pageKey)}`);
      if (params?.categoryNextKey && params.category) queryParams.push(`pageKey=${encodeURIComponent(params.categoryNextKey)}`);

      if (queryParams.length > 0) url += `?${queryParams.join("&")}`;
console.log(url,queryParams,"uuurrls");
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

export const PutToggle = createAsyncThunk(
  "products/putActiveInactive",
  async ({ ids, active }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.PUT_ACTIVE_INACTIVE}`;
      
      let isActive;
      if (typeof active === 'string') {
        isActive = active === 'inactive'; 
      } else {
        isActive = !active;  
      }

      const items = ids.map(id => ({ id, active: isActive }));

      const response = await postLoginService.put(url, items, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });
      return response.data;
    } catch (error) {
      console.error("API error:", error);
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "products/add",
  async (newProduct, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = config.ADD_ITEM;
      const response = await postLoginService.post(url, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add product.");
    }
  }
);

export const updateProductsStatus = createAsyncThunk(
  "products/updateStatus",
  async ({ ids, active }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.PUT_ACTIVE_INACTIVE}`;

      const requestBody = ids.map(id => ({
        id,
        active,
      }));

      const response = await postLoginService.put(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = config.DELETE.replace("{id}", id);
      const response = await postLoginService.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });

      return response.data; // Assuming this returns the ID of the deleted product
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk("products/fetchById", async (id, { rejectWithValue }) => {
  try {
    const token = getToken();

    if (!token) {
      return rejectWithValue("Authorization token is missing.");
    }

    const url = `${config.PRODUCT_DETAIL.replace("{id}", id)}`;
    const response = await postLoginService.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token here
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateProductDetails = createAsyncThunk(
  "products/updateProductDetails",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.PRODUCT_DETAIL.replace("{id}", id)}`;
      const response = await postLoginService.put(url, productData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchInventoryStats = createAsyncThunk(
  "inventory/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.BASE_URL}/inventory/stats`;
      const response = await postLoginService.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
