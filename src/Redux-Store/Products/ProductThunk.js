import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";
import axios from "axios";

// Fetch products
export const fetchProducts = createAsyncThunk("products/fetch", async (params, { rejectWithValue }) => {
  try {
    let url = config.FETCH_INVENTORY;
    const response = await postLoginService.get(url, params);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

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

// Upload an image using a presigned URL
export const uploadImage = createAsyncThunk("products/uploadImage", async ({ fileName, fileType, file }, { rejectWithValue }) => {
  try {
    // Step 1: Get the presigned URL from the backend
    const presignedUrlResponse = await postLoginService.get(config.GET_PRESIGNED_URL, {
      fileName,
      fileType,
    });

    const presignedUrl = presignedUrlResponse.data.presignedUrl;

    // Step 2: Upload the image to S3 using the presigned URL
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": fileType,
      },
    });

    // Return the file name or the S3 URL if needed
    return { fileName, s3Url: presignedUrl.split('?')[0] }; // The S3 URL without the query parameters
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
