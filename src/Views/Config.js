const BASE_URL = "https://lou294nkli.execute-api.us-east-1.amazonaws.com";

const Config = {
  BASE_URL,
  ADD_ITEM:`${BASE_URL}/inventory`,
  PUT_ACTIVE_INACTIVE:`${BASE_URL}/inventory/status`,
  DELETE:`${BASE_URL}/inventory/{id}`,
  PRODUCT_DETAIL:`${BASE_URL}/inventory/{id}`,
  PUT_ACTIVE_INACTIVE:`${BASE_URL}/inventory/status`,
  CONTAINER_DIV:`${BASE_URL}/inventory/stats`,
  UPLOAD_IMAGE:`${BASE_URL}/uploadUrl`,
  AUTH_USER:`${BASE_URL}/auth/signin`,
  SIGNUP:`${BASE_URL}/auth/signup`,
  SIGNOUT:`${BASE_URL}/auth/signout`,
  FORGOT_PASSSWORD:`${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD:`${BASE_URL}/auth/reset-password`,
  FETCH_QUOTATIONS: `${BASE_URL}/users`,
  FINISH_PRODUCT_SPECIFICATIONS: `${BASE_URL}/users`,
  FINISH_PRODUCT_VIEW_ATACHMENTS: `${BASE_URL}/users`,
  FINISH_PRODUCT_DETAILS: `${BASE_URL}/users`,
  FETCH_ORDERS: `${BASE_URL}/users`,
  ORDERS_DETAILS:`${BASE_URL}/users`,
  ORDERS_VIEWATTACHMENTS:`${BASE_URL}/users`,
   FETCH_BATCH_SHEET:`${BASE_URL}/users`,
   FETCH_INVENTORY:`${BASE_URL}/inventory`,
   FETCH_INVENTORY_ADJUSTMENTS:`${BASE_URL}/inventory/adjust`,
   FETCH_RAW_MATERIALS:`${BASE_URL}/users`,
   FETCH_PURCHASE_ORDER:`${BASE_URL}/users`,
   FETCH_PURCHASE_REQUSTION_LIST:`${BASE_URL}/users`,
   VENDOR_PROFILE:`${BASE_URL}/users`,
   FETCH_CUSTOMER:`${BASE_URL}/user`,
};

export default Config;
