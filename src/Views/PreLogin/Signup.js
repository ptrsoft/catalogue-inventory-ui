import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormField, Input, Container, Header } from "@cloudscape-design/components";
import { signup } from "Redux-Store/signup/signupThunk";// Adjust the path as necessary

const SignUp = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = React.useState([]);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.signup);

  const handleSubmit = () => {
    const params = { name, role, email, password };
    
    dispatch(signup(params))
    .unwrap()
    .then(() => {
        console.log("");
        setEmail("")
        setItems([
          {
            type: "success",
            content: " Successfully!",
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setItems([]),
            id: "message_1"
          }
        ])})
  
    console.log(params);
  };
  

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div style={{ paddingTop: "10vh", display: "flex", justifyContent: "center" }}>
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
                  Sign Up!
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
                  Sign up with your email and password.
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
              <FormField label="Name">
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.detail.value)}
                />
              </FormField>
              <FormField label="Role">
                <Input
                  placeholder="Enter your role"
                  value={role}
                  onChange={(e) => setRole(e.detail.value)}
                />
              </FormField>
              <FormField label="Email Address">
                <Input
                  placeholder="Enter a valid Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.detail.value)}
                />
              </FormField>
              <FormField label="Password">
                <Input
                  placeholder="Enter password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.detail.value)}
                />
              </FormField>
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
                  onClick={handleSubmit}
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Verifying..." : "Verify"}
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

export default SignUp;
