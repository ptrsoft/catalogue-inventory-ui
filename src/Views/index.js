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
import Createuser from "./Postlogin/Settingmenu/Rbac/createuser";
import UsersContent from "./Postlogin/Settingmenu/Rbac/UserContent";
import Creategroup from "./Postlogin/Settingmenu/Rbac/creategroup";
import PoliciesContent from "./Postlogin/Settingmenu/Rbac/PoliciesContent";
import PermissionsContent from "./Postlogin/Settingmenu/Rbac/PermissionsContent";
import GroupsContent from "./Postlogin/Settingmenu/Rbac/GroupsContent";
import RolesContent from "./Postlogin/Settingmenu/Rbac/RolesContent";
import Viewgroupdetail from "./Postlogin/Settingmenu/Rbac/viewgroupdetail";
import Alloptions from "./Postlogin/Settingmenu/Rbac/alloptions";
import CreateRunsheet from "./Postlogin/Logistics/Runsheet/CreateRunSheet";
import Settings from "./Postlogin/Settingmenu";
import RiderSummary from "./Postlogin/Logistics/Ridersummary";
import Onboarding from "./Postlogin/Logistics/Ridersummary/Onboarding";
import RiderDetails from "./Postlogin/Logistics/Ridersummary/Onboarding/RiderDetails";
import ApproveRider from "./Postlogin/Logistics/Ridersummary/Onboarding/ApproveRider";
import CollectionPayment from "./Postlogin/Logistics/CollectionPayment";
import ViewDetailsPage from "./Postlogin/Logistics/CollectionPayment/ViewCollection";
import Createpolicy from "./Postlogin/Settingmenu/Rbac/createpolicy";
import Viewpolicy from "./Postlogin/Settingmenu/Rbac/viewpolicy";

const Dashboards = lazy(() => import("./Postlogin/Dashboard"));

const Customers = lazy(() => import("./Postlogin/Customers"));
const AddNewCustomer = lazy(() =>
  import("./Postlogin/Customers/AddNewCustomer")
);
const Products = lazy(() => import("./Postlogin/Products"));
const Orders = lazy(() => import("./Postlogin/Logistics/Orders"));

const PurchaseOrders = lazy(() => import("./Postlogin/PurchaseOrders"));
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
            path={`${PREFIX_APP_PATH}/settings`}
            element={<Settings />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac`}
            element={<Alloptions />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/creategroup`}
            element={<Creategroup />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/createpolicy`}
            element={<Createpolicy />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/viewpolicy`}
            element={<Viewpolicy />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/users`}
            element={<UsersContent />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/roles`}
            element={<RolesContent />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/createuser`}
            element={<Createuser />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/groups`}
            element={<GroupsContent />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/groups/viewgroupdetail`}
            element={<Viewgroupdetail />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/policies`}
            element={<PoliciesContent />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/settings/rbac/permissions`}
            element={<PermissionsContent />}
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
            path={`${PREFIX_APP_PATH}/Logistics/runsheet/ViewRunSheet/:id`} // Notice the added slash before ':id'
            element={<ViewRunsheet />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/runsheet/ViewRunSheet/:id`} // Notice the added slash before ':id'
            element={<ViewRunsheet />}
          />

          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/CashCollection/View-details/:id`} // Notice the added slash before ':id'
            element={<ViewDetailsPage />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/runsheet`}
            element={<Runsheet />}
          />

          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/RiderSummary`}
            element={<RiderSummary />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/CollectionPayment`}
            element={<CollectionPayment />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/RiderSummary/onboarding`}
            element={<Onboarding></Onboarding>}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/RiderSummary/onboarding/ApproveRider/:id`}
            element={<ApproveRider />}
          />
          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/RiderSummary/onboarding/riderDetails/:id`}
            element={<RiderDetails />}
          />

          <Route
            exact
            path={`${PREFIX_APP_PATH}/Logistics/runsheet/CreateRunSheet`}
            element={<CreateRunsheet />}
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
            element={<NewAdjustment />}
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
