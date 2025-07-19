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
// Put pricing by ID
export const putPricingById = createAsyncThunk(
  "products/putPricingById",
  async (pricingDataArray, { rejectWithValue }) => {
    try {
      const url = `${config.PUT_PRICING}/price`;
      const token = getToken();  // Retrieve the access token
      const configHeaders = {
        headers: {
          'Authorization': `Bearer ${token}`,  // Add the Bearer token here
          'Content-Type': 'application/json',
        },
      };

      const response = await postLoginService.put(url, pricingDataArray, configHeaders);  // Pass configHeaders for Authorization
      console.log(response, "pricing array");
      return response.data;
     
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
      console.log(active,"from thunk status");

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.PUT_ACTIVE_INACTIVE}`;
      
      
      

      const items = ids.map(id => ({ id, active: active }));

      const response = await postLoginService.put(url, items, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });
      console.log(active,"from thunk");
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

export const deleteGroup = createAsyncThunk(
  "products/deleteGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }
      const url = config.DELETE_GROUP.replace("{groupId}", groupId);
      const response = await postLoginService.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Assuming this returns the groupId of the deleted group
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

export const exportProducts = createAsyncThunk(
  "inventory/export",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.EXPORT_PRODUCTS}`;
      const response = await postLoginService.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token here
        },
      });
     console.log(response,"res");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const ImportProducts = createAsyncThunk(
  "products/import",
  async ({ formdata }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.IMPORT_PRODUCTS}`;
      const response = await postLoginService.post(url,formdata, {
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

export const fetchInventoryCollection = createAsyncThunk(
  "products/fetchInventoryCollection",
  async (params, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      let url = config.FETCH_INVENTORY_COLLECTION;
      let queryParams = [];

      // Add search term if provided
      if (params?.search) queryParams.push(`search=${encodeURIComponent(params.search)}`);
      if (params?.category) queryParams.push(`category=${encodeURIComponent(params.category)}`);
      if (params?.subCategory) queryParams.push(`subCategory=${encodeURIComponent(params.subCategory)}`);

      
      // Add pageKey for pagination
      if (params?.pageKey) queryParams.push(`nextKey=${encodeURIComponent(params.pageKey)}`);

      if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

      const response = await postLoginService.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return {
        data: response.data.items,
        nextKey: response.data.nextKey,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAllInventory = createAsyncThunk(
  "products/fetchAllInventory",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = config.FETCH_ALL_INVENTORY;
      const response = await postLoginService.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCollectionById = createAsyncThunk(
  "products/fetchCollectionById",
  async (groupId, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      const url = `${config.FETCH_COLLECTION_BY_ID}/${groupId}`;
      const response = await postLoginService.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateGroup = createAsyncThunk(
  "products/updateGroup",
  async ({ groupId, groupData }, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }
      const url = `${config.BASE_URL}/inventory/update-group/${groupId}`;
      const response = await postLoginService.put(
        url,
        groupData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);