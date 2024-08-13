import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";
export const fetchProducts = createAsyncThunk("products/fetch", async (params, { rejectWithValue }) => {
  try {
    let url = config.ADD_ITEM;
    const response = await postLoginService.get(url, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addProduct = createAsyncThunk("products/add", async (newProduct, { rejectWithValue }) => {
  try {
    const url = config.ADD_ITEM;
    const response = await postLoginService.post(url, newProduct);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
