import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import Toggle from "@cloudscape-design/components/toggle";
import { toggleStatus } from "Redux-Store/Products/ProductsSlice";
import { fetchProducts } from "Redux-Store/Products/ProductThunk"; // Import the fetchProducts thunk
import Tabs from "@cloudscape-design/components/tabs";
import Overview from "./drawerTabs/overview";
import OrderHistory from "./drawerTabs/orderHistory";
import Movement from "./drawerTabs/movement";
import ItemVendor from "./drawerTabs/itemVendor";
import { Drawer } from "@cloudscape-design/components";

const Inventory = () => {
  const [filteringText, setFilteringText] = React.useState("");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  // const [checked, setChecked] = React.useState(false);
  const [activeTabId, setActiveTabId] = React.useState("first");
  
  const products = useSelector((state) => state.products.products);
   const dispatch = useDispatch();
console.log("pro",products)
const { data = [], status } = products;
console.log("data",data)
  // Fetch products when component mounts
  useEffect(() => {
    dispatch(fetchProducts()
  );
  }, [dispatch]);

  // Check if products is an array and has elements
  if (status === "LOADING") {
    return (
      <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
        <Header>Loading...</Header>
      </Box>
    );
  }

  if (status === "ERROR") {
    return (
      <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
        <Header>Error fetching data</Header>
      </Box>
    );
  }

  // const filteredProducts = products.data && products.data.length > 0
  // ? products.data.filter((product) =>
  //     product.name.toLowerCase().includes(filteringText.toLowerCase())
  //   )
  // : [];
  // console.log("filtered",filteredProducts)
  
  // // Determine the color based on the stock alert value
  // const getStockAlertColor = (stockAlert) => {
  //   return stockAlert.toLowerCase().includes("low") ? "red" : "#0492C2";
  // };

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
            { text: "Dashboard", href: "#" },
            { text: "Inventory", href: "#components" },
          ]}
          ariaLabel="Breadcrumbs"
        />

        <div style={{ marginTop: "12px", fontWeight: "900", fontSize: "36px" }}>
          <Header variant="h1">
            <strong>Inventory</strong>
          </Header>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: "10px",
            alignItems: "center",
            marginTop: "12px",
          }}
        >
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Search"
            filteringAriaLabel="Filter instances"
            onChange={({ detail }) => setFilteringText(detail.filteringText)}
          />
          <Button href="/app/Inventory/addItem">Add Item</Button>
          <Button iconName="add-plus" variant="primary">
            Reorder
          </Button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "15px",
            }}
          >
            <Container
              variant="borderless"
              size="xs"
              header={<Header variant="h2">1921</Header>}
            >
              <b>All Products</b>
            </Container>
          </div>
          <div
            style={{
              boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "15px",
            }}
          >
            <Container
              variant="borderless"
              size="xs"
              header={<Header variant="h2">421</Header>}
            >
              <b>Published Stock</b>
            </Container>
          </div>
          <div
            style={{
              boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "15px",
            }}
          >
            <Container
              variant="borderless"
              size="xs"
              header={<Header variant="h2">212</Header>}
            >
              <b>Low Stock Alert</b>
            </Container>
          </div>
          <div
            style={{
              boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "15px",
            }}
          >
            <Container
              variant="borderless"
              size="xs"
              header={<Header variant="h2">223</Header>}
            >
              <b>Expired</b>
            </Container>
          </div>
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
                    src={e.images}
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
              cell: (e) => e.stockQuantity,
            },
            // {
            //   sortingField: "stockAlert",
            //   id: "stockAlert",
            //   header: "Stock Alert",
            //   cell: (e) => (
            //     <span style={{ color: getStockAlertColor(e.stockAlert) }}>
            //       {e.stockAlert}
            //     </span>
            //   ),
            // },
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
          items={data.items} // Display filtered products
          loadingText="Loading resources"
          sortingDisabled
          trackBy="itemCode"
          visibleColumns={[
            "itemCode",
            "name",
            "category",
            "quantityOnHand",
            "stockAlert",
            "purchasingPrice",
            "msp",
            "status",
          ]}
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <b>No Products</b>
              <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                No products found.
              </Box>
            </Box>
          }
          header={
            <Header
              variant="h2"
              description="All the products in the inventory"
            >
              Product Inventory
            </Header>
          }
        />
      </div>

      {/* Drawer for product details */}
      {isDrawerOpen && selectedProduct && (
        <Drawer
          size="medium"
          closeable={true}
          onDismiss={handleCloseDrawer}
          header={
            <Header variant="h2">{selectedProduct.name}</Header>
          }
        >
          <Tabs
            activeTabId={activeTabId}
            onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
            tabs={[
              {
                label: "Overview",
                id: "first",
                content: <Overview product={selectedProduct} />,
              },
              {
                label: "Order History",
                id: "second",
                content: <OrderHistory product={selectedProduct} />,
              },
              {
                label: "Movement",
                id: "third",
                content: <Movement product={selectedProduct} />,
              },
              {
                label: "Item Vendor",
                id: "fourth",
                content: <ItemVendor product={selectedProduct} />,
              },
            ]}
          />
        </Drawer>
      )}
    </div>
  );
};

export default Inventory;
