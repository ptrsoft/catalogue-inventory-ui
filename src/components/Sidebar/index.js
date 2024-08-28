import React from "react";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Home from "../../assets/img/icons/home.png";
import HomeActive from "../../assets/img/icons/home-active.png";


import { useLocation, useNavigate } from "react-router-dom";

const pages = [
  {
    path: "/app/dashboard",
    label: "Dashboard",
    icon: Home,
    iconActive: HomeActive,
  },
  {
    path: "/app/inventory",
    label: "Inventory",
    children: [
      {
        path: "/app/inventory",
        label: "Items",
      },
      {
        path: "*",
        label: "Item Groups",
      },
      {
        path: "/app/inventory/inventoryAdjustments",
        label: "inventory Adjustments",
      },
      {
        path: "*",
        label: "Transfer",
      },
    ],
  },
  {
    path: "/app/purchaseorders",
    label: "Purchase",
  },
  {
    path: "/app/customers",
    label: "Orders",
  },
  {
    path: "/app/customers",
    label: "Fulfillment",

  },
];

const bottomPages = [
  {
    type: "link",
    text: "Setttings",
    href: "#/notifications",
  },
  {
    type: "link",
    text: "Documentation",
    href: "https://example.com",
    external: true,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeHref, setActiveHref] = React.useState(location.pathname);

  const handleFollow = (event) => {
    const { href, external } = event.detail;
    if (!external) {
      event.preventDefault();
      setActiveHref(href);
      navigate(href);
    }
    // Handle external link behavior here, if necessary
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <SideNavigation
        activeHref={activeHref}
        header={{ href: "/app/dashboard", text: "PTR Technologies" }}
        onFollow={handleFollow}
        items={[
          ...pages.map((page) => ({
            type: page.children ? "expandable-link-group" : "link",
            text: page.label === "Add more" ? (
              <span style={{ color: "black", fontWeight: "bold" }}>{page.label}</span>
            ) : (
              page.label
            ),
            href: page.path,
            items: page.children
              ? page.children.map((child) => ({
                  type: "link",
                  text: child.label,
                  href: child.path,
                }))
              : [],
          })),
          { type: "divider" },
          ...bottomPages.map((page) => ({
            type: "link",
            text: page.text,
            href: page.href,
            info: page.info,
            external: page.external, // Pass external flag to distinguish external links
          })),
        ]}
      />
    </div>
  );
};

export default Sidebar;
