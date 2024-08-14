import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "../../Services";

import customersRes from "Redux-Store/Customers/dummy/customerslist.json";

export const fetchCustomers = createAsyncThunk(
  "customers",
  async (params) => {
    try {
      let url = config.FETCH_CUSTOMERS;
      const response = await postLoginService.get(url, params);
      console.log(response)
      //   return response.data
      return customersRes;
    } catch (error) {
      // return error
      return customersRes;
    }
  }
);
//
