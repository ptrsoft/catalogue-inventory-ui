import { SideNavigation } from "@cloudscape-design/components";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../../assets/images/PTR Svg logo.svg';
import { useMediaQuery } from 'react-responsive';


const Sidebar = () => {
  
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { type: "link", text: "Dashboard", href: "/app/dashboard" },

    {
      type: "section",
      text: "Logistics",
      items: [
        {
          type: "link",
          text: "Orders",
          href: "/app/Logistics/orders"
        },
        {
          type: "link",
          text: "Runsheet",
          href: "/app/Logistics/runsheet"
        },
        {
          type: "link",
          text: "Rider Summary",
          href: "/app/Logistics/RiderSummary"
        },
        {
          type: "link",
          text: "Cash Collection",
          href: "/app/Logistics/CollectionPayment"
        }
      ]
    },
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
          text: "Inventory Adjustments",
          href: "/app/inventory/adjustments"
        },
        {
          type: "link",
          text: "Pincodes",
          href: "/app/inventory/pincodes"
        }
      ]
    },
    // { type: "link", text: "Purchase Order", href: "/app/inventory/purchase-order" },
    // { type: "link", text: "Reports", href: "#" },
    { type: "divider" },
    { type: "link", text: "Settings", href: "/app/settings" },
    // {
    //   type: "link",
    //   text: "Support",
    //   href: "https://example.com",
    //   external: true
    // }

  ];

      const handleNavigation = (event) => {
        if (!event.detail.external) {
          event.preventDefault();
          navigate(event.detail.href);
        }
      };

  const handleNavigation1 = (event) => {
console.log("hiii");
  };
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


  return (
    <SideNavigation 
    onChange={handleNavigation1}
      activeHref={location.pathname}
      header={{ href: "/", text:
        <div style={{display:'flex',alignItems:'center',gap:'2px', marginTop:isMobile?'-5px':'0px'}}>
          {isMobile&&(
          <img style={{marginLeft:'18px'}} width={40} height={40}alt="logo" src={logo}></img>
          )}
          <h3 style={{marginLeft:'18px'}}>PTR Technologies
          </h3>
        </div>
         }}
      
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
