import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import { Input } from "@cloudscape-design/components";
import logo from '../../assets/images/PTR Svg logo.svg';
import { authSignOut } from "Redux-Store/authenticate/signout/signoutThunk";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "context/Authcontext"; // Import useAuth


const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout from Auth context
  const userEmail = localStorage.getItem("userEmail");

  const handleSignOut1 = (item) => {
    if (item.detail.id === "signout") {
      handleSignOut();
    }
  };

  const handleSignOut = () => {
    const userData = localStorage.getItem("user");
  
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.accessToken;
  
      if (token) {
        dispatch(authSignOut({ accessToken: token }))
          .unwrap()
          .then((response) => {
            console.log("Sign-out Response:", response);
            localStorage.clear();
            logout(); // Only call the context logout here
            navigate("/auth/signin");
          })
          .catch((error) => {
            console.error("Sign-out failed:", error);
            if (error.message === "Access Token has expired" || error.name === "NotAuthorizedException") {
              console.log("Access token expired, signing out user automatically...");
              localStorage.clear();  // Clear user data
              logout();  // Call context logout
              navigate("/auth/signin");  // Redirect to sign-in
            }
    
          });
      } else {
        // If there's no token, just logout
        logout(); // Only call the context logout here
        navigate("/auth/signin");
      }
    } else {
      // If there's no user data, just logout
      logout(); // Only call the context logout here
      navigate("/auth/signin");
    }
  };
  

  useEffect(() => {
    const checkTokenExpiration = () => {
      const userData = localStorage.getItem("user");

      if (userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          const token = parsedUserData.accessToken;

          if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;  

            if (decodedToken.exp < currentTime) {
              handleSignOut();  // Token is expired, sign out the user
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    checkTokenExpiration();  
  }, []);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 1000, background: "#fff" }}>
      <TopNavigation
        search={<Input type="search" placeholder="Search" ariaLabel="Search" />}
        identity={{
          href: "/app/dashboard",
          title: "Inventory",
          logo: {
            src: logo,
            alt: "Service",
          },
        }}
        utilities={[
          {
            type: "menu-dropdown",
            text: "User",
            description: userEmail,
            iconName: "user-profile",
            items: [
              { id: "profile", text: "Profile" },
              {
                variant: "primary-button",
                id: "signout",
                text: "Sign out",
              },
            ],
            onItemClick: handleSignOut1,
          },
        ]}
      />
    </div>
  );
};

export default Header;