import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import Logo from "../../../src/assets/images/ptrLogo.png";
import { Button, Input } from "@cloudscape-design/components";
import { authSignOut } from "Redux-Store/authenticate/signout/signoutThunk";

const Header = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log(userData)
    // Retrieve and parse user data from localStorage
    const handleSignOut = () => {
      const userData = localStorage.getItem("user");
  
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        dispatch(authSignOut(parsedUserData.token)) // Assuming the token is in parsedUserData.token
          .unwrap()
          .then(() => {
            console.log("Sign-out successful");
            localStorage.removeItem("user");
          })
          .catch(error => {
            console.error("Sign-out failed:", error);
          });
      }
    };
  // }, [dispatch]); // Empty dependency array ensures this runs only once on mount

  return (
    <TopNavigation
      search={<Input type="search" placeholder="Search" ariaLabel="Search" />}
      identity={{
        href: "/app/dashboard",
        title: "Inventory Management",
        logo: {
          src: Logo,
          alt: "Service",
        },
      }}
      utilities={[
        {
          type: "button",
          iconName: "notification",
          title: "Notifications",
          ariaLabel: "Notifications (unread)",
          badge: true,
          disableUtilityCollapse: false,
        },
        {
          type: "menu-dropdown",
          iconName: "settings",
          ariaLabel: "Settings",
          title: "Settings",
          items: [
            {
              id: "settings-org",
              text: "Organizational settings",
            },
            {
              id: "settings-project",
              text: "Project settings",
            },
          ],
        },
        {
          type: "menu-dropdown",
          text: "Salman Batuwah",
          description: "salmanbinmoosaptr@gmail.com",
          iconName: "user-profile",
          items: [
            { id: "profile", text: "Profile" },
            { id: "preferences", text: "Preferences" },
            { id: "security", text: "Security" },
            {
              id: "support-group",
              text: "Support",
              items: [
<<<<<<< HEAD
                {
                  id: "documentation",
                  text: "Documentation",
                  href: "#",
                  external: true,
                  externalIconAriaLabel: " (opens in new tab)",
                },
=======
             
>>>>>>> 01ec1ddb3f171ac6de3fc0d6d4b4a9bfc0a82952
                { id: "support", text: "Support" },
                {
                  id: "feedback",
                  text: "Feedback",
                  href: "#",
                  external: true,
                  externalIconAriaLabel: " (opens in new tab)",
                },
              ],
            },
            
              { 
          type: "button",
                id: "signout", text: "Sign out", onClick: handleSignOut }, // Added onClick handler
            ],
        },
      ]}
    />
  );
};

export default Header;
