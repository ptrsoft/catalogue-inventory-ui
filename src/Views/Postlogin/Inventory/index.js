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
import { fetchProducts, PutToggle } from "Redux-Store/Products/ProductThunk"; // Import the fetchProducts thunk
import Tabs from "@cloudscape-design/components/tabs";
import Overview from "./drawerTabs/overview";
import OrderHistory from "./drawerTabs/orderHistory";
import Movement from "./drawerTabs/movement";
import ItemVendor from "./drawerTabs/itemVendor";
import Modal from "@cloudscape-design/components/modal";
import {
  SpaceBetween,
  StatusIndicator,
  ButtonDropdown,
  Select,
  Pagination,
  Flashbar,
  FormField,
} from "@cloudscape-design/components";
const Inventory = () => {
  const [filteringText, setFilteringText] = React.useState("");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const [activeTabId, setActiveTabId] = React.useState("first");
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [productToToggle, setProductToToggle] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedStatus, setSelectedStatus] = React.useState(null);

  // Fetch products data from Redux store

  const products = useSelector((state) => state.products.products);

  const dispatch = useDispatch();
  const { data = [], status } = products;
  console.log("data", data);
  // const key = data.nextKey;
  // console.log("key", key);
  // Fetch products when component mounts

  useEffect(() => {
    dispatch(
      fetchProducts({
        category: selectedCategory?.value || "",
        search: filteringText || "",
        active: selectedStatus?.value || "",
      })
    );
  }, [dispatch, selectedCategory, filteringText, selectedStatus]);

  const handleCategoryChange = ({ detail }) => {
    setSelectedCategory(detail.selectedOption);
  };
  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
  };
  const handleSelectChange = ({ detail }) => {
    setSelectedStatus(detail.selectedOption);
  };

  // Check if products is an array and has elements

  // const handleCategory =({ detail })=>{
  //   setSelectedCategory(detail.filteringText);
  //   dispatch(fetchProducts({ category: detail.filteringText }))
  //   .unwrap()
  //   .then(() => {
  //     console.log("fetch successful");
  //   })
  //   .catch(() => {
  //     console.log("fetch failed");
  //   });
  // }
  // const handleSearchChange = ({ detail }) => {
  //   setFilteringText(detail.filteringText);

  //   // Dispatch the fetchProducts thunk with the search parameter
  //   dispatch(fetchProducts({ search: detail.filteringText }))
  //     .unwrap()
  //     .then(() => {
  //       console.log("Search successful");
  //     })
  //     .catch(() => {
  //       console.log("Search failed");
  //     });
  // };

  if (status === "LOADING") {
    return (
      <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
        <Header>Loading...</Header>
      </Box>
    );
  }
  const handleToggleClick = (product) => {
    setProductToToggle(product);
    setIsModalVisible(true);
  };
  const handleConfirmToggle = () => {
    const newStatus = !productToToggle.active;
    dispatch(PutToggle({ id: productToToggle.id, active: newStatus }))
      .unwrap()
      .then(() => {
        // If the API call is successful, show the success message and navigate to the dashboard
        setItems([
          {
            type: "success",
            content: "Status changed successfully!",
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setItems([]),
            id: "message_1",
          },
        ]);
        setIsModalVisible(false);
        dispatch(fetchProducts());
      })
      .catch((error) => {
        // Handle any errors, if needed
        dispatch(fetchProducts());
        setItems([
          {
            type: "error",
            content: `Failed to change status`,
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setItems([]),
            id: "message_2",
          },
        ]);
      });
  };

  const handleCancelToggle = () => {
    setIsModalVisible(false);
    setProductToToggle(null);
  };
  if (status === "ERROR") {
    return (
      <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
        <Header>Error fetching data</Header>
      </Box>
    );
  }

  // Filter products based on the filteringText
  const filteredProducts = Array.isArray(data?.items)
    ? data.items.filter((product) =>
        product.name.toLowerCase().includes(filteringText.toLowerCase())
      )
    : [];
  // Determine the color based on the stock alert value
  const getStockAlertColor = (stockAlert) => {
    return stockAlert.toLowerCase().includes("low") ? "red" : "#0492C2";
  };
  const ITEMS_PER_PAGE = 10;
  // Calculate the items for the current page
  const startIndex = (currentPageIndex - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
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
      <Flashbar items={items} />
      <div className="flex flex-col gap-3">
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Inventory", href: "/app/inventory" },
            { text: "Items", href: "/app/inventory" },
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
            gridTemplateColumns: "auto auto auto 1fr auto auto",
            gap: "10px",
            alignItems: "center",
            marginTop: "12px",
          }}
        >
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Search"
            filteringAriaLabel="Filter instances"
            onChange={handleSearchChange}
          />
          <Select
            required
            selectedOption={selectedCategory}
            // onChange={({ detail }) =>
            //   setSelectedCategory(detail.selectedOption)
            // }
            onChange={handleCategoryChange}
            options={[
              { label: "All", value: "" },
              { label: "FRUITS AND VEGETABLES", value: "Fruits And Vegetables" },
              { label: "DAIRIES AND GROCERIES", value: "Dairies And Groceries" },
              { label: "BENGALI SPECIAL", value: "Bengali Special" },
              { label: "MEAT/FISH/EGGS", value: "Meat/Fish/Eggs" },
            ]}
            placeholder="Select Category"
          />
          <Select
            required
            selectedOption={selectedStatus}
            // onChange={({ detail }) =>
            //   setSelectedCategory(detail.selectedOption)
            // }
            onChange={handleSelectChange}
            options={[
              { label: "All", value: "All" },
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
            placeholder="Select Status"
          />
          <div style={{ flexGrow: 1 }}></div>
          <Button href="/app/Inventory/addItem">Add Item</Button>
          {/* <Button iconName="add-plus" variant="primary">
            Reorder
          </Button> */}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
            marginTop: "20px",
            alignItems: "end",
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
              header={<Header variant="h2">{data.count}</Header>}
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
          {isModalVisible && (
            <Modal
              onDismiss={handleCancelToggle}
              visible={isModalVisible}
              closeAriaLabel="Close modal"
              header="Change Status"
              footer={
                <SpaceBetween direction="horizontal" size="s">
                  <Button onClick={handleCancelToggle}>Cancel</Button>
                  <Button variant="primary" onClick={handleConfirmToggle}>
                    Ok
                  </Button>
                </SpaceBetween>
              }
            >
              Are you sure you want to change the status of this product?
            </Modal>
          )}
          <div style={{}}>
            <Pagination
              currentPageIndex={currentPageIndex}
              onChange={({ detail }) =>
                setCurrentPageIndex(detail.currentPageIndex)
              }
              pagesCount={5}
            />
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
                    src={e.images[0]}
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
            {
              sortingField: "stockAlert",
              id: "stockAlert",
              header: "Stock Alert",
              cell: (e) => (
                <span style={{ color: getStockAlertColor("Available") }}>
                  "Available"
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
                <div style={{ display: "flex", width:"100px" }}>
                  <Toggle
                    onChange={() => handleToggleClick(e)}
                    checked={e.active}
                  >
                    {e.active ? "Active" : "Inactive"}
                  </Toggle>
                  <span
                    style={{
                      marginLeft: "10px",
                      color: e.status === "Inactive" ? "gray" : "black",
                    }}
                  ></span>
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
          items={paginatedProducts}
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
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button
                iconName="close"
                variant="icon"
                onClick={handleCloseDrawer}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1 style={{ color: "#0972D3" }}>
                {selectedProduct.name}
                <br />
                <p
                  style={{
                    color: "black",
                    fontSize: "large",
                    paddingTop: "15px",
                  }}
                >
                  Stock : {selectedProduct.stockQuantity}Kg &nbsp;&nbsp;
                  <h7 style={{ fontSize: "10px" }}>
                    {selectedProduct.stockAlert === "Low Stock" ? (
                      <StatusIndicator type="warning" size="small">
                        {selectedProduct.stockAlert}
                      </StatusIndicator>
                    ) : (
                      <span style={{ fontSize: "medium", color: "#0972D3" }}>
                        {selectedProduct.stockAlert}
                      </span>
                    )}
                  </h7>{" "}
                </p>
              </h1>

              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Toggle
                  onChange={() => handleToggleClick(selectedProduct)}
                  checked={selectedProduct.active}
                  style={{
                    marginRight: "10px",
                    marginLeft: "10px",
                    color:
                      selectedProduct.status === "Inactive" ? "gray" : "black",
                  }}
                >
                  {selectedProduct.active ? "Active" : "Inactive"}
                </Toggle>
                <ButtonDropdown
                  items={[
                    {
                      text: "Reorder",
                      id: "reorder",
                    },
                    {
                      text: "Transfer Item",
                      id: "transferItem",
                    },
                    {
                      text: "Clone Item",
                      id: "cloneItem",
                    },
                    {
                      text: "Delete Item",
                      id: "deleteItem",
                    },
                  ]}
                  variant="primary"
                >
                  Action
                </ButtonDropdown>
              </div>
            </div>

            <Tabs
              onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
              activeTabId={activeTabId}
              tabs={[
                {
                  label: "Overview",
                  id: "first",
                  content: <Overview selectedProduct={selectedProduct} />,
                },
                {
                  label: "Order History",
                  id: "second",
                  content: <OrderHistory />,
                },
                {
                  label: "Movement History",
                  id: "third",
                  content: <Movement />,
                },
                {
                  label: "Item-Vendor",
                  id: "fourth",
                  content: <ItemVendor />,
                },
              ]}
            />
          </Box>
        </div>
      )}
    </div>
  );
};

export default Inventory;
