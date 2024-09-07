import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  FormField,
  Input,
  Container,
  Header,
  Flashbar
} from "@cloudscape-design/components";
import { resetPassword } from "Redux-Store/authenticate/newpwd/newPwdThunk";
import { useNavigate } from "react-router-dom";
import { LuEyeOff } from "react-icons/lu";
import { FiEye } from "react-icons/fi";

const NewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [items, setItems] = React.useState([]);
  const [confirmationCode, setConfirmationCode] = React.useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // State for success message

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.resetPwd);
  const emailVal = localStorage.getItem("email");
  const parsedEmail = JSON.parse(emailVal);
  const email = parsedEmail;

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
          setIsSuccess(true); // Set success state to true
          // Reset fields
          setNewPassword("");
          setConfirmPassword("");
          setConfirmationCode("");
          localStorage.removeItem("email");

          // Navigate to the sign-in page after a delay
          setTimeout(() => {
            navigate("/auth/signin");
          }, 13000); // 13 seconds delay

          console.log(email);
          console.log(confirmationCode);
          console.log(newPassword);
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
    <div style={{ paddingTop: "10vh" }}>
      <Flashbar items={items} />

      <div
        style={{
          paddingTop: "10vh",
          display: "flex",
          justifyContent: "center",
          height: isSuccess ? "33vh": "63vh",
        }}
      >
        <div
          style={{
            padding: "0 15px",
            borderRadius: "10px",
            backgroundColor: "white",
            boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 2,
            width: isSuccess ? "29vw" : "26vw", // Conditionally adjust the width
            // transition: "width 0.5s ease-in-out", // Smooth transition effect
          }}
        >
          <Container variant="borderless">
            <div style={{ marginBottom: "20px", padding: "0 0 0 0" }}>
              <Header variant="h1">
                <div
                  style={{
                    textShadow: "0px 1px, 1px 0px, 1px 1px",
                    // display: "flex",
                    // justifyContent: "center",
                  }}
                >
                  {isSuccess ? <center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Password Changed</center>: <div style={{display:"flex",width:"21vw",justifyContent:"center"}}><text>Create New Password</text></div>}
                </div>
                <span
                  style={{
                    fontSize: "small",
                    color: "#8B8D97",
                    fontWeight: "lighter",
                    display: "flex",
                    justifyContent: "center",
                    paddingLeft : isSuccess ? "3vw" : "0"
                  }}
                >
                  {isSuccess
                    ? "Your password has been changed successfully."
                    : "Create a strong password for your account"}
                </span>
            </Header>
            </div>
            {!isSuccess ? (
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
                    onChange={(e) => setConfirmationCode(e.detail.value)}
                    maxLength={6}
                  />
                </FormField>
                <FormField label="Enter New Password">
                  <div style={{ position: "relative", width: "100%" }}>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.detail.value)}
                      style={{ paddingRight: "40px" }} // Adjust padding for the icon
                    />
                    <div
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#8B8D97", // Adjust color as needed
                      }}
                    >
                      {passwordVisible ? <FiEye /> : <LuEyeOff />}
                    </div>
                  </div>
                </FormField>
                <FormField label="Confirm">
                  <div style={{ position: "relative", width: "100%" }}>
                    <Input
                      type={newPasswordVisible ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.detail.value)}
                    />
                    <div
                      onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#8B8D97", // Adjust color as needed
                      }}
                    >
                      {newPasswordVisible ? <FiEye /> : <LuEyeOff />}
                    </div>
                  </div>
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
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="primary"
                  onClick={() => navigate("/auth/signin")}
                >
                  Back to Login
                </Button>
              </div>
            )}
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
