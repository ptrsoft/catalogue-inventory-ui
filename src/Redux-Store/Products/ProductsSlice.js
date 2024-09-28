import { createSlice } from '@reduxjs/toolkit'; 
import { fetchProducts, PutToggle, updateProductsStatus, deleteProduct, fetchProductById, updateProductDetails  } from './ProductThunk'; // Ensure to import updateProductsStatus
import status from "Redux-Store/Constants";

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: {
      data: [],
      status: 'idle',
      error: null
      
    },
    productDetail: null, // To store fetched product details
    productDetailStatus: 'idle', // Status for fetching product details
    productDetailError: null, // Error for fetching product details
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
        state.products.data = action.payload;
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
      })      .addCase(PutToggle.pending, (state) => {
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
        // Filter out the deleted product from the products data array
        state.products.data.items = state.products.data.items.filter(items => items.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
