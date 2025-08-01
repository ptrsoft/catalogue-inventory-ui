import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

// Fetch adjustments
export const fetchAdjustments = createAsyncThunk("fetchAdjustments", async (params, { rejectWithValue }) => {
  try {
    const url = config.FETCH_INVENTORY_ADJUSTMENTS;
    const response = await postLoginService.get(url, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Create adjustment
export const CreateAdjustment = createAsyncThunk("CreateAdjustment", async (params, { rejectWithValue }) => {
  try {
    const url = config.CREATE_INVENTORY_ADJUSTMENT; // Assuming a different URL for creation
    const response = await postLoginService.post(url, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

export const createInventoryAdjustment = createAsyncThunk(
  "createInventoryAdjustment",
  async (adjustmentData, { rejectWithValue }) => {
    try {
      const url = config.FETCH_INVENTORY_ADJUSTMENTS;
      const response = await postLoginService.post(url, adjustmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Fetch single adjustment by ID
export const fetchAdjustmentById = createAsyncThunk(
  "fetchAdjustmentById",
  async (id, { rejectWithValue }) => {
    try {
      const url = `${config.FETCH_INVENTORY_ADJUSTMENTS}/${String(id)}`;
      const response = await postLoginService.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update adjustment by ID
export const updateAdjustmentById = createAsyncThunk(
  "updateAdjustmentById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const url = `${config.FETCH_INVENTORY_ADJUSTMENTS}/${id}`;
      const response = await postLoginService.put(url, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
