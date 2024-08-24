import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

// Fetch adjustmentzzzzzzzz
export const fetchAdjustments = createAsyncThunk("fetchAdjustments", async (params, { rejectWithValue }) => {
  try {
    let url = config.FETCH_INVENTORY_ADJUSTMENTS;
    const response = await postLoginService.get(url, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const CreateAdjustment = createAsyncThunk("CreateAdjustments", async (params, { rejectWithValue }) => {
    try {
      const url = config.FETCH_INVENTORY_ADJUSTMENTS;
      const response = await postLoginService.post(url, {params});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });