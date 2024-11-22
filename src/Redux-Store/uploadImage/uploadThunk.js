import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";

const getToken = () => {
  const token = localStorage.getItem("user");
  return token ? JSON.parse(token).accessToken : null;
};

export const uploadImage = createAsyncThunk(
  "image/upload",
  async (file, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("Authorization token is missing.");
      }

      // Step 1: Get the upload URL from the server
      const fileName = encodeURIComponent(file.name);
      const response = await fetch(
        `${config.UPLOAD_IMAGE}?fileName=${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token here
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch upload URL.");
      }

      const { uploadUrl } = await response.json();
      const finalUrl = uploadUrl.split("?")[0];

      // Step 2: Upload the file to the S3 bucket
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type, // Ensure proper content type
          // S3 generally doesn't require Authorization for signed URLs
        },
      });

      if (uploadResponse.ok) {
        // If the upload was successful, return the final URL
        console.log(finalUrl);
        return finalUrl;
      } else {
        // If the upload failed, reject with an error message
        return rejectWithValue("Failed to upload the file to the server.");
      }
    } catch (error) {
      // Handle any other errors
      return rejectWithValue(error.message || "An unexpected error occurred.");
    }
  }
);
