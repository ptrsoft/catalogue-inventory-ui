import { configureStore } from "@reduxjs/toolkit";
import CustomersReducer from "Redux-Store/Customers/CustomersSlice";
import authReducer from "Redux-Store/authenticate/signin/signinSlice"
import OrdersSlice from "Redux-Store/Orders/OrdersSlice";
import ProductsSlice from "./Products/ProductsSlice";
import orderReducer from "./Products/orderSlice";
import forgotPwdReducer from "Redux-Store/ForgotPwd/forgotPwdSlice"
import resetPwdSlice from "Redux-Store/newpwd/newPwdSlice"
import signupReducer from "Redux-Store/signup/signupSlice"
import otpSlice from "Redux-Store/otpVerify/otpVerifySlice"
const store = configureStore({
  reducer: {
    orderss: OrdersSlice,
    customers: CustomersReducer,
    products: ProductsSlice,
    ordersInInventory :orderReducer,
    auth:authReducer,
    forgotPwd : forgotPwdReducer,
    resetPwd:resetPwdSlice,
    signup:signupReducer,
    otp:otpSlice
  },
});

export default store;
