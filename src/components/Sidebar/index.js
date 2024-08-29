
import { SideNavigation } from "@cloudscape-design/components";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { type: "link", text: "Dashboard", href: "/app/dashboard" },
    { type: "link", text: "Orders", href: "/app/search" },
    {
      type: "section",
      text: "Inventory",
      items: [
        {
          type: "link",
          text: "Items",
          href: "/app/inventory"
        },
        {
          type: "link",
          text: "Item Collection",
          href: "#/page5"
        },
        {
          type: "link",
          text: "Transfer",
          href: "#/page6"
        },
        {
          type: "link",
          text: "Inventory Adjustments",
          href: "/app/inventory/adjustments"
        }
      ]
    },
    { type: "link", text: "Purchase Order", href: "/app/inventory/purchase-order" },
    { type: "link", text: "Reports", href: "#" },
    { type: "divider" },
    { type: "link", text: "Settings", href: "#" },
    {
      type: "link",
      text: "Support",
      href: "https://example.com",
      external: true
    }

  ];

  const handleNavigation = (event) => {
    if (!event.detail.external) {
      event.preventDefault();
      navigate(event.detail.href);
    }
  };

  return (
    <SideNavigation
      activeHref={location.pathname}
      header={{ href: "#/", text: "PTR Technologies" }}
      onFollow={handleNavigation}
      items={items.map(item => {
        if (item.type === 'link') {
          return {
            ...item,
            text: (
              <span style={{
                color: location.pathname === item.href ? 'blue' : 'black',
                fontWeight: location.pathname === item.href ? 'bold' : 'normal'
              }}>
                {item.text}
              </span>
            )
          };
        }
        return item;
      })}
    />
  );
};

export default Sidebar;
