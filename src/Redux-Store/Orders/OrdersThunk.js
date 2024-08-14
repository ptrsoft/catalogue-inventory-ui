import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "Views/Config";
import { postLoginService } from "Services";

import orderslist from "Redux-Store/Orders/dummy/orders_list.json";
import ordersdetails from "Redux-Store/Orders/dummy/orders_details.json";
import viewattachment from "Redux-Store/Orders/dummy/view_attachments.json";
export const fetchOrders = createAsyncThunk(
  "orders",
  async (params) => {
    try {
      let url = config.FETCH_ORDERS;
      const response = await postLoginService.get(url, params);
      console.log(response)
      //   return response.data
      return orderslist;
    } catch (error) {
      // return error
      return orderslist;
    }
  }
);


export const ordersDetails = createAsyncThunk(
  "orders/details",
  async (params) => {
    try {
      let url = config.ORDERS_DETAILS;
      const response = await postLoginService.get(url, params);
      console.log(response)
        //   return response.data
        return ordersdetails;
      } catch (error) {
        // return error
        return ordersdetails;
      }
    }
  );
  


  export const ordersViewAttachments = createAsyncThunk(
    "orders/viewattachment",
    async (params) => {
      try {
        let url = config.ORDERS_VIEWATTACHMENTS;
        const response = await postLoginService.get(url, params);
        //   return response.data
        console.log(response)
        return viewattachment;
      } catch (error) {
        // return error
        return viewattachment;
      }
    }
  );
  
