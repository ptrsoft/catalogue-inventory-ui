import React, { lazy, Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PREFIX_APP_PATH, PREFIX_AUTH_PATH } from "./../Config/Config";
import { AuthContext } from "context/Authcontext";

// Lazy imports for all components
const Dashboards = lazy(() => import("./Postlogin/Dashboard"));
const Inventory = lazy(() => import("./Postlogin/Inventory"));
const AddItem = lazy(() => import("./Postlogin/Inventory/addItem/addItem"));
const InventoryAdjustments = lazy(() => import("./Postlogin/Inventory/InventoryAdjustments"));
const Edit = lazy(() => import("./Postlogin/Inventory/edit/edit"));
const CreateAdjustment = lazy(() => import("./Postlogin/Inventory/InventoryAdjustments/CreateAdjustment"));
const NewAdjustment = lazy(() => import("./Postlogin/Inventory/InventoryAdjustments/NewAdjustment"));
const Runsheet = lazy(() => import("./Postlogin/Logistics/Runsheet"));
const ViewRunsheet = lazy(() => import("./Postlogin/Logistics/Runsheet/ViewRunSheet"));
const Createuser = lazy(() => import("./Postlogin/Settingmenu/Rbac/createuser"));
const UsersContent = lazy(() => import("./Postlogin/Settingmenu/Rbac/UserContent"));
const Creategroup = lazy(() => import("./Postlogin/Settingmenu/Rbac/creategroup"));
const PoliciesContent = lazy(() => import("./Postlogin/Settingmenu/Rbac/PoliciesContent"));
const PermissionsContent = lazy(() => import("./Postlogin/Settingmenu/Rbac/PermissionsContent"));
const GroupsContent = lazy(() => import("./Postlogin/Settingmenu/Rbac/GroupsContent"));
const RolesContent = lazy(() => import("./Postlogin/Settingmenu/Rbac/RolesContent"));
const Viewgroupdetail = lazy(() => import("./Postlogin/Settingmenu/Rbac/viewgroupdetail"));
const Alloptions = lazy(() => import("./Postlogin/Settingmenu/Rbac/alloptions"));
const CreateRunsheet = lazy(() => import("./Postlogin/Logistics/Runsheet/CreateRunSheet"));
const Settings = lazy(() => import("./Postlogin/Settingmenu"));
const RiderSummary = lazy(() => import("./Postlogin/Logistics/Ridersummary"));
const Onboarding = lazy(() => import("./Postlogin/Logistics/Ridersummary/Onboarding"));
const RiderDetails = lazy(() => import("./Postlogin/Logistics/Ridersummary/Onboarding/RiderDetails"));
const ApproveRider = lazy(() => import("./Postlogin/Logistics/Ridersummary/Onboarding/ApproveRider"));
const CollectionPayment = lazy(() => import("./Postlogin/Logistics/CollectionPayment"));
const ViewDetailsPage = lazy(() => import("./Postlogin/Logistics/CollectionPayment/ViewCollection"));
const Createpolicy = lazy(() => import("./Postlogin/Settingmenu/Rbac/createpolicy"));
const Viewpolicy = lazy(() => import("./Postlogin/Settingmenu/Rbac/viewpolicy"));
const Pincodes = lazy(() => import("./Postlogin/Inventory/pincondes"));
const Addpincode = lazy(() => import("./Postlogin/Inventory/pincondes/Addpincode"));
const Viewpincode = lazy(() => import("./Postlogin/Inventory/pincondes/Viewpincode"));
const Customers = lazy(() => import("./Postlogin/Customers"));
const AddNewCustomer = lazy(() => import("./Postlogin/Customers/AddNewCustomer"));
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
  // Accessing authentication state
  const { isAuthenticated } = useContext(AuthContext);

  // Protected Route Wrapper: Ensures user is authenticated
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to={`${PREFIX_AUTH_PATH}/signin`} />;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Protected Routes */}
        <Route exact path={`${PREFIX_APP_PATH}/dashboard`} element={<ProtectedRoute element={<Dashboards />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/inventory`} element={<ProtectedRoute element={<Inventory />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/inventory/addItem`} element={<ProtectedRoute element={<AddItem />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/inventory/adjustments`} element={<ProtectedRoute element={<InventoryAdjustments />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/inventory/create-adjustment`} element={<ProtectedRoute element={<CreateAdjustment />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/inventory/new-adjustment`} element={<ProtectedRoute element={<NewAdjustment />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/inventory/edit`} element={<ProtectedRoute element={<Edit />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/inventory/pincodes`} element={<ProtectedRoute element={<Pincodes />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/inventory/pincodes/addpincode`} element={<ProtectedRoute element={<Addpincode />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/inventory/pincodes/viewpincode`} element={<ProtectedRoute element={<Viewpincode />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/customers`} element={<ProtectedRoute element={<Customers />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/add-new-customer`} element={<ProtectedRoute element={<AddNewCustomer />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/products`} element={<ProtectedRoute element={<Products />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/orders`} element={<ProtectedRoute element={<Orders />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/runsheet`} element={<ProtectedRoute element={<Runsheet />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/runsheet/viewRunSheet/:id`} element={<ProtectedRoute element={<ViewRunsheet />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/runsheet/createRunSheet`} element={<ProtectedRoute element={<CreateRunsheet />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/riderSummary`} element={<ProtectedRoute element={<RiderSummary />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/riderSummary/onboarding`} element={<ProtectedRoute element={<Onboarding />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/riderSummary/onboarding/riderDetails/:id`} element={<ProtectedRoute element={<RiderDetails />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/riderSummary/onboarding/approveRider/:id`} element={<ProtectedRoute element={<ApproveRider />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/collectionPayment`} element={<ProtectedRoute element={<CollectionPayment />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/logistics/collectionPayment/view-details/:id`} element={<ProtectedRoute element={<ViewDetailsPage />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/purchaseOrders`} element={<ProtectedRoute element={<PurchaseOrders />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings`} element={<ProtectedRoute element={<Settings />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac`} element={<ProtectedRoute element={<Alloptions />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/creategroup`} element={<ProtectedRoute element={<Creategroup />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/createpolicy`} element={<ProtectedRoute element={<Createpolicy />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/viewpolicy`} element={<ProtectedRoute element={<Viewpolicy />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/users`} element={<ProtectedRoute element={<UsersContent />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/roles`} element={<ProtectedRoute element={<RolesContent />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/createuser`} element={<ProtectedRoute element={<Createuser />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/groups`} element={<ProtectedRoute element={<GroupsContent />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/groups/viewgroupdetail`} element={<ProtectedRoute element={<Viewgroupdetail />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/policies`} element={<ProtectedRoute element={<PoliciesContent />} />} />
        <Route exact path={`${PREFIX_APP_PATH}/settings/rbac/permissions`} element={<ProtectedRoute element={<PermissionsContent />} />} />

        {/* Public Routes */}
        <Route exact path={`${PREFIX_AUTH_PATH}/signin`} element={<Signin />} />
        <Route exact path={`${PREFIX_AUTH_PATH}/signup`} element={<Signup />} />
        <Route exact path={`${PREFIX_AUTH_PATH}/forgotPassword`} element={<ForgotPassword />} />
        <Route exact path={`${PREFIX_AUTH_PATH}/otpVerification`} element={<OtpVerification />} />
        <Route exact path={`${PREFIX_AUTH_PATH}/newPassword`} element={<NewPassword />} />
        <Route path="*" element={<PathNotFOund />} />
      </Routes>
    </Suspense>
  );
};

export default Views;
