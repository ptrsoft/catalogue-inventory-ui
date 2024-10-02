import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import Toggle from "@cloudscape-design/components/toggle";
import {
  fetchProducts,
  PutToggle,
  deleteProduct,
  fetchInventoryStats
} from "Redux-Store/Products/ProductThunk";
import Tabs from "@cloudscape-design/components/tabs";
import Overview from "./drawerTabs/overview";
import OrderHistory from "./drawerTabs/orderHistory";
import Movement from "./drawerTabs/movement";
import ItemVendor from "./drawerTabs/itemVendor";
import Modal from "@cloudscape-design/components/modal";
import {
  SpaceBetween,
  StatusIndicator,
  Icon,
  ButtonDropdown,
  Select,
  Pagination,
  Flashbar,
  Grid,
} from "@cloudscape-design/components";
import { Link } from "react-router-dom";

const Inventory = () => {
  const [filteringText, setFilteringText] = React.useState("");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [activeTabId, setActiveTabId] = React.useState("first");
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [productToToggle, setProductToToggle] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const products = useSelector((state) => state.products.products);
  const [selectedItems, setSelectedItems] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const inventoryStats = useSelector((state) => state.products.inventoryStats);

  const dispatch = useDispatch();
  const { data = [], status } = products;

  console.log("data", data);

  useEffect(() => {
    dispatch(fetchInventoryStats());
  }, [dispatch]);


  useEffect(() => {
    dispatch(
      fetchProducts({
        category: selectedCategory?.value || "",
        subCategory: selectedSubCategory?.value || "",
        search: filteringText || "",
        active: selectedStatus?.value || "",
      })
    );
      }, [dispatch, selectedCategory, filteringText, selectedStatus,selectedSubCategory ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageKey, setPageKey] = useState(null); // Holds the next page key from API
  const [fetchedPages, setFetchedPages] = useState([]); // Store fetched data for all pages
  const [allFetchedData, setAllFetchedData] = useState([]); // Store all fetched data across pages
  const [pagesCount, setPagesCount] = useState(1); // Initially show only the first page
  const itemsPerPage = 50; // Set items per page to 50

  useEffect(() => {
    if (!fetchedPages[currentPage - 1]) {
      dispatch(fetchProducts({ pageKey, pageSize: itemsPerPage }))
        .unwrap()
        .then((result) => {
          setFetchedPages((prevPages) => {
            const updatedPages = [...prevPages];
            updatedPages[currentPage - 1] = result.data.items; // Store the items for the current page
            return updatedPages;
          });

          setAllFetchedData((prevData) => [...prevData, ...result.data.items]); // Add all new items to allFetchedData

          if (result.data.nextKey) {
            setPageKey(result.data.nextKey); // Store nextKey for future fetches
            setPagesCount((prevCount) => prevCount + 1); // Increment the pages count to show next page
          } else {
            setPageKey(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, [dispatch, currentPage, pageKey, itemsPerPage, fetchedPages]);

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleCategoryChange = ({ detail }) => {
    setSelectedCategory(detail.selectedOption);
  };
  const handleSubCategoryChange = ({ detail }) => {
    setSelectedSubCategory(detail.selectedOption);
  };

  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
  };
  const handleSelectChange = ({ detail }) => {
    setSelectedStatus(detail.selectedOption);
  };

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
    const newStatus = selectedStatus?.value === "true"; // Determine the status based on selectedStatus
    const ids = selectedItems.map((item) => item.id); // Get the IDs of the selected items
    dispatch(PutToggle({ ids, active: newStatus }))
      .unwrap()
      .then((response) => {
        console.log("Update Response:", response); 
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
        // setTimeout(() => {
        //   setItems([]);  // Clear the message after 3 seconds
        // }, 5000);
        dispatch(fetchProducts()); // Fetch updated products
        window.location.reload(); // This will force a full page reload
      })
      .catch((error) => {
        console.error("Error during status change:", error); // Log the full error for debugging
        dispatch(fetchProducts());
        setItems([
          {
            type: "error",
            content: `Failed to change status: ${
              error.message || "Unknown error"
            }`,
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

  const filteredProducts = Array.isArray(data?.items)
    ? data.items.filter((product) =>
        product.name.toLowerCase().includes(filteringText.toLowerCase())
      )
    : [];
  const getStockAlertColor = (stockAlert) => {
    return stockAlert.toLowerCase().includes("low") ? "red" : "#0492C2";
  };
  const ITEMS_PER_PAGE = 50;
  const startIndex = (currentPageIndex - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  // const renderModalButton = () => {
  //   const isAnyProductSelected = selectedItems.length > 0; 

  //   if (selectedStatus?.value === "true") {
  //     return (
  //       <Button
  //         variant="primary"
  //         onClick={() => setIsModalVisible(true)}
  //         disabled={!isAnyProductSelected} 
  //       >
  //         Move to Inactive
  //       </Button>
  //     );
  //   } else if (selectedStatus?.value === "false") {
  //     return (
  //       <Button
  //         variant="primary"
  //         onClick={() => setIsModalVisible(true)}
  //         disabled={!isAnyProductSelected} // Disable button if no product is selected
  //       >
  //         Move to Active
  //       </Button>
  //     );
  //   }
  //   return null;
  // };

  const openModal = (id) => {
    setProductIdToDelete(id); // Set the ID of the product to delete
    setVisible(true);
  };
  const handleConfirmDelete = () => {
    if (productIdToDelete) {
      dispatch(deleteProduct(productIdToDelete))
        .then((response) => {
          console.log("Delete Response:", response);
          if (response.meta.requestStatus === 'fulfilled') {
            // Display success notification
            setItems([
              {
                type: "success",
                content: "Item Deleted Successfully!",
                header: "Deleted Item",
                dismissible: true,
                dismissLabel: "Dismiss message",
                onDismiss: () => setItems([]),
                id: "delete_success",
              },
            ]);
            
            // Automatically clear the notification after 5 seconds
            setTimeout(() => {
              setItems([]); // Clear the message
              window.location.reload(); // Refresh the page
            }, 3000); // 5000 milliseconds = 5 seconds
          }
          setVisible(false); // Close the modal
          setProductIdToDelete(null); // Clear the product ID
        })
        .catch((error) => {
          console.error("Error during deletion:", error); // Log the error for debugging
  
          // Display error notification
          setItems([
            {
              type: "error",
              content: `Failed to delete item: ${
                error.message || "Unknown error"
              }`,
              dismissible: true,
              dismissLabel: "Dismiss message",
              onDismiss: () => setItems([]),
              id: "delete_error",
            },
          ]);
  
          // Automatically clear the error message after 5 seconds
          setTimeout(() => {
            setItems([]); // Clear the message
          }, 5000); // 5000 milliseconds = 5 seconds
  
          setVisible(false); // Close the modal in case of error
          setProductIdToDelete(null); // Clear the product ID
        });
    }
  };

    const handleCancelDelete = () => {
    setVisible(false);
    setProductIdToDelete(null);
  };

  const subcategoryOptions = {
    "Fresh Vegetables": [
      { label: "Daily Vegetables", value: "Daily Vegetables" },
      { label: "Leafy Vegetables", value: "Leafy Vegetables" },
      { label: "Exotic Vegetables", value: "Exotic Vegetables" }
    ],
    "Fresh Fruits": [
      { label: "Daily Fruits", value: "Daily Fruits" },
      { label: "Exotic Fruits", value: "Exotic Fruits" },
      { label: "Dry Fruits", value: "Dry Fruits" }
    ],
    "Dairy": [
      { label: "Milk", value: "Milk" },
      { label: "Butter & Ghee", value: "Butter & Ghee" },
      { label: "Paneer & Khowa", value: "Paneer & Khowa" }
    ],
    "Groceries": [
      { label: "Cooking Oil", value: "Cooking Oil" },
      { label: "Rice", value: "Rice" },
      { label: "Daal", value: "Daal" },
      { label: "Spices", value: "Spices" },
      { label: "Snacks", value: "Snacks" }
    ],
    "Bengali Special": [
      { label: "Bengali Vegetables", value: "Bengali Vegetables" },
      { label: "Bengali Groceries", value: "Bengali Groceries" },
      { label: "Bengali Home Needs", value: "Bengali Home Needs" }
    ],
    "Eggs Meat & Fish": [
      { label: "Eggs", value: "Eggs" },
      { label: "Fish", value: "Fish" },
      { label: "Chicken", value: "Chicken" },
      { label: "Mutton", value: "Mutton" }
    ]
  };


  return (
    <SpaceBetween size="s">
      <Flashbar items={items} />
      <BreadcrumbGroup
        items={[
          { text: "Dashboard", href: "/app/dashboard" },
          { text: "Inventory", href: "/app/inventory" },
          { text: "Items", href: "/app/inventory" },
        ]}
        ariaLabel="Breadcrumbs"
      />
      <Header variant="h1">
        <strong>Items</strong>
      </Header>
      <SpaceBetween size="m">
      <Grid
  gridDefinition={[
    { colspan: { default: 12, xs: 4 } },  
    { colspan: { default: 12, xs: 2 } },
    { colspan: { default: 12, xs: 2 } },
    { colspan: { default: 12, xs: 4 } },
  ]}
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
            onChange={handleCategoryChange}
            options={[
              { label: "All", value: "" },
              {
                label: "Fresh Vegetables",
                value: "Fresh Vegetables",
              },
              {
                label: "Fresh Fruits",
                value: "Fresh Fruits",
              },
              {
                label: "Dairy",
                value: "Dairy",
              },
              {
                label: "Groceries",
                value: "Groceries",
              },
              { label: "Bengali Special", value: "Bengali Special" },
              { label: "Eggs Meat & Fish", value: "Eggs Meat & Fish" },
            ]}
            placeholder="Select Category"
          />
                    <Select
            required
            selectedOption={selectedSubCategory}
            onChange={handleSubCategoryChange}
            placeholder="Select Sub Category"
            options={
                    selectedCategory
                      ? subcategoryOptions[selectedCategory.value] || []
                      : []
                  }
                />
          {/* <Select
            required
            selectedOption={selectedStatus}
            onChange={handleSelectChange}
            options={[
              { label: "All", value: "All" },
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
            placeholder="Select Status"
          /> */}
          <Box float="right">
            <SpaceBetween size="xs" direction="horizontal">
              <Button href="/app/Inventory/addItem">Add Item</Button>
            </SpaceBetween>
          </Box>
        </Grid>
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xs: 3 } },
            { colspan: { default: 12, xs: 3 } },
            { colspan: { default: 12, xs: 3 } },
            { colspan: { default: 12, xs: 3 } },
          ]}
        >
          <Container
            size="xs"
            header={<Header variant="h2">{inventoryStats?.data?.totalProducts}</Header>}
          >
            <b>All Products</b>
          </Container>

          <Container size="xs" header={<Header variant="h2">{inventoryStats?.data?.active}</Header>}>
            <b>Published Stock</b>
          </Container>

          <Container size="xs" header={<Header variant="h2">212</Header>}>
            <b>Low Stock Alert</b>
          </Container>

          <Container size="l" header={<Header variant="h2">223</Header>}>
            <b>Expired</b>
          </Container>
        </Grid>
        <Box float="right">
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {/* {renderModalButton()} */}
            {/* <Modal
              onDismiss={() => setIsModalVisible(false)}
              visible={isModalVisible}
              footer={
                <Box float="right">
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      variant="link"
                      onClick={() => setIsModalVisible(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmToggle}>
                      Ok
                    </Button>
                  </SpaceBetween>
                </Box>
              }
              header="Modal title"
            >
              Are you sure you want to change the status of this products?
            </Modal>{" "} */}
            <Pagination
              currentPageIndex={currentPage}
              onChange={({ detail }) =>
                handlePageChange(detail.currentPageIndex)
              }
              pagesCount={pagesCount} 
            />

          </div>
        </Box>
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
        <Modal
          onDismiss={() => setVisible(false)}
          visible={visible}
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link" onClick={handleCancelDelete}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirmDelete}>
                  Confirm
                </Button>
              </SpaceBetween>
            </Box>
          }
          header="Delete Product"
        >
          Are you sure You want to delete this product?
        </Modal>
        <Table
          renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
          }
          
          onSelectionChange={({ detail }) =>
            setSelectedItems(detail.selectedItems)
          }
          selectedItems={selectedItems}
          ariaLabels={{
            selectionGroupLabel: "Items selection",
            allItemsSelectionLabel: () => "select all",
            itemSelectionLabel: ({ selectedItems }, item) => item.name,
          }}
          variant="borderless"
          columnDefinitions={[
            {
              id: "itemCode",
              header: "Item Code",
              cell: (e) => `#${e.itemCode}`,
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
                    src={e.image}
                    alt={e.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "0.5rem",
                    }}
                  />
                  {e.name}
                </div>
              ),
              width: 250,
              minWidth: 180,
            },
            {
              id: "category",
              header: "Category",
              cell: (e) => e.category,
            },
            {
              id: "subCategory",
              header: "Sub Category",
              cell: (e) => e.subCategory,
            },

            {
              id: "quantityOnHand",
              header: "Quantity on Hand",
              cell: (e) => `${e.stockQuantity} kgs`,
            },
            {
              id: "stockAlert",
              header: "Stock Alert",
              cell: (e) => (
                <span style={{ color: getStockAlertColor("Available") }}>
                  Available
                </span>
              ),
            },
            {
              id: "purchasingPrice",
              header: "Purchasing Price",
              cell: (e) => `Rs. ${e.purchasingPrice}`, 
            },
            {
              id: "msp",
              header: "MSP",
              cell: (e) => `Rs. ${e.msp}`, 
            },
            // {
            //   id: "status",
            //   header: "Status",
            //   cell: (e) => (
            //     <div style={{ display: "flex", width: "100px" }}>
            //       <Toggle
            //         onChange={() => handleToggleClick(e)}
            //         checked={e.active}
            //       >
            //         {e.active ? "Active" : "Inactive"}
            //       </Toggle>
            //       <span
            //         style={{
            //           marginLeft: "10px",
            //           color: e.status === "Inactive" ? "gray" : "black",
            //         }}
            //       ></span>
            //     </div>
            //   ),
            // },
            {
              id: "action",
              header: "Action",
              cell: (e) => (
                <div>
                  <Link to={`/app/inventory/edit?id=${e.id}`}>
                    <Button iconName="edit" variant="inline-link" />
                  </Link>
                  <Button
                    iconName="remove"
                    variant="icon"
                    onClick={() => openModal(e.id)}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          enableKeyboardNavigation
          items={data?.data?.items}
          selectionType="multi"
          trackBy="itemCode"
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No Products</b>
              </SpaceBetween>
            </Box>
          }
        />{" "}
      </SpaceBetween>
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
            <div class="drawer">
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
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
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
    </SpaceBetween>
  );
};

export default Inventory;
