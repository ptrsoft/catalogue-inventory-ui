import { Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
export const ValidationEngine = {
  EMAIL_REGEX: /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/,
  PASSWORD_REGEX: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  MOBILE_NUMBER_REGEX: /^\d{10}$/,
  NUMBER_ONLY_REGEX: /^[0-9]+$/,
  DECIMAL_ALLOW_REGEX: /^\d*\.?\d*$/,
  ONLY_TWO_DECIMAL_ALLOW_REGEX: /^(?:\d*\.\d{1,2}|\d+)$/,
  type: {
    MANDATORY: 0,
    REGEX: 1,
    CHARACTERCOUNT: 2,
  },
  validate: (validationJSON, data) => {
    function validateMandatory(validationObject, value) {
      if (!value || value === '') {
        return {
          isValid: false,
          error: {
            isValid: false,
            message: validationObject.message,
          },
        };
      }
      return {
        isValid: true,
        error: {
          isValid: true,
          message: "",
        },
      };
    }

    function validateCharacterCount(validationObject, value) {
      // Check if the validationObject type is CHARACTERCOUNT
      if (validationObject.type === ValidationEngine.type.CHARACTERCOUNT) {
        // Assume 200 is the limit if not explicitly passed
        const maxCharacterCount = 200;
    
        // Check if the value exceeds the max character count
        if (value && value.length > maxCharacterCount) {
          return {
            isValid: false,
            error: {
              isValid: false,
              message: validationObject.message || `Cannot exceed ${maxCharacterCount} characters`,
            },
          };
        }
    
        // If the value is within the limit, validation passes
        return {
          isValid: true,
          error: {
            isValid: true,
            message: "",
          },
        };
      }
    
      // If the type does not match, return valid by default (or handle other types if needed)
      return {
        isValid: true,
        error: {
          isValid: true,
          message: "",
        },
      };
    }
    

    function validateRegex(validationObject, value) {
      if (validationObject.regex && !validationObject.regex.test(value)) {
        return {
          isValid: false,
          error: {
            isValid: false,
            message: validationObject.message,
          },
        };
      }
      return {
        isValid: true,
        error: {
          isValid: true,
          message: "",
        },
      };
    }

    const keys = Object.keys(data);
    const errors = {};
    let isValid = true;
    let errorObj;
    keys.forEach((key) => {
      const validationArray = validationJSON[key];
      const value = data[key];
      for (const validationObj of validationArray) {
        if (validationObj.type === ValidationEngine.type.MANDATORY) {
          errorObj = validateMandatory(validationObj, value);
        } else if (
          validationObj.type === ValidationEngine.type.CHARACTERCOUNT
        ) {
          errorObj = validateCharacterCount(validationObj, value);
        } else if (validationObj.type === ValidationEngine.type.REGEX) {
          errorObj = validateRegex(validationObj, value);
        }
        errors[key] = errorObj.error;
        isValid = isValid && errorObj.isValid;
        if (!errorObj.isValid) {
          break;
        }
      }
    });
    errors.isValid = isValid;
    return errors;
  },
};

export const ErrorMessages = {
  error: (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }),
  success: (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }),
  info: (message) =>
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }),
};
export const Loader = {
  commonLoader() {
    return (
      <Box className="d-flex align-items-center justify-content-center common-loader">
        <CircularProgress />
      </Box>
    );
  },
};

export const pathFile = {
  dashboards: "DashBoard",
};
