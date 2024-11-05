// src/features/cashCollection/cashCollectionThunks.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import config from 'Views/Config';
import { postLoginService } from 'Services'; 



export const fetchCashCollection = createAsyncThunk(
  'cashCollection/fetchCashCollection',
  async ({ search = '', status = '', pageKey = '',date } = {}) => {
     // Construct the URL
     let url = `${config.FETCH_CASH_COLLECTION}`;
     const params = [];
 
     // Add parameters if they are provided
     if (search) params.push(`search=${encodeURIComponent(search)}`);
     if (status) params.push(`status=${encodeURIComponent(status)}`);
     if (date) params.push(`date=${encodeURIComponent(date)}`);
     if (pageKey) params.push(`pageKey=${encodeURIComponent(pageKey)}`);
 
     // If there are any parameters, append them to the URL
     if (params.length > 0) {
       url += `?${params.join('&')}`;
     }
 
     const response = await postLoginService.get(url);
     console.log(url, 'url');
     console.log(response, 'cash thunk');
     return response.data; // Axios automatically parses JSON
   }
  
);

