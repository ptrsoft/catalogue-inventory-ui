import { createSlice } from '@reduxjs/toolkit'; 
import { fetchProducts, PutToggle, updateProductsStatus, deleteProduct, fetchProductById, updateProductDetails, fetchInventoryStats  } from './ProductThunk'; // Ensure to import updateProductsStatus
import status from "Redux-Store/Constants";

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: {
      data: {},  // Change from array to object for pagination
      status: 'idle',
      error: null,
      nextKey: null
    },
    productDetail: null, // To store fetched product details
    productDetailStatus: 'idle', // Status for fetching product details
    productDetailError: null, // Error for fetching product details
    inventoryStats: { // Initialize inventoryStats here
      data: null, // or an empty object if applicable
      status: 'idle', // or 'loading', etc.
      error: null // Initialize error state
    },
  },
  reducers: {
    toggleStatus: (state, action) => {
      const product = state.products.data.find(p => p.itemCode === action.payload.itemCode);
      if (product) {
        product.status = product.status === "Active" ? "Inactive" : "Active";
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProducts.pending, (state) => {
      state.products.status = status.IN_PROGRESS;
    })
    .addCase(fetchProducts.fulfilled, (state, action) => {
      const { data } = action.payload; // Directly access data from the API response
  
      // Get the current page based on the request
      const currentPage = action.meta.arg.pageKey ? action.meta.arg.pageKey : 1;
  
      // Store items directly in the state for the current page
      state.products.data[currentPage] = data.items; // Store items directly in the state
  
      // Set nextKey for pagination
      state.products.nextKey = data.nextKey; // Save nextKey for further requests
  
      // Update status
      state.products.status = status.SUCCESS;
  })
    
      .addCase(fetchProducts.rejected, (state, action) => {
      state.products.status = status.FAILURE;
      state.products.error = action.error.message;
    })
        .addCase(fetchProductById.pending, (state) => {
        state.productDetailStatus = status.IN_PROGRESS;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetail = action.payload; // Store the fetched product detail
        state.productDetailStatus = status.SUCCESS;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productDetailStatus = status.FAILURE;
        state.productDetailError = action.error.message;
      }).addCase(PutToggle.pending, (state) => {
        state.products.status = status.IN_PROGRESS;
      })
      .addCase(PutToggle.fulfilled, (state, action) => {
        console.log("Payload from PutToggle:", action.payload);
        
        if (action.payload && action.payload.updatedItems) {
          action.payload.updatedItems.forEach(({ id, active }) => {
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
              existingItem.active = active; // Update active status
            }
          }); 
        } else {
          console.warn(action.payload);
          // console.warn("No valid payload received:", action.payload);

        }
      })
      
      
      .addCase(PutToggle.rejected, (state) => {
        state.products.status = status.FAILURE;
      })
      // Update Multiple Products Status
      .addCase(updateProductsStatus.pending, (state) => {
        state.products.status = status.IN_PROGRESS;
      })
      .addCase(updateProductsStatus.fulfilled, (state, { payload }) => {
        state.products.status = status.SUCCESS;

        // Update the products based on the response structure
        state.products.data = state.products.data.map(product => {
          const updatedProduct = payload.find(item => item.id === product.id);
          return updatedProduct ? { ...product, ...updatedProduct } : product;
        });
      })
      .addCase(updateProductsStatus.rejected, (state, action) => {
        state.products.status = status.FAILURE;
        state.products.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.products.data)) {
          state.products.data = state.products.data.filter(product => product.id !== action.payload);
        } else {
          console.warn("Expected products.data to be an array but found:", state.products.data);
        }
      })
                  
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInventoryStats.pending, (state) => {
        state.inventoryStats.status = 'loading'; // Use a string to represent the status
        state.inventoryStats.error = null; // Reset error state when starting to load
      })
      .addCase(fetchInventoryStats.fulfilled, (state, action) => {
        state.inventoryStats.data = action.payload; // Store the data from the payload
        state.inventoryStats.status = 'succeeded'; // Mark as successful
      })
      .addCase(fetchInventoryStats.rejected, (state, action) => {
        state.inventoryStats.status = 'failed'; // Mark as failed
        state.inventoryStats.error = action.payload || action.error.message; // Store the error message
      })
      .addCase(updateProductDetails.pending, (state) => {
        state.productDetailStatus = status.IN_PROGRESS; // Set loading state
      })
      .addCase(updateProductDetails.fulfilled, (state, action) => {
        console.log("Payload form updatedproductdetail", action.payload);

        const updatedProduct = action.payload;
      
        // Update product detail in the state
        if (state.productDetail && state.productDetail.id === updatedProduct.id) {
          state.productDetail = updatedProduct; // Replace with updated details
        }
      
        // Ensure that state.products.data is an array before mapping
        if (Array.isArray(state.products.data)) {
          state.products.data = state.products.data.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
          );
        } else {
          console.warn("Expected products.data to be an array but found:", state.products.data);
          // Optionally reset to an empty array if this situation occurs
          state.products.data = [];
        }
        state.productDetailStatus = status.SUCCESS; // Set success state
      })
      
      .addCase(updateProductDetails.rejected, (state, action) => {
        state.productDetailStatus = status.FAILURE; // Set error state
        state.productDetailError = action.error.message; // Capture error message
      });
  },
});

export const { toggleStatus } = productsSlice.actions;
export default productsSlice.reducer;