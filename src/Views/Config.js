const BASE_URL = "https://api.admin.promodeagro.com";

const Config = {
  BASE_URL,
  ADD_ITEM:`${BASE_URL}/inventory`,
  PUT_ACTIVE_INACTIVE:`${BASE_URL}/inventory/status`,
  DELETE:`${BASE_URL}/inventory/{id}`,
  PRODUCT_DETAIL:`${BASE_URL}/inventory/{id}`,
  FETCH_CASH_COLLECTION:`${BASE_URL}/runsheet/cash-collection`,

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
  CANCEL_ORDER: `${BASE_URL}/order`,
  FETCH_ORDERS: `${BASE_URL}/order-inventory`,
  FETCH_ORDERBYID: `${BASE_URL}/order`,
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

   UPDATE_ORDER_STATUS:`${BASE_URL}/order/proceed?ids=`,
   ASSIGN_DELIVERY_BOY: `${BASE_URL}/order/proceed?ids=`, // Will append `&assignee={assignee}` dynamically
   UPDATE_SINGLE_ORDER_STATUS:`${BASE_URL}/order/proceed?ids=`,
   ASSIGN_DELIVERY_BOY_SINGLEORDER: `${BASE_URL}/order/proceed?ids=`, // Will append `&assignee={assignee}` dynamically
   ORDERS_STATUS:`${BASE_URL}/order/stats`,

 
    FETCH_PRODUCTS:`${BASE_URL}/inventory`,
    CREATE_RUNSHEET:`${BASE_URL}/runsheet`,
    FETCH_RUNSHEET:`${BASE_URL}/runsheet`,

    FETCH_PRODUCTS_DETAIL:`${BASE_URL}/inventory`,
    PUT_PRODUCTS_DETAIL:`${BASE_URL}/publish`,
    PUT_PRICING:`${BASE_URL}/inventory`,
    FETCH_RIDERS:`${BASE_URL}/rider`,

 
};


export default Config;
