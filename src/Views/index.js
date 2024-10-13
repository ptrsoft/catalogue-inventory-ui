import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PREFIX_APP_PATH, PREFIX_AUTH_PATH } from "./../Config/Config";
import Inventory from "./Postlogin/Inventory";
import AddItem from "./Postlogin/Inventory/addItem/addItem";
import InventoryAdjustments from "./Postlogin/Inventory/InventoryAdjustments";
import Edit from "./Postlogin/Inventory/edit/edit";

import CreateAdjustment from "./Postlogin/Inventory/InventoryAdjustments/CreateAdjustment";
import NewAdjustment from "./Postlogin/Inventory/InventoryAdjustments/NewAdjustment";
import Runsheet from "./Postlogin/Logistics/Runsheet";
import ViewRunsheet from "./Postlogin/Logistics/Runsheet/ViewRunSheet";
import CreateRunsheet from "./Postlogin/Logistics/Runsheet/CreateRunSheet";
const Dashboards = lazy(() => import("./Postlogin/Dashboard"));


const Customers = lazy(() => import("./Postlogin/Customers"));
const AddNewCustomer = lazy(() =>
  import("./Postlogin/Customers/AddNewCustomer")
);
const Products = lazy(() => import("./Postlogin/Products"));
const Orders = lazy(() => import("./Postlogin/Logistics/Orders"));

const PurchaseOrders = lazy(() =>
  import("./Postlogin/PurchaseOrders")
);
const PathNotFOund = lazy(() => import("./PathNotFound"));
const Signin = lazy(() => import("./PreLogin/Signin"));
const Signup = lazy(() => import("./PreLogin/Signup"));
const ForgotPassword = lazy(() => import("./PreLogin/ForgotPassword"));
const OtpVerification = lazy(() => import("./PreLogin/otpVerification"));
const NewPassword = lazy(() => import("./PreLogin/newPassword"));

const Views = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            exact
            path={`${PREFIX_APP_PATH}/dashboard`}
            element={<Dashboards />}
          />
          {/* <Route
            exact
            path={`${PREFIX_APP_PATH}/inventory`}
            element={<Inventory />}
          /> */}
           {/* <Route
            exact
            path={`${PREFIX_AUTH_PATH}/edit`}
            element={<Edit />}
          /> */}
                    <Route exact path="/app/inventory/edit" element={<Edit />} />

          <Route
            exact
            path={`${PREFIX_APP_PATH}/customers`}
            element={<Customers />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/add-new-customer`}
            element={<AddNewCustomer />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/products`}
            element={<Products />}
          />

          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/orders`}
            element={<Orders />}
          />
              <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/runsheet`}
            element={<Runsheet/>}
          />
              <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/runsheet/ViewRunSheet`}
            element={<ViewRunsheet/>}
          />
            <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/runsheet/CreateRunSheet`}
            element={<CreateRunsheet/>}
          />
         
          <Route
            exact
            path={`${PREFIX_APP_PATH}/purchaseOrders`}
            element={<PurchaseOrders />}
          />

          <Route
            exact
            path={`${PREFIX_AUTH_PATH}/signin`}
            element={<Signin />}
          />
          <Route
            exact
            path={`${PREFIX_AUTH_PATH}/signup`}
            element={<Signup />}
          />

          <Route
            exact
            path={`${PREFIX_AUTH_PATH}/forgot-password`}
            element={<ForgotPassword />}
          />
          <Route
            exact
            path={`${PREFIX_AUTH_PATH}/otpverification`}
            element={<OtpVerification />}
          />
          <Route
            exact
            path={`${PREFIX_AUTH_PATH}/newpassword`}
            element={<NewPassword />}
          />
          <Route exact path="/app/inventory" element={<Inventory />} />
          <Route
            exact
            path="/app/inventory/adjustments"
            element={<InventoryAdjustments />}
          />
           <Route
            exact
            path="/app/inventory/create-adjustment"
            element={<CreateAdjustment />}
          />  
          <Route
            exact
            path="/app/inventory/new-adjustment"
            element={<NewAdjustment/>}
          />
          <Route exact path="/app/inventory/addItem" element={<AddItem />} />
          <Route exact path="/" element={<Navigate to="/app/dashboard" />} />

          <Route path="*" element={<PathNotFOund />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Views;
