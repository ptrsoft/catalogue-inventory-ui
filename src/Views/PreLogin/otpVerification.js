import React, { useState } from "react";
import {
  Button,
  FormField,
  Input,
  Container,
  Header,
} from "@cloudscape-design/components";
import { useDispatch } from "react-redux";
import { setOtp } from "Redux-Store/authenticate/otpVerify/otpVerifySlice";
import { useNavigate } from "react-router-dom"; // or `useNavigate` if using react-router v6

const OtpVerification = () => {
  const [otp, setOtpState] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOtpVerification = () => {
    dispatch(setOtp(otp));
    // Perform OTP verification logic here
    navigate("/auth/newpassword"); // Redirect to the new password page after OTP is verified
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh"}}>
      <div
        style={{
          paddingTop: "10vh",
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
            zIndex: 2, // Ensures form is above the curve
            width:"26vw"
          }}
        >
          <Container variant="borderless">
            <div
              style={{
                marginBottom: "20px",
                padding: "0 0 0 0",
              }}
            >
              <Header variant="h1">
                <div style={{textShadow :"0px 1px, 1px 0px, 1px 1px",display:"flex",justifyContent:"center"}}>Enter Your OTP</div>
                <span style={{fontSize:"small",color:"#8B8D97",fontWeight:"lighter",display:"flex",justifyContent:"center"}}>
                  Enter your <b style={{color:"#539FE5"}}>&nbsp;six-digit code &nbsp;</b> sent to you to reset password.
                </span>
              </Header>
            </div>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
              onSubmit={(e) => {
                e.preventDefault();
                handleOtpVerification();
              }}
            >
              <FormField label="Enter OTP">
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtpState(e.detail.value)}
                  maxLength={6}

                />
              </FormField>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "2vh 2vw 0 2vw",
                }}
              >
                <Button fullWidth ariaExpanded variant="primary">
                  Verify
                </Button>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button href="#" variant="inline-link">
                  Logout
                </Button>
              </div>
            </form>
          </Container>
        </div>
      </div>

      {/* Bottom Curve with Gradient */}
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <svg
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#f5a623", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#bf61ff", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            fill="url(#gradient)"
            fillOpacity="1"
            d="M9,160L998,186.7C96,213,192,267,288,277.3C384,288,480,256,576,224C672,192,768,160,864,149.3C960,139,1056,149,1152,160C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,390,576,320C480,320,384,320,298,320C199,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default OtpVerification;
