import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Views from "./Views/index";
import Sidebar from "components/Sidebar";
import { AppLayout } from "@cloudscape-design/components";
import PTRLogo from "../src/assets/img/PTRLogo.png";
import Signin from "Views/PreLogin/Signin";
import { Navigate } from "react-router-dom";
function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith("/auth");

  return (
    <>
      {isAuthRoute && (
        <>
          <img 
            src={PTRLogo} // Replace with your image path or URL
            alt="Auth Route Logo"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              width: "180px", // Adjust size as needed
              height: "auto",
              zIndex: 10
            }}
          />
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
              <path 
                fill="url(#gradient)" 
                fillOpacity="0.98" 
                d="M0,160L60,176C120,192,240,224,360,213.3C480,203,600,149,720,117.3C840,85,960,75,1080,85.3C1200,96,1320,128,1380,144L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              ></path>
            </svg>
          </div>
        </>
      )}
      {!isAuthRoute && <Header />} {/* Header is placed outside the AppLayout */}
      <AppLayout
        headerSelector="#header"
        headerVariant="high-contrast"
        navigation={!isAuthRoute && <Sidebar />}
        toolsHide={true}
        navigationHide={isAuthRoute}
        navigationWidth={250}
        content={<MainContent />}
      />
    </>
  );
}

function MainContent() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/signin" />} />
      <Route path="*" element={<Views />} />
    </Routes>
  );
}

export default App;
