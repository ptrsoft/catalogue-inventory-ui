import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  FormField,
  Input,
  Container,
  Header,Flashbar
} from "@cloudscape-design/components";
import { resetPassword } from "Redux-Store/authenticate/newpwd/newPwdThunk";
import { Navigate, useNavigate } from "react-router-dom";
const NewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [items, setItems] = React.useState([]);
 const [confirmationCode,setconfirmationCode]= React.useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.resetPwd);
  const email = useSelector((state) => state.forgotPwd.email);
  // const confirmationCode = useSelector((state) => state.otp.otp);
  const handleSubmit = () => {
    if (newPassword === confirmPassword) {
      dispatch(resetPassword({ email, confirmationCode, newPassword }))
        .unwrap()
        .then(() => {
          // If the API call is successful
          setItems([
            {
              type: "success",
              content: "Password has been changed successfully!",
              dismissible: true,
              dismissLabel: "Dismiss message",
              onDismiss: () => setItems([]),
              id: "message_1",
            },
          ]);
          // Reset fields
          setNewPassword("");
          setConfirmPassword("");
          setconfirmationCode("");
          
          // Navigate to the dashboard
          navigate("/app/dashboard");
          
          console.log(email)
          console.log(confirmationCode)
          console.log(newPassword)
        })
        .catch((error) => {
          // If the API call fails, show error flashbar
          setItems([
            {
              type: "error",
              content: `Password reset failed: ${error.message}`,
              dismissible: true,
              dismissLabel: "Dismiss message",
              onDismiss: () => setItems([]),
              id: "message_2",
            },
          ]);
        });
      setLocalError(""); 
    } else {
      setLocalError("Passwords do not match!");
    }
  };
  
  // Extract the error message if the error is an object
  const errorMessage = typeof error === "string" ? error : error?.message;

  return (
    <div style={{ paddingTop:"10vh" }}>
    <Flashbar items={items} />

      <div
        style={{
          paddingTop: "10vh",
          display: "flex",
          justifyContent: "center",
          height:"63vh"
        }}
      >
        <div
          style={{
            padding: "0 15px",
            borderRadius: "10px",
            backgroundColor: "white",
            boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 2,
            width: "26vw",
          }}
        >
          <Container variant="borderless">
            <div style={{ marginBottom: "20px", padding: "0 0 0 0" }}>
              <Header variant="h1">
                <div
                  style={{
                    textShadow: "0px 1px, 1px 0px, 1px 1px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Create New Password
                </div>
                <span
                  style={{
                    fontSize: "small",
                    color: "#8B8D97",
                    fontWeight: "lighter",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Create a strong password for your account
                </span>
              </Header>
            </div>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              
              <FormField label="Enter OTP">
                <Input
                  placeholder="Enter your 6-digit OTP"
                  value={confirmationCode}
                  onChange={(e) => setconfirmationCode(e.detail.value)}
                  maxLength={6}
                />
              </FormField>
              <FormField label="Enter New Password">
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.detail.value)}
                />
              </FormField>
              <FormField label="Confirm">
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.detail.value)}
                />
              </FormField>
              {localError && (
                <div style={{ color: "red", textAlign: "center" }}>
                  {localError}
                </div>
              )}
              {errorMessage && (
                <div style={{ color: "red", textAlign: "center" }}>
                  {errorMessage}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "2vh 2vw 0 2vw",
                }}
              >
                <Button
                  fullWidth
                  ariaExpanded
                  variant="primary"
                  type="submit"
                  loading={loading}
                >
                  Create Password
                </Button>
              </div>
           
            </form>
          </Container>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        <svg
          viewBox="0 0 1130 320"
          xmlns="http://www.w3.org/2000/svg"
                    // style={{ display: "block", width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient
              id="gradient"
              x1="0%"
              y1="0%"
              x2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#9f4bad", stopOpacity: 1 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "#f8a4b8", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#e2e290", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <path fill="url(#gradient)" fill-opacity="0.98" d="M0,160L60,176C120,192,240,224,360,213.3C480,203,600,149,720,117.3C840,85,960,75,1080,85.3C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>

        </svg>
      </div>
    </div>
  );
};

export default NewPassword;
