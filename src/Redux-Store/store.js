import { configureStore } from "@reduxjs/toolkit";

import CustomersReducer from "Redux-Store/Customers/CustomersSlice";

import OrdersSlice from "Redux-Store/Orders/OrdersSlice";
import ProductsSlice from "./Products/ProductsSlice";
import orderReducer from "./Products/orderSlice";
const store = configureStore({
  reducer: {
    orderss: OrdersSlice,
    customers: CustomersReducer,
    products: ProductsSlice,
    ordersInInventory :orderReducer,

  },
});

export default store;
