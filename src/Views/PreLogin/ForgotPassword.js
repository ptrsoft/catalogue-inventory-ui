// import React, { Component } from "react";

// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import {
//   Box,
//   Button,
//   Checkbox,
//   Container,
//   FormControlLabel,
//   Grid,
//   Link,
//   TextField,
//   Typography,
//   IconButton,
//   InputAdornment,
// } from "@mui/material";
// import { ValidationEngine, ErrorMessages } from "Utils/helperFunctions";
// const validationSchema = {
//   code: [
//     {
//       message: "Please enter code",
//       type: ValidationEngine.type.MANDATORY,
//     },
//     {
//         message: "Please valid code",
//         type: ValidationEngine.type.REGEX,
//         regex: ValidationEngine.NUMBER_ONLY_REGEX,
//       },
//   ],
//   email: [
//     {
//       message: "Please enter Email",
//       type: ValidationEngine.type.MANDATORY,
//     },
//     {
//       message: "Please valid Email",
//       type: ValidationEngine.type.REGEX,
//       regex: ValidationEngine.EMAIL_REGEX,
//     },
//   ],
//   newpassword: [
//     {
//       message: "Please enter Password",
//       type: ValidationEngine.type.MANDATORY,
//     },
//   ],
//   confirmNewpassword: [
//     {
//       message: "Please enter Password",
//       type: ValidationEngine.type.MANDATORY,
//     },
//   ],
// };
// const SCREEN_MODE = {
//   ENTER_EMAIL: 0,
//   VERIFY_EMAIL: 1,
//   CREATE_NEW_PASSWORD_SCREEN: 2,
//   PASSWORD_CHANGED_SCREEN: 3,
// };
// class ForgotPassword extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       screenMode: SCREEN_MODE.ENTER_EMAIL,
//       email: "",
//       code: "",
//       newpassword: "",
//       confirmNewpassword: "",
//       newpasswordEye: false,
//       confirmNewPasswordEye: false,
//       isSubmitted: false,
//     };
//   }
//   handleChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     const val = type === "checkbox" ? checked : value;
//     this.setState({ [name]: val });
//   };

//   validateForm = () => {
//     const { email, code, newpassword, confirmNewpassword, screenMode } =
//       this.state;
//     if (screenMode == 0) {
//       const error = ValidationEngine.validate(validationSchema, {
//         email,
//       });
//       return error;
//     } else if (screenMode == 1) {
//       const error = ValidationEngine.validate(validationSchema, {
//         code: code,
//       });
//       return error;
//     } else if (screenMode == 2) {
//       const error = ValidationEngine.validate(validationSchema, {
//         newpassword: newpassword,
//         confirmNewpassword: confirmNewpassword,
//       });
//       if (
//         error.newpassword.isValid &&
//         error.confirmNewpassword.isValid &&
//         newpassword !== confirmNewpassword
//       ) {
//         error.isValid = false;
//         error.confirmNewpassword.isValid = false;
//         error.confirmNewpassword.message = "Confirm password does not match";
//       }
//       return error;
//     }
//   };

//   enterEmailScreen = (errorData) => {
//     const {
//       email,
//       code,
//       newpassword,
//       confirmNewpassword,
//       screenMode,
//       isSubmitted,
//     } = this.state;
//     return (
//       <Container
//         maxWidth="sm"
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <Box sx={{ width: "100%", textAlign: "center", marginBottom: 3 }}>
//           <Typography variant="h4" component="h1" gutterBottom>
//             Forgot Password
//           </Typography>
//           <Typography variant="body1" color="textSecondary">
//             Enter Your Email Address
//           </Typography>
//         </Box>

//         <TextField
//           sx={{ marginBottom: 2 }}
//           label="Email Address"
//           variant="outlined"
//           fullWidth
//           name="email"
//           value={email}
//           onChange={this.handleChange}
//           error={!errorData.email.isValid && isSubmitted}
//           helperText={isSubmitted ? errorData.email.message : ""}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={() => {
//             const errorData = this.validateForm();
//             this.setState({
//               isSubmitted: true,
//             });
//             if (errorData?.isValid) {
//               this.setState({
//                 isSubmitted: false,
//                 screenMode: SCREEN_MODE.VERIFY_EMAIL,
//               });
//             }
//           }}
//         >
//           Confirm Email
//         </Button>
//       </Container>
//     );
//   };

//   otpScreen = (errorData) => {
//     const {
//       email,
//       code,
//       newpassword,
//       confirmNewpassword,
//       screenMode,
//       isSubmitted,
//     } = this.state;
//     return (
//       <Container
//         maxWidth="sm"
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <Box sx={{ width: "100%", textAlign: "center", marginBottom: 3 }}>
//           <Typography variant="h6" component="h1" gutterBottom>
//             Verify Your Email
//           </Typography>
//           <Typography variant="body1" color="textSecondary">
//             Enter Code
//           </Typography>
//         </Box>
//         <TextField
//           label="Enter Code"
//           variant="outlined"
//           value={this.state.code}
//           name="code"
//           id="code"
//           onChange={this.handleChange}
//           error={!errorData.code.isValid && isSubmitted}
//           helperText={isSubmitted ? errorData.code.message : ""}
//           fullWidth
//           sx={{ marginBottom: 2 }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={() => {
//             const errorData = this.validateForm();
//             this.setState({
//               isSubmitted: true,
//             });
//             if (errorData.isValid) {
//               this.setState({
//                 isSubmitted: false,
//                 screenMode: SCREEN_MODE.CREATE_NEW_PASSWORD_SCREEN,
//               });
//             }
//           }}
//         >
//           Verify
//         </Button>
//       </Container>
//     );
//   };

//   finalScreen = () => {
//     return (
//       <Container
//         maxWidth="sm"
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <Box sx={{ width: "100%", textAlign: "center", marginBottom: 3 }}>
//           <Typography variant="h6" component="h1" gutterBottom>
//             Password Changed
//           </Typography>
//           <Typography variant="body1" color="textSecondary">
//             Your Password Successfully Changed
//           </Typography>
//           <Typography variant="body1" color="textSecondary">
//             Click to below to login
//           </Typography>
//         </Box>

//         <Button variant="contained" color="primary" fullWidth>
//           Back To Login
//         </Button>
//       </Container>
//     );
//   };

//   handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   createNewPasswordScreen = (errorData) => {
//     const {
//       newpassword,
//       confirmNewpassword,

//       newpasswordEye,
//       confirmNewPasswordEye,
//       isSubmitted,
//     } = this.state;
//     return (
//       <Container
//         maxWidth="sm"
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <Box sx={{ width: "100%", textAlign: "center", marginBottom: 3 }}>
//           <Typography variant="h6" component="h1" gutterBottom>
//             Create New Password
//           </Typography>
//           <Typography variant="h6" component="h1" gutterBottom>
//             Enter Your New Password
//           </Typography>
//           <Typography variant="body1" color="textSecondary">
//             Enter New Password
//           </Typography>
//         </Box>
//         <TextField
//           label="Enter New Password"
//           variant="outlined"
//           value={newpassword}
//           name="newpassword"
//           id="newpassword"
//           type={newpasswordEye ? "text" : "password"}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   aria-label="toggle password visibility"
//                   onClick={() =>
//                     this.setState((prevState) => ({
//                       newpasswordEye: !prevState.newpasswordEye,
//                     }))
//                   }
//                   onMouseDown={this.handleMouseDownPassword}
//                 >
//                   {newpasswordEye ? <Visibility /> : <VisibilityOff />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//           onChange={this.handleChange}
//           error={!errorData.newpassword.isValid && isSubmitted}
//           helperText={isSubmitted ? errorData.newpassword.message : ""}
//           fullWidth
//           sx={{ marginBottom: 2 }}
//         />

//         <Typography variant="body1" color="textSecondary">
//           Confirm Password
//         </Typography>

//         <TextField
//           label="Enter Confirm New Password"
//           variant="outlined"
//           value={confirmNewpassword}
//           name="confirmNewpassword"
//           id="confirmNewpassword"
//           type={confirmNewPasswordEye ? "text" : "password"}
//           onChange={this.handleChange}
//           error={!errorData.confirmNewpassword.isValid && isSubmitted}
//           helperText={isSubmitted ? errorData.confirmNewpassword.message : ""}
//           fullWidth
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   aria-label="toggle password visibility"
//                   onClick={() =>
//                     this.setState((prevState) => ({
//                       confirmNewPasswordEye: !prevState.confirmNewPasswordEye,
//                     }))
//                   }
//                   onMouseDown={this.handleMouseDownPassword}
//                 >
//                   {confirmNewPasswordEye ? <Visibility /> : <VisibilityOff />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//           sx={{ marginBottom: 2 }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={() => {
//             const errorData = this.validateForm();
//             this.setState({
//               isSubmitted: true,
//             });
//             if (errorData.isValid) {
//               this.setState({
//                 isSubmitted: false,
//                 screenMode: SCREEN_MODE.PASSWORD_CHANGED_SCREEN,
//               });
//             }
//           }}
//         >
//           Continue
//         </Button>
//       </Container>
//     );
//   };

//   render() {
//     const { screenMode } = this.state;
//     const errorData = this.validateForm();
//     return (
//       <>
//         {
//           screenMode == 0 ? (
//             this.enterEmailScreen(errorData)
//           ) : screenMode == 1 ? (
//             <>{this.otpScreen(errorData)}</>
//           ) : screenMode == 2 ? (
//             <>{this.createNewPasswordScreen(errorData)}</>
//           ) : (
//             <> {this.finalScreen()}</>
//           )
//           //   password changed screen
//         }
//       </>
//     );
//   }
// }

// export default ForgotPassword;
