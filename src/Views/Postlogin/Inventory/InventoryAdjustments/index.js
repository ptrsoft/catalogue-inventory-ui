import React from "react";
import { useSelector, useDispatch } from "react-redux";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Toggle from "@cloudscape-design/components/toggle";
import { toggleStatus } from "Redux-Store/Products/ProductsSlice";
import Tabs from "@cloudscape-design/components/tabs";
import Overview from "../drawerTabs/overview";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import OrderHistory from "../drawerTabs/orderHistory";
import Movement from "../drawerTabs/movement";
import ItemVendor from "../drawerTabs/itemVendor";

const InventoryAdjustments = () => {
  const [filteringText, setFilteringText] = React.useState("");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [activeTabId, setActiveTabId] = React.useState(
    "first"
  );
  // Fetch products data from Redux store
  const products = useSelector((state) => state.products.products.data);
  const dispatch = useDispatch();

  // Check if products is an array and has elements
  if (!Array.isArray(products)) {
    return (
      <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
        <Header>No data available</Header>
      </Box>
    );
  }

  // Filter products based on the filteringText
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filteringText.toLowerCase())
  );
console.log(setFilteringText)
  // Determine the color based on the stock alert value
  const getStockAlertColor = (stockAlert) => {
    return stockAlert.toLowerCase().includes("low") ? "red" : "#0492C2";
  };

  // Open drawer with product details
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  // Close drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="flex-col gap-3">
      <div className="flex flex-col gap-3">
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Inventory", href: "/app/inventory" },
            { text: "Inventory adjustments", href: "/app/inventory adjustments" },
          ]}
          ariaLabel="Breadcrumbs"
        />

        <div style={{ marginTop: "12px", fontWeight: "900", fontSize: "36px" }}>
          <Header variant="h1">
            <strong>Inventory Adjustments</strong>
          </Header>
        </div>
        </div>
      <div style={{ marginTop: "15px" }}>
        <Table
          variant="borderless"
          columnDefinitions={[
            {
              id: "itemCode",
              header: "Item Code",
              cell: (e) => e.itemCode,
              isRowHeader: true,
            },
            {
              id: "name",
              header: "Name",
              cell: (e) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleProductClick(e)}
                >
                  <img
                    src={e.imageUrl}
                    alt={e.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                  />
                  {e.name}
                </div>
              ),
            },
            {
              id: "category",
              sortingField: "category",
              header: "Category",
              cell: (e) => e.category,
            },
            {
              sortingField: "quantityOnHand",
              id: "quantityOnHand",
              header: "Quantity on Hand",
              cell: (e) => e.quantityOnHand,
            },
            {
              sortingField: "stockAlert",
              id: "stockAlert",
              header: "Stock Alert",
              cell: (e) => (
                <span style={{ color: getStockAlertColor(e.stockAlert) }}>
                  {e.stockAlert}
                 
                </span>
              ),
            },
            {
              sortingField: "purchasingPrice",
              id: "purchasingPrice",
              header: "Purchasing Price",
              cell: (e) => e.purchasingPrice,
            },
            {
              sortingField: "msp",
              id: "msp",
              header: "MSP",
              cell: (e) => e.msp,
            },
            {
              sortingField: "status",
              id: "status",
              header: "Status",
              cell: (e) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Toggle
                    onChange={({ detail }) =>
                      dispatch(toggleStatus({ itemCode: e.itemCode }))
                    }
                    checked={e.status === "Active"}
                  />
                  <span
                    style={{
                      marginLeft: "10px",
                      color: e.status === "Inactive" ? "gray" : "black",
                    }}
                  >
                    {e.status === "Inactive" ? "Inactive" : "Active"}
                  </span>
                </div>
              ),
            },
          ]}
          columnDisplay={[
            { id: "itemCode", visible: true },
            { id: "name", visible: true },
            { id: "category", visible: true },
            { id: "quantityOnHand", visible: true },
            { id: "stockAlert", visible: true },
            { id: "purchasingPrice", visible: true },
            { id: "msp", visible: true },
            { id: "status", visible: true },
          ]}
          enableKeyboardNavigation
          items={filteredProducts}
          loadingText="Loading resources"
          trackBy="itemCode"
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No resources</b>
                <Button>Create resource</Button>
              </SpaceBetween>
            </Box>
          }
        />
      </div>
      {isDrawerOpen && selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100%",
            width: "65%",
            backgroundColor: "white",
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            overflowY: "auto",
            color: "red",
          }}
        >
          <Box
            padding={{ left: "m", right: "m", top: "s", bottom: "s" }}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="lightgrey"
          >
            <div style={{display:"flex",justifyContent:"end"}}>
           <Button
          iconName="close"
          variant="icon"
          onClick={handleCloseDrawer}
        /></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1 style={{ color: "#0972D3" }}>{selectedProduct.name}<br /><p style={{color:"black", fontSize:"large",paddingTop:"15px"}}>Stock : {selectedProduct.quantityOnHand}Kg 
                &nbsp;&nbsp;<h7 style={{fontSize:"10px"}}>{selectedProduct.stockAlert === "Low Stock" ? <StatusIndicator type="warning" size="small">{selectedProduct.stockAlert}</StatusIndicator> : <span style={{fontSize:"medium",color:"#0972D3"}}>{selectedProduct.stockAlert}</span>}</h7> </p></h1>
              
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Toggle
                  onChange={({ detail }) => setChecked(detail.checked)}
                  checked={checked}
                  style={{ marginRight: "10px" }}
                >
                  Active
                </Toggle>
                <Button
                size="xs"
                  iconAlign="right"
                  iconName="caret-down-filled"
                  variant="primary"
                >
                  Action
                </Button>
              </div>
            </div>
            
              <Tabs
          
      onChange={({ detail }) =>
        setActiveTabId(detail.activeTabId)
      }
      activeTabId={activeTabId}
      tabs={[
        {
          label: "Overview",
          id: "first",
          content: <Overview selectedProduct={selectedProduct}/>
        },
        {
          label: "Order History",
          id: "second",
          content: <OrderHistory/>
        },
        {
          label: "Movement History",
          id: "third",
          content: <Movement />
        },
        {
          label: "Item-Vendor",
          id: "fourth",
          content: <ItemVendor/>
        }
      ]}
    />
          </Box>
          
        </div>
      )}
    </div>
  );
};

export default InventoryAdjustments;