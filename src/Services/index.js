import axios from "axios";
import config from "Views/Config";
// import { ToastMessage } from "Toast/ToastMessage";
// import { getCurrentOrgId } from "Utils";

const TOKEN_PAYLOAD_KEY = "Authorization"; // Customize header key if needed
const PUBLIC_REQUEST_KEY = "Public-Request";

// Main Axios instance for authenticated requests
const service = axios.create({
  baseURL: config.BASE_URL, // Correctly set base URL
  timeout: 60000,
});

service.interceptors.request.use(
  (request) => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve and parse 'user' object from local storage
    const jwtToken = user?.accessToken; // Extract accessToken if available

    if (jwtToken) {
      request.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${jwtToken}`; // Set token in request headers
    }

    if (
      !jwtToken &&
      request.headers.hasOwnProperty(PUBLIC_REQUEST_KEY) &&
      !request.headers[PUBLIC_REQUEST_KEY]
    ) {
      window.location.href = "/"; // Redirect if no token and request is not public
      window.location.reload();
    }
    return request;
  },
  (error) => {
    // Handle request error
    // ToastMessage.error("Request error");
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Redirect to login only if 401 status and not on login page
      if (status === 401 && window.location.pathname !== "/login") {
        localStorage.removeItem("user"); // Clear user data from local storage
        window.location.href = "/auth/signin"; // Redirect to login page
      } else if (status === 403) {
        // Optional: Handle Forbidden (403) separately if needed
        // ToastMessage.error("Access denied.");
      }
      // Optional: ToastMessage for other errors
      // ToastMessage.error("An error occurred");
    }
    return Promise.reject(error);
  }
);

// Axios instance for public routes (e.g., login requests)
const authService = axios.create({
  baseURL: config.BASE_URL,
  timeout: 60000,
});

authService.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { service as postLoginService };
export { authService as preLoginService };
