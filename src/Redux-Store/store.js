import { configureStore } from "@reduxjs/toolkit";

import CustomersReducer from "Redux-Store/Customers/CustomersSlice";

import OrdersSlice from "Redux-Store/Orders/OrdersSlice";
import ProductsSlice from "./Products/ProductsSlice";
import orderReducer from "./Products/orderSlice";
import InventoryAdjustmentsSlice from "./InventoryAdjustments/InventoryAdjustmentsSlice";

const store = configureStore({
  reducer: {
    orderss: OrdersSlice,
    customers: CustomersReducer,
    products: ProductsSlice,
    ordersInInventory :orderReducer,
    InvertorAdjustments: InventoryAdjustmentsSlice
  },
});

export default store;
