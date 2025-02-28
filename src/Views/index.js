import React, { lazy, Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PREFIX_APP_PATH, PREFIX_AUTH_PATH } from "./../Config/Config";
import { AuthContext } from "context/Authcontext";

// Lazy imports for all components
const Dashboards = lazy(() => import("./Postlogin/Dashboard"));
const Inventory = lazy(() => import("./Postlogin/Inventory"));
const AddItem = lazy(() => import("./Postlogin/Inventory/addItem/addItem"));
const AddItemForm = lazy(() => import("./Postlogin/Inventory/myadd"));

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
const AddEditpincode = lazy(() => import("./Postlogin/Inventory/pincondes/Add/Add&Editpincode"));
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
 // Protected Route Wrapper: Ensures user is authenticated
 const ProtectedRoute = ({ element,isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to={`${PREFIX_AUTH_PATH}/signin`} />;
};
const Views = () => {
  // Accessing authentication state
  const { isAuthenticated } = useContext(AuthContext);

 

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Protected Routes */}
        <Route path="/app/dashboard" element={isAuthenticated ? <Dashboards /> : <Navigate to="/auth/signin" />} />
        <Route  path={`${PREFIX_APP_PATH}/inventory`} element={<ProtectedRoute element={<Inventory />} isAuthenticated={isAuthenticated} />} />
        {/* <Route  path={`${PREFIX_APP_PATH}/inventory/addItem`} element={<ProtectedRoute element={<AddItem />} />} /> */}
        <Route  path={`${PREFIX_APP_PATH}/inventory/addItem`}element={<ProtectedRoute element={<AddItemForm/>} isAuthenticated={isAuthenticated}/>} />

        <Route  path={`${PREFIX_APP_PATH}/inventory/adjustments`} element={<ProtectedRoute element={<InventoryAdjustments />} isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/inventory/create-adjustment`} element={<ProtectedRoute element={<CreateAdjustment />} isAuthenticated={isAuthenticated}/>} />
        <Route  path={`${PREFIX_APP_PATH}/inventory/new-adjustment`} element={<ProtectedRoute element={<NewAdjustment />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/inventory/edit`} element={<ProtectedRoute element={<Edit />} />}isAuthenticated={isAuthenticated} />
        <Route  path={`${PREFIX_APP_PATH}/inventory/pincodes`} element={<ProtectedRoute element={<Pincodes />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/inventory/pincodes/addpincode`} element={<ProtectedRoute element={<AddEditpincode />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/inventory/pincodes/Editpincode`} element={<ProtectedRoute element={<AddEditpincode />} isAuthenticated={isAuthenticated}/>} />

        <Route  path={`${PREFIX_APP_PATH}/inventory/pincodes/viewpincode`} element={<ProtectedRoute element={<Viewpincode />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/customers`} element={<ProtectedRoute element={<Customers />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/add-new-customer`} element={<ProtectedRoute element={<AddNewCustomer />} isAuthenticated={isAuthenticated}/>} />
        <Route  path={`${PREFIX_APP_PATH}/products`} element={<ProtectedRoute element={<Products />} isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/orders`} element={<ProtectedRoute element={<Orders />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/runsheet`} element={<ProtectedRoute element={<Runsheet />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/runsheet/viewRunSheet/:id`} element={<ProtectedRoute element={<ViewRunsheet />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/runsheet/createRunSheet`} element={<ProtectedRoute element={<CreateRunsheet />} isAuthenticated={isAuthenticated}/>} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/riderSummary`} element={<ProtectedRoute element={<RiderSummary />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/riderSummary/onboarding`} element={<ProtectedRoute element={<Onboarding />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/riderSummary/onboarding/riderDetails/:id`} element={<ProtectedRoute element={<RiderDetails />} isAuthenticated={isAuthenticated}/>} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/riderSummary/onboarding/approveRider/:id`} element={<ProtectedRoute element={<ApproveRider />} isAuthenticated={isAuthenticated}/>} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/collectionPayment`} element={<ProtectedRoute element={<CollectionPayment />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/logistics/collectionPayment/view-details/:id`} element={<ProtectedRoute element={<ViewDetailsPage />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/purchaseOrders`} element={<ProtectedRoute element={<PurchaseOrders />} isAuthenticated={isAuthenticated}/>} />
        <Route  path={`${PREFIX_APP_PATH}/settings`} element={<ProtectedRoute element={<Settings />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac`} element={<ProtectedRoute element={<Alloptions />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/creategroup`} element={<ProtectedRoute element={<Creategroup />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/createpolicy`} element={<ProtectedRoute element={<Createpolicy />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/viewpolicy`} element={<ProtectedRoute element={<Viewpolicy />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/users`} element={<ProtectedRoute element={<UsersContent />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/roles`} element={<ProtectedRoute element={<RolesContent />} isAuthenticated={isAuthenticated}/>} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/createuser`} element={<ProtectedRoute element={<Createuser />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/groups`} element={<ProtectedRoute element={<GroupsContent />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/groups/viewgroupdetail`} element={<ProtectedRoute element={<Viewgroupdetail />}isAuthenticated={isAuthenticated} />} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/policies`} element={<ProtectedRoute element={<PoliciesContent />} isAuthenticated={isAuthenticated}/>} />
        <Route  path={`${PREFIX_APP_PATH}/settings/rbac/permissions`} element={<ProtectedRoute element={<PermissionsContent />}isAuthenticated={isAuthenticated} />} />

        {/* Public Routes */}
        <Route  path={`${PREFIX_AUTH_PATH}/signin`} element={<Signin />} />
        <Route  path={`${PREFIX_AUTH_PATH}/signup`} element={<Signup />} />
        <Route  path={`${PREFIX_AUTH_PATH}/forgotPassword`} element={<ForgotPassword />} />
        <Route  path={`${PREFIX_AUTH_PATH}/otpVerification`} element={<OtpVerification />} />
        <Route  path={`${PREFIX_AUTH_PATH}/newPassword`} element={<NewPassword />} />
        <Route path="*" element={<PathNotFOund />} />
      </Routes>
    </Suspense>
  );
};

export default Views;
