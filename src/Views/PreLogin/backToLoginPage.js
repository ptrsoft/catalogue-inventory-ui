import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Flashbar,FormField, Input, Container, Header } from "@cloudscape-design/components";
import { forgotPwd } from "Redux-Store/authenticate/ForgotPwd/forgotPwdThunk";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const BackToLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [email, setEmail] = useState("");
  const { loading, error } = useSelector((state) => state.forgotPwd);
  const [items, setItems] = React.useState([]);

  const handleSendOtp = () => {
    localStorage.setItem("email", JSON.stringify(email));
    dispatch(forgotPwd(email))
    .unwrap()
    .then(() => {
        console.log("");
        setEmail("")
        setItems([
          {
            type: "success",
            content: "Password reset mail has sent to the entered mail id Successfully!",
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setItems([]),
            id: "message_1"
          }
       
        ])
        navigate("/auth/newpassword"); // Navigate to OTP verification page
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };
  

  return (
    <div style={{ paddingTop:"10vh"}}>
        <Flashbar items={items}></Flashbar>
      <div
        style={{
            paddingTop: "5vh",
            display: "flex",
            justifyContent: "center",
        }}
      >
        <div
          style={{
              padding: "0 15px",
              borderRadius: "10px",
              backgroundColor: "white",
            boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 2,
            width: "28vw",
        }}
        >
          <Container variant="borderless">
            <div
              style={{
                marginBottom: "20px",
                padding: "0 0 0 0",
              }}
            >
              <Header
                variant="h1"
                description="Enter your email to proceed with the password reset."
              >
                <h3
                  style={{
                    fontWeight: "bolder",
                    textShadow: "0px 1px, 1px 0px, 1px 1px",
                    fontSize: "30px",
                  }}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;<b>Forget your password?</b>
                </h3>
              </Header>
            </div>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSendOtp();
              }}
            >
              <FormField label="Email">
                <Input
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.detail.value)}
                />
              </FormField>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "2vh 2vw 0 2vw",
                }}
              >
                <Button fullWidth ariaExpanded variant="primary" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
              {error && (
                <div style={{ color: "red", textAlign: "center" }}>
                  {error.message || "An error occurred"}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button href="" variant="inline-link">
                  Or Login
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

export default BackToLogin;
