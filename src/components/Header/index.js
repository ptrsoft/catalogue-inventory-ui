import React from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import Logo from "../../../src/assets/images/ptrLogo.png"
import { Input } from "@cloudscape-design/components";
import logo from '../../assets/img/logo_PTR 1.png';
const Header = () => {
  return (
    <TopNavigation
    search={
      <Input
        type="search"
        placeholder="Search"
        ariaLabel="Search"
      />
    }
      identity={{
        href: "/app/dashboard",
        title: "Inventory Management",
        logo: {
          src: Logo,
          alt: "Service"
        }
      }}
      utilities={[
        {
          type: "button",
          iconName: "notification",
          title: "Notifications",
          ariaLabel: "Notifications (unread)",
          badge: true,
          disableUtilityCollapse: false
        },
        {
          type: "menu-dropdown",
          iconName: "settings",
          ariaLabel: "Settings",
          title: "Settings",
          items: [
            {
              id: "settings-org",
              text: "Organizational settings"
            },
            {
              id: "settings-project",
              text: "Project settings"
            }
          ]
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
             
                { id: "support", text: "Support" },
                {
                  id: "feedback",
                  text: "Feedback",
                  href: "#",
                  external: true,
                  externalIconAriaLabel:
                    " (opens in new tab)"
                }
              ]
            },
            { id: "signout", text: "Sign out" }
          ]
        }
      ]}
    />
  );
};
export default Header;
