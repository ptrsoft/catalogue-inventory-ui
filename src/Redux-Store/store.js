import { configureStore } from "@reduxjs/toolkit";
import CustomersReducer from "Redux-Store/Customers/CustomersSlice";
// import authReducer from "Redux-Store/authenticate/signin/signinSlice"

import ProductsSlice from "./Products/ProductsSlice";
import orderInventoryReducer from './Orders/OrdersSlice';
import InventoryAdjustmentsSlice from "./InventoryAdjustments/InventoryAdjustmentsSlice";
import forgotPwdReducer from "Redux-Store/authenticate/ForgotPwd/forgotPwdSlice"
import resetPwdSlice from "Redux-Store/authenticate/newpwd/newPwdSlice"
import otpSlice from "Redux-Store/authenticate/otpVerify/otpVerifySlice"
import signupReducer from "Redux-Store/signup/signupSlice"
import signoutReducer from "Redux-Store/authenticate/signout/signoutSlice"
import uploadSlice from "Redux-Store/uploadImage/uploadSlice" 
import runsheetReducer from "./Runsheet/RunsheetSlice";
import ridersReducer from './RiderSummary/RiderSummarySlice';
import cashCollectionReducer from './cashCollection/cashCollectionSlice';
import pincodeReducer from "./Pincode/pincodeSlice"
import authReducer from "Redux-Store/authenticate/auth/authSlice"
const store = configureStore({
  reducer: {
    cashCollection: cashCollectionReducer,
    riders: ridersReducer,
    runsheet: runsheetReducer,
    orderInventory: orderInventoryReducer,
    customers: CustomersReducer,
    products: ProductsSlice,
    pincode: pincodeReducer,
    InvertorAdjustments: InventoryAdjustmentsSlice,
    // auth:authReducer,
    forgotPwd : forgotPwdReducer,
    resetPwd:resetPwdSlice,
    otp:otpSlice,
    signup:signupReducer,
    upload:uploadSlice,
    signOut:signoutReducer,
    auth: authReducer,

  },
});

export default store;
