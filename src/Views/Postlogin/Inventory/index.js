import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import Spinner from "@cloudscape-design/components/spinner";
import { useMediaQuery } from 'react-responsive';
import {
  fetchProducts,
  PutToggle,
  deleteProduct,
  fetchInventoryStats,
  putPricingById,
  exportProducts,
  fetchInventoryCollection,
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
  Select,
  Pagination,
  Flashbar,
  Grid,
  Toggle,
  FormField,
  Input,
  Popover,
  Icon,
} from "@cloudscape-design/components";
import { Link, useLocation } from "react-router-dom";
import ProductPDF from "./components/ProductPDF";

const Inventory = () => {
  const location = useLocation();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const fileInputRef = useRef(null); // Create a reference for the file input
  // Handle Import button click to show the file dialog
  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file dialog
    }
  };
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [flashMessages, setFlashMessages] = useState([]);
  // Show flash messages
  const showFlashMessage = (type, content) => {
    setFlashMessages([
      {
        type,
        content,
        dismissible: true,
        onDismiss: () => setFlashMessages([]),
      },
    ]);
  };
  
  // Check for success state from AddProduct component
  useEffect(() => {
 
    
    if (location.state?.itemAdded) {
      // console.log("Item added successfully, showing flashbar");
      setFlashMessages([
        {
          type: "success",
          header: "Item Added Successfully",
          content: `Item "${location.state.itemName}" has been successfully added to the inventory.`,
          dismissible: true,
          onDismiss: () => setFlashMessages([]),
        },
      ]);
      
      // Auto-dismiss the flashbar after 3 seconds
      setTimeout(() => {
        setFlashMessages([]);
      }, 5000);
      
      // Clear the state after showing the message
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  // Import API handler
  const handleFileImport = (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };

      fetch(
        "https://api.admin.promodeagro.com/inventory/import",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          showFlashMessage("success", "Products File Imported Successfully");
        })
        .catch((error) => {
          console.error("Error during import:", error);
          showFlashMessage("error", "Failed to import the file");
        });
    }
  };

  // Export API handler
  const handleExport = () => {
    dispatch(exportProducts())
      .unwrap()
      .then((data) => {
        if (data.fileUrl) {
          // console.log(data, "export data");
          const link = document.createElement("a");
          link.href = data.fileUrl;
          link.download = data.fileUrl.split("/").pop();
          link.click();
        } else {
          console.error("Failed to export products.");
        }
      })
      .catch((error) => {
        console.error("Error during export:", error);
      });
  };
  // Toggles the visibility of the popover
  const handleButtonClick = () => {
    setIsPopoverOpen((prevState) => !prevState);
  };
  const [isModalVisible1, setModalVisible1] = useState(false);
  const [isBulkModifySuccess, setBulkModifySuccess] = useState(false);
  const [isBulkModifySuccessflash, setBulkModifySuccessflash] = useState(false);
  const [editedProducts, setEditedProducts] = useState({});
  const [isFieldChanged, setIsFieldChanged] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const inventoryStats = useSelector((state) => state.products.inventoryStats);
  const [nextKeys, setNextKeys] = useState({}); // Store nextKey per page
  const [hoveredProductId, setHoveredProductId] = React.useState(null); // State to track hovered product ID
  const [selectedView, setSelectedView] = useState('allProducts'); // Add this new state
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const products = useSelector(
    (state) => state.products.products.data[currentPage] || []
  ); // Access current page data
  const status = useSelector((state) => state.products.products.status);
  const { data = [] } = products;
  const nextKey = useSelector((state) => state.products.products.nextKey);

  const [fetchedPages, setFetchedPages] = useState({}); // Store fetched data per page
  const [pagesCount, setPagesCount] = useState(1); // Keep track of total pages

  // Add function to combine all fetched pages data
  const getCombinedProducts = () => {
    const filterKey = `${selectedCategory?.value || ""}-${
      selectedSubCategory?.value || ""
    }-${filteringText || ""}-${
      selectedStatus?.value === false
        ? "false"
        : selectedStatus?.value === true
        ? "true"
        : ""
    }`;
    
    // Get all pages for current filter
    const allPages = Object.keys(fetchedPages)
      .filter(key => key.startsWith(filterKey))
      .map(key => fetchedPages[key])
      .flat();
    
    return allPages;
  };

  // Add new state for inventory collection
  const inventoryCollection = useSelector((state) => state.products.inventoryCollection);
  const [collectionCurrentPage, setCollectionCurrentPage] = useState(1);
  const [collectionFilteringText, setCollectionFilteringText] = useState("");
  const [isCollectionFetched, setIsCollectionFetched] = useState(false);

  // console.log(inventoryCollection, "inventory collection");
  // console.log("Current Page:", currentPage);

  // Add loading state for item collection
  const [isItemCollectionLoading, setIsItemCollectionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchInventoryStats());
  }, [dispatch]);

  useEffect(() => {
    // Define the pageKey for pagination (undefined for page 1)
    const pageKey = currentPage === 1 ? undefined : nextKeys[currentPage - 1];

    // Create a key to represent the current filters and page
    const filterKey = `${selectedCategory?.value || ""}-${
      selectedSubCategory?.value || ""
    }-${filteringText || ""}-${
      selectedStatus?.value === false
        ? "false"
        : selectedStatus?.value === true
        ? "true"
        : ""
    }-${currentPage}`;

    // Check if the current page with the current filter has already been fetched
    if (!fetchedPages[filterKey]) {
      dispatch(
        fetchProducts({
          category: selectedCategory?.value || "",
          subCategory: selectedSubCategory?.value || "",
          search: filteringText || "",
          active:
            selectedStatus?.value === true
              ? "true"
              : selectedStatus?.value === false
              ? "false"
              : "",
          pageKey, // Only pass the nextKey for pages beyond 1
          // pageSize: 50,
          // Items per page
        })
      )
        .unwrap()
        .then((result) => {
          // console.log("Fetched products for page:", currentPage, result);

          // Adjust to check the correct data structure
          if (Array.isArray(result.data)) {
            // Store fetched items for the current page and filters
            setFetchedPages((prev) => ({
              ...prev,
              [filterKey]: result.data, // Directly using result.data since it's an array
            }));

            // Store the nextKey for future pagination
            if (result.nextKey) {
              setNextKeys((prevKeys) => ({
                ...prevKeys,
                [currentPage]: result.nextKey, // Store nextKey for the current page
              }));

              // Increment the pages count only if there's more data to fetch
              setPagesCount((prevCount) => prevCount + 1);
            }
          } else {
            console.error("Unexpected data structure:", result.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, [
    dispatch,
    currentPage,
    filteringText,
    selectedCategory,
    selectedSubCategory,
    selectedStatus,
    nextKeys,
    fetchedPages,
  ]);

  // Modify handleItemCollectionView to show loading state
  const handleItemCollectionView = () => {
    if (!isCollectionFetched) {
      setIsItemCollectionLoading(true);
      dispatch(fetchInventoryCollection({
        search: collectionFilteringText,
        pageKey: collectionCurrentPage === 1 ? undefined : inventoryCollection.nextKey
      }))
      .finally(() => {
        setIsItemCollectionLoading(false);
        setIsCollectionFetched(true);
      });
    }
    setSelectedView('itemCollection');
  };

  // Handle page changes
  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex); // Update current page
  };

  // Prepare items for the table
  const handleCategoryChange = ({ detail }) => {
    setSelectedCategory(detail.selectedOption);
    setCurrentPage(1); // Reset page to 1 when filters change
  };
  const handleSubCategoryChange = ({ detail }) => {
    setSelectedSubCategory(detail.selectedOption);
    setCurrentPage(1); // Reset page to 1 when filters change
  };

  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
    setCurrentPage(1); // Reset page to 1 when filters change
  };
  const handleSelectChange = ({ detail }) => {
    setSelectedStatus(detail.selectedOption);
    setCurrentPage(1); // Reset page to 1 when filters change

    // console.log(selectedStatus, "status");
  };
  // console.log(selectedStatus?.value, "status");

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
    const newStatus = selectedStatus?.value ? false : true;
    // console.log(newStatus, "new staussess");
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
        setTimeout(() => {
          setItems([]); // Clear the message after 3 seconds
        }, 5000);

        // Fetch updated products
        window.location.reload();
        // This will force a full page reload
      })
      .catch((error) => {
        console.error("Error during status change:", error); // Log the full error for debugging
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
    setCurrentPage(1); // Reset page to 1 when filters change
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

  const getStockAlertColor = (stockAlert) => {
    return stockAlert.toLowerCase().includes("low") ? "red" : "#0492C2";
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  const renderModalButton = () => {
    const isAnyProductSelected = selectedItems.length > 0;

    if (selectedStatus?.value === true) {
      return (
        <Button
          variant="primary"
          onClick={() => setIsModalVisible(true)}
          disabled={!isAnyProductSelected}
        >
          Move to Out Of Stock
        </Button>
      );
    } else if (selectedStatus?.value === false) {
      return (
        <Button
          variant="primary"
          onClick={() => setIsModalVisible(true)}
          disabled={!isAnyProductSelected} // Disable button if no product is selected
        >
          Move to In Stock
        </Button>
      );
    }
    return null;
  };

  const openModal = (id) => {
    setProductIdToDelete(id); // Set the ID of the product to delete
    setVisible(true);
  };
  const handleConfirmDelete = () => {
    if (productIdToDelete) {
      dispatch(deleteProduct(productIdToDelete))
        .then((response) => {
          console.log("Delete Response:", response);
          if (response.meta.requestStatus === "fulfilled") {
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
      { label: "Exotic Vegetables", value: "Exotic Vegetables" },
    ],
    "Fresh Fruits": [
      { label: "Daily Fruits", value: "Daily Fruits" },
      { label: "Exotic Fruits", value: "Exotic Fruits" },
      { label: "Dry Fruits", value: "Dry Fruits" },
    ],
    Dairy: [
      { label: "Milk", value: "Milk" },
      { label: "Butter & Ghee", value: "Butter & Ghee" },
      { label: "Paneer & Khowa", value: "Paneer & Khowa" },
    ],
    Groceries: [
      { label: "Cooking Oil", value: "Cooking Oil" },
      { label: "Rice", value: "Rice" },
      { label: "Daal", value: "Daal" },
      { label: "Spices", value: "Spices" },
      { label: "Snacks", value: "Snacks" },
    ],
    "Bengali Special": [
      { label: "Bengali Vegetables", value: "Bengali Vegetables" },
      { label: "Bengali Groceries", value: "Bengali Groceries" },
      { label: "Bengali Home Needs", value: "Bengali Home Needs" },
    ],
    "Eggs Meat & Fish": [
      { label: "Eggs", value: "Eggs" },
      { label: "Fish", value: "Fish" },
      { label: "Chicken", value: "Chicken" },
      { label: "Mutton", value: "Mutton" },
    ],
  };

  //change price

  const handleInputChange = (id, field, value) => {
    setEditedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));

    // Validate the field
    validateField(id, field, value);

    // Update isFieldChanged based on the input value
    if (value.trim() === "") {
      setIsFieldChanged(true); // Reset to true if the field is empty
    } else {
      setIsFieldChanged(false);
    }
  };

  const validateField = (id, field, value) => {
    const osp = value;
    const cp =
      field === "sellingPrice" ? value : editedProducts[id]?.compareAt || "";
    let errors = {};

    if (field === "purchasePrice" && !osp) {
      errors.onlineStorePrice = "Required!";
    }

    if (field === "sellingPrice") {
      if (!cp) {
        errors.compareAt = "Required!";
      } else if (parseFloat(cp) < parseFloat(osp)) {
        errors.compareAt = "CP must be greater than OSP";
      }
    }

    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: errors,
    }));
  };

  const handleBulkModifyPrice = () => {
    // if (validateInputs()) {
    setModalVisible1(true);
    // }
  };
  const handleModalConfirm = async () => {
    const pricingDataArray = selectedItems.map((item) => ({
      id: item.id,
      sellingPrice: parseFloat(
        editedProducts[item.id]?.sellingPrice || item.sellingPrice
      ),
      purchasingPrice: parseFloat(
        editedProducts[item.id]?.purchasingPrice || item.purchasingPrice
      ),
    }));

    try {
      const response = await dispatch(putPricingById(pricingDataArray));
      // console.log(response, "bulk resp");

      if (response.payload?.message === "success") {
        // console.log("Bulk modify successful", response);
        setItems([
          {
            type: "success",
            content: "Product pricing updated successfully!",
            dismissible: true,
            onDismiss: () => setItems([]),
          },
        ]);
        setSelectedItems([]);
        setModalVisible1(false);
      }
    } catch (err) {
      console.error("Failed to update product pricing:", err);
      setItems([
        {
          type: "error",
          content: "An error occurred while updating pricing.",
          dismissible: true,
          onDismiss: () => setItems([]),
        },
      ]);
      setModalVisible1(false);
    }
    // Automatically remove Flashbar after 3 seconds
    setTimeout(() => {
      setItems([]);
    }, 3000);
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SpaceBetween size="s">
      {/* Flash Message Notifications */}
      {/* {console.log("Rendering component, flashMessages:", flashMessages)} */}
      {flashMessages.length > 0 && (
        <Flashbar 
          items={flashMessages} 
          stackNotifications={true}
        />
      )}
      <Flashbar items={items} />
      <Modal
        visible={isModalVisible1}
        onDismiss={() => setModalVisible1(false)}
        header="Confirm Bulk Modify"
        footer={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => setModalVisible1(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleModalConfirm}>
              Confirm
            </Button>
          </SpaceBetween>
        }
      >
        Are you sure you want to bulk modify the prices for the selected items?
      </Modal>
  <BreadcrumbGroup
              items={[
                { text: "Dashboard", href: "/app/Dashboard" },
                // { text: "Logistics", href: "/app/Dashboard" },
                { text: "Inventory", href: "#" },
              ]}
              ariaLabel="Breadcrumbs"
            />
      <Header 
        variant="h1"
        actions={isMobile ? (
          <SpaceBetween size="xs" direction="horizontal">
            <Button href="/app/Inventory/addItem">Add Item</Button>
            <div>
              <Popover
                onDismiss={() => setIsPopoverOpen(false)}
                position="left"
                align="start"
                size="small"
                wrapTriggerText={false}
                triggerType="custom"
                content={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileImport}
                      accept=".xlsx"
                      style={{ display: "none" }}
                    />
                    <Button
                      variant="inline-link"
                      iconName="upload"
                      onClick={handleImport}
                    >
                      Import
                    </Button>
                    <Button
                      variant="inline-link"
                      iconName="download"
                      onClick={handleExport}
                    >
                      Export
                    </Button>
                    <ProductPDF products={getCombinedProducts()} onDownloadSuccess={() => {
                      showFlashMessage("success", "PDF downloaded successfully");
                      setTimeout(() => {
                        setFlashMessages([]);
                      }, 3000);
                    }}/>
                  </div>
                }
              >
                <Button
                  iconName="ellipsis"
                  onClick={handleButtonClick}
                  ariaLabel="Options menu"
                  variant="icon"
                />
              </Popover>
            </div>
          </SpaceBetween>
        ) : undefined}
      >
        <strong>
        <span style={{textDecoration: "underline", textDecorationColor: "#0972D3", textDecorationThickness: "2px", textUnderlineOffset: "6px"}}>Items</span>

        </strong>
      </Header>
      <SpaceBetween size="m">
        <Grid
          gridDefinition={[
            { colspan: { default: isMobile ? 10 : 12, xxs: isMobile ? 10 : 4 } },
            { colspan: { default: isMobile ? 2 : 12, xxs: isMobile ? 2 : 2 } },
            { colspan: { default: isMobile ? 12 : 12, xxs: isMobile ? 12 : 6 } },
          ]}
        >
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Search"
            filteringAriaLabel="Filter instances"
            onChange={handleSearchChange}
          />
          {/* Filter Toggle */}
          <span
            onClick={toggleFilter}
            style={{
              display: "flex",
              justifyContent: isMobile ? "center" : "space-between",
              alignItems: "center",
              cursor: "pointer",
              border: isMobile ? "2px solid #9BA7B6" : "3px solid #9BA7B6",
              padding: isMobile ? "4px" : "4px 8px",
              borderRadius: "8px",
              backgroundColor: "white",
              width: isMobile ? "32px" : "auto",
              gap: "5px",
            }}
          >
            {isMobile ? (
              <Icon variant="link" name="filter" />
            ) : (
              <>
                <div style={{ display: "flex", gap: "5px" }}>
                  <Icon variant="link" name="filter" />
                  <span
                    style={{
                      fontWeight: "normal", 
                      color: "#9BA7B6",
                      fontStyle: "italic",
                    }}
                  >
                    Filters
                  </span>
                </div>
                <Icon
                  variant="link"
                  name={isOpen ? "caret-up-filled" : "caret-down-filled"}
                />
              </>
            )}
          </span>
          <Box float="right">
            {!isMobile && (
              <SpaceBetween size="xs" direction="horizontal">
                <Button href="/app/Inventory/addItem">Add Item</Button>
                <div>
                  <Popover
                    onDismiss={() => setIsPopoverOpen(false)}
                    position="left"
                    align="start"
                    size="small"
                    wrapTriggerText={false}
                    triggerType="custom"
                    content={
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileImport}
                          accept=".xlsx"
                          style={{ display: "none" }}
                        />
                        <Button
                          variant="inline-link"
                          iconName="upload"
                          onClick={handleImport}
                        >
                          Import
                        </Button>
                        <Button
                          variant="inline-link"
                          iconName="download"
                          onClick={handleExport}
                        >
                          Export
                        </Button>
                        <ProductPDF products={getCombinedProducts()} onDownloadSuccess={() => {
                          showFlashMessage("success", "PDF downloaded successfully");
                          setTimeout(() => {
                            setFlashMessages([]);
                          }, 3000);
                        }}/>
                      </div>
                    }
                  >
                    <Button
                      iconName="ellipsis"
                      onClick={handleButtonClick}
                      ariaLabel="Options menu"
                      variant="icon"
                    />
                  </Popover>
                </div>
              </SpaceBetween>
            )}
          </Box>
        </Grid>
        
        {/* Filter UI that appears when toggle is clicked */}
        {isOpen && (
          <div style={{ 
            // padding: "16px", 
            // backgroundColor: "white", 
            // borderRadius: "8px", 
            // border: "1px solid #e9ebed",
            marginBottom: "16px"
          }}>
            <Grid
              gridDefinition={[
                { colspan: isMobile ? 12 : 4 },
                { colspan: isMobile ? 12 : 4 },
                { colspan: isMobile ? 12 : 4 },
              ]}
            >
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
                disabled={!selectedCategory || selectedCategory.value === ""} // Disable if no category or "All" is selected
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
              <Select
                required
                selectedOption={selectedStatus}
                onChange={handleSelectChange}
                options={[
                  { label: "All", value: "" },
                  { label: "In Stock", value: true },
                  { label: "Out Of Stock", value: false },
                ]}
                placeholder="Select Status"
              />
            </Grid>
          </div>
        )}
        
        {/* stats */}
        <Grid
            gridDefinition={[
              { colspan: { default:isMobile ? 6 : 12, xxs: isMobile ? 10 : 3 } },
              { colspan: { default:isMobile ? 6 : 12, xxs: isMobile ? 2 : 3 } },
              { colspan: { default:isMobile ? 6 : 12, xxs: isMobile ? 12 : 3 } },
              { colspan: { default:isMobile ? 6 : 12, xxs: isMobile ? 12 : 3 } },

            ]}
        >
          <div 
            style={{ 
              cursor: 'pointer',
              backgroundColor: selectedView === 'allProducts' ? '#f4f9ff' : 'white',
              borderRadius: '16px',
              border: selectedView === 'allProducts' ? '1px solid #0972D3' : '1px solid #e9ebed',
              padding: '16px',
              boxShadow: selectedView === 'allProducts' ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onClick={() => setSelectedView('allProducts')}
          >
            <div style={{ marginBottom: '8px' }}>
              <Header variant="h2">
                {inventoryStats?.data?.totalProducts}
              </Header>
            </div>
            <b>All Products</b>
          </div>
          <div 
            style={{ 
              cursor: 'pointer',
              backgroundColor: selectedView === 'itemCollection' ? '#f4f9ff' : 'white',
              borderRadius: '16px',
              border: selectedView === 'itemCollection' ? '1px solid #0972D3' : '1px solid #e9ebed',
              padding: '16px',
              boxShadow: selectedView === 'itemCollection' ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onClick={handleItemCollectionView}
          >
            <div style={{ marginBottom: '8px' }}>
              <Header variant="h2">{inventoryCollection?.data[1]?.length || 42}</Header>
            </div>
            <b>{isMobile ? "Multiple Variants" : "Multiple-Variants Items"}</b>
          </div>

          <div 
            style={{ 
              // cursor: 'pointer',
              backgroundColor:  'white',
              borderRadius: '16px',
              border: '1px solid #e9ebed',
              padding: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            // onClick={() => setSelectedView('publishedStock')}
          >
            <div style={{ marginBottom: '8px' }}>
              <Header variant="h2">{inventoryStats?.data?.active}</Header>
            </div>
            <b>Published Stock</b>
          </div>

          <div 
            style={{ 
              // cursor: 'pointer',
              backgroundColor: 'white',
              borderRadius: '16px',
              border:  '1px solid #e9ebed',
              padding: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            // onClick={() => setSelectedView('expired')}
          >
            <div style={{ marginBottom: '8px' }}>
              <Header variant="h2">223</Header>
            </div>
            <b>Expired</b>
          </div>
        </Grid>
        <Box float="right">
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {renderModalButton()}
            <Modal
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
            </Modal>{" "}
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
        {selectedView === 'allProducts' && (
          <>
            <Table
            // expandableRows={'name'}
            // resizableColumns
            contentDensity="compact"
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
              header={
                <Header
                  actions={
                    <Button
                      disabled={isFieldChanged}
                      variant="normal"
                      onClick={handleBulkModifyPrice}
                    >
                      Bulk Update Price
                    </Button>
                  }
                >
                  {isMobile ? `Selected: ${selectedItems.length}` : `Total Selected Items: ${selectedItems.length}`}
                </Header>
              }
              variant="borderless"
              columnDefinitions={[
                {
                  id: "itemCode",
                  header: "Item Code",
                  cell: (e) => `#${e.id}`,
                  isRowHeader: true,
                },
                {
                  id: "name",
                  header: "Name",
                  cell: (e) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleProductClick(e)}
                        onMouseEnter={() => setHoveredProductId(e.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
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
                        <span
                          style={{
                            // width: "250px",
                            // textDecoration: "underline",
                            color: hoveredProductId === e.id ? "blue" : "black", // Change color based on hovered product ID
                          }}
                        >
                          {e.name}-
                          {e.totalQuantityInB2c}
                          {e.totalquantityB2cUnit}
                        </span>
                      </div>
                    );
                  },
                  width: 250,
                  minWidth: 180,
                },
                {
                  id: "status",
                  header: "Status",
                  cell: (e) => (
                    <b style={{ display: "flex", width: "100px",
                      color:e.availability === true | e.active === true?"green":"red"
                     }}>
                      {/* <Toggle
                        onChange={() => handleToggleClick(e)}
                        checked={e.active}
                      > */}
                      {e.availability === true
                        ? "In Stock"
                        : e.availability === false
                        ? "Out Of Stock"
                        : ""}
                      {e.active === true
                        ? "In Stock"
                        : e.active === false
                        ? "Out Of Stock"
                        : ""}
                      {/* </Toggle> */}
                      {/* <span
                        style={{
                          marginLeft: "10px",
                          color: e.status === "Inactive" ? "gray" : "black",
                        }}
                      ></span> */}
                    </b>
                  ),
                },
                {
                  id: "purchasingPrice",
                  header: "Purchasing Price",
                  cell: (item) => (
                    <div style={{ width: "80px" }}>
                      <FormField
                        errorText={validationErrors[item.id]?.purchasingPrice}
                      >
                        <Input
                          disabled={
                            !selectedItems.some(
                              (selectedItem) => selectedItem.id === item.id
                            )
                          }
                          placeholder="Enter Price"
                          type="number"
                          value={
                            editedProducts[item.id]?.purchasingPrice ??
                            item.purchasingPrice
                          }
                          onChange={(e) =>
                            handleInputChange(
                              item.id,
                              "purchasingPrice",
                              e.detail.value
                            )
                          }
                          ariaLabel="Purchasing Price"
                        />
                      </FormField>
                    </div>
                  ),
                },
                {
                  id: "sellingPrice",
                  header: "Selling Price",
                  cell: (item) => (
                    <div style={{ width: "80px" }}>
                      <FormField
                        errorText={validationErrors[item.id]?.sellingPrice}
                      >
                        <Input
                          placeholder="Enter Price"
                          type="number"
                          value={
                            editedProducts[item.id]?.sellingPrice ??
                            item.sellingPrice
                          }
                          onChange={(e) =>
                            handleInputChange(
                              item.id,
                              "sellingPrice",
                              e.detail.value
                            )
                          }
                          ariaLabel="Selling Price"
                          disabled={
                            !selectedItems.some(
                              (selectedItem) => selectedItem.id === item.id
                            )
                          }
                        />
                      </FormField>
                    </div>
                  ),
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
                  header: "Quantity In Stock",
                  cell: (e) => `${e.stockQuantity} ${e.units}`, // Use e.unit to get the unit from the API
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
                  id: "action",
                  header: "Action",
                  cell: (e) => (
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignContent: "center",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Link to={`/app/inventory/edit?id=${e.id}`}>
                        <Button iconName="edit" variant="inline-link" />
                      </Link>
                      <Button
                        iconName="remove"
                        // color="red"
                        variant="icon"
                        onClick={() => openModal(e.id)}
                      ></Button>
                    </div>
                  ),
                },
              ]}
              enableKeyboardNavigation
              items={
                fetchedPages[
                  `${selectedCategory?.value || ""}-${
                    selectedSubCategory?.value || ""
                  }-${filteringText || ""}-${
                    selectedStatus?.value === false
                      ? "false"
                      : selectedStatus?.value === true
                      ? "true"
                      : ""
                  }-${currentPage}`
                ] || []
              }
              selectionType="multi"
              trackBy="id"
              empty={
                <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
                  <SpaceBetween size="m">
                    <b>No Products</b>
                  </SpaceBetween>
                </Box>
              }
            />
          </>
        )}

        {selectedView === 'itemCollection' && (
          <>
            {isItemCollectionLoading ? (
              <Box textAlign="center" padding="xl">
                <Spinner size="large" />
              </Box>
            ) : (
              <Table
                variant="borderless"
                columnDefinitions={[
                  {
                    id: "name",
                    header: "Name",
                    cell: (e) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
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
                          <div>
                          <p>{e.name}</p>
                          <p>{e.variations?.length} {e.variations?.length === 1 ? 'Variant' : 'Variants'}</p>
                          </div>
                        </div>
                      );
                    },
                    width: 200,
                  },
                  {
                    id: "category",
                    header: "Category",
                    cell: (e) => e.category,
                    width: 150,
                  },
                  {
                    id: "subCategory",
                    header: "Sub Category",
                    cell: (e) => e.subCategory,
                    width: 150,
                  },
                  {
                    id: "action",
                    header: <div style={{textAlign: "center"}}>Action</div>,
                    cell: (e) => (
                      <div
                        style={{
                          display: "flex",
                          gap: "15px",
                          alignContent: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Link to={`/app/inventory/edit?id=${e.groupId}`}>
                          <Button iconName="edit" variant="inline-link" />
                        </Link>
                        <Button
                          iconName="remove"
                          variant="icon"
                          onClick={() => openModal(e.groupId)}
                        ></Button>
                      </div>
                    ),
                  },
                ]}
                items={inventoryCollection.data[collectionCurrentPage] || []}
                loadingText="Loading inventory collection"
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No inventory collection items</b>
                  </Box>
                }
              />
            )}
          </>
        )}

        {/* Show different tables based on selected view */}
        {selectedView === 'publishedStock' && (
          <Box textAlign="center" color="inherit">
            <b>Published Stock View Coming Soon</b>
          </Box>
        )}

        {selectedView === 'expired' && (
          <Box textAlign="center" color="inherit">
            <b>Expired Items View Coming Soon</b>
          </Box>
        )}
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
                Stock : {selectedProduct.stockQuantity}
                {selectedProduct.units}
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
            {/* <div
                style={{ display: "flex", alignItems: "center"}}
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
                </div> */}

            {/* <ButtonDropdown
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
                </ButtonDropdown> */}

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
