

import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import Logo from "../../../src/assets/images/ptrLogo.png";
import { Button, Input, SpaceBetween, Modal,Box} from "@cloudscape-design/components";
import { authSignOut } from "Redux-Store/authenticate/signout/signoutThunk";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log("token",userData)
  const handleSignOut1 = (item) => {
    // Check if the clicked item is the sign-out option
    if (item.detail.id === "signout") {
      handleSignOut();
    }
  };
  const handleSignOut = () => {

    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log("parsed", parsedUserData.accessToken);
        const token = parsedUserData.accessToken;

        if (token) {
          dispatch(authSignOut({ accessToken: token })) // Pass the token in the expected format
            .unwrap()
            .then((response) => {
         
              console.log("Sign-out Response:", response);
              localStorage.removeItem("user");
              localStorage.removeItem("email");
              navigate("/auth/signin")
            })
            .catch((error) => {
              console.error("Sign-out failed:", error);
            });

        } else {
          console.error("No access token found in user data.");
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    } else {
      console.warn("No user data found.");
    }
  };

  return (
    <>
     
   
    <div style={{ position: "sticky", top: 0, zIndex: 1000, background: "#fff" }}>
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
          // {
          //   type: "button",
          //   iconName: "notification",
          //   title: "Notifications",
          //   ariaLabel: "Notifications (unread)",
          //   badge: true,
          //   disableUtilityCollapse: false,
          // },
          // {
          //   type: "menu-dropdown",
          //   iconName: "settings",
          //   ariaLabel: "Settings",
          //   title: "Settings",
          //   items: [
          //     {
          //       id: "settings-org",
          //       text: "Organizational settings",
          //     },
          //     {
          //       id: "settings-project",
          //       text: "Project settings",
          //     },
          //   ],
          // },
          {
            type: "menu-dropdown",
            text: "Salman Batuwah",
            description: "salmanbinmoosaptr@gmail.com",
            iconName: "user-profile",
            items: [
              { id: "profile", text: "Profile" },
              // { id: "preferences", text: "Preferences" },
              // { id: "security", text: "Security" },
              // {
              //   id: "support-group",
              //   text: "Support",
                // items: [
                //   {
                //     id: "documentation",
                //     text: "Documentation",
                //     href: "#",
                //     external: true,
                //     externalIconAriaLabel: " (opens in new tab)",
                //   },

                //   { id: "support", text: "Support" },
                //   {
                //     id: "feedback",
                //     text: "Feedback",
                //     href: "#",
                //     external: true,
                //     externalIconAriaLabel: " (opens in new tab)",
                //   },
                // ],
              // },

              {
                variant:"primary-button",
                id: "signout",
                text: "Sign out",
               
              }, 
            ],
            onItemClick: handleSignOut1, 
          },
        ]}
      />
    </div>
    </>
  );
};

export default Header;
