import { configureStore } from "@reduxjs/toolkit";
import CustomersReducer from "Redux-Store/Customers/CustomersSlice";
import authReducer from "Redux-Store/authenticate/signin/signinSlice"
import OrdersSlice from "Redux-Store/Orders/OrdersSlice";
import ProductsSlice from "./Products/ProductsSlice";
import orderReducer from "./Products/orderSlice";
import InventoryAdjustmentsSlice from "./InventoryAdjustments/InventoryAdjustmentsSlice";
import forgotPwdReducer from "Redux-Store/authenticate/ForgotPwd/forgotPwdSlice"
import resetPwdSlice from "Redux-Store/authenticate/newpwd/newPwdSlice"
import otpSlice from "Redux-Store/authenticate/otpVerify/otpVerifySlice"
import signupReducer from "Redux-Store/signup/signupSlice"
import signoutReducer from "Redux-Store/authenticate/signout/signoutSlice"
import uploadSlice from "Redux-Store/uploadImage/uploadSlice" 
const store = configureStore({
  reducer: {
    orderss: OrdersSlice,
    customers: CustomersReducer,
    products: ProductsSlice,
    ordersInInventory :orderReducer,
    InvertorAdjustments: InventoryAdjustmentsSlice,
    auth:authReducer,
    forgotPwd : forgotPwdReducer,
    resetPwd:resetPwdSlice,
    otp:otpSlice,
    signup:signupReducer,
    upload:uploadSlice,
    signOut:signoutReducer
  },
});

export default store;
