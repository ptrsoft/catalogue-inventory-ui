import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
// Get the token from localStorage (where it's presumably stored)
const getToken = () => {
  const token = localStorage.getItem("user");
  return token ? JSON.parse(token).accessToken : null;
};


export const uploadImage = createAsyncThunk(
  "image/upload",
  async (file, { rejectWithValue }) => {
    try {
      // Step 1: Get the upload URL from the server
      const fileName = encodeURIComponent(file.name);
      const token = getToken();  // Get the JWT token from localStorage

      const response = await fetch(
        `${config.UPLOAD_IMAGE}?fileName=${fileName}`,
        {
          method: "GET", // Specify the HTTP method, if necessary
          headers: {
            Authorization: `Bearer ${token}`, // Add the Authorization header
          },
        }
      );
      
      const { uploadUrl } = await response.json();
      const finalUrl = uploadUrl.split("?")[0];

      // Step 2: Upload the file to the S3 bucket
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (uploadResponse.ok) {
        // If the upload was successful, return the final URL
        console.log(finalUrl)
        return finalUrl;
      } else {
        // If the upload failed, reject with an error message
        return rejectWithValue("Failed to upload the file.");
      }
    } catch (error) {
      // Handle any other errors
      return rejectWithValue(error.message);
    }
  }
);