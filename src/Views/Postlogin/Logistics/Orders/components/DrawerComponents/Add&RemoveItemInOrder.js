import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Pagination,
  Input,
  Select,
  TextFilter,
  Box,
  Button,
  Header,
  SpaceBetween,
  Container,
  Grid,
} from "@cloudscape-design/components";
import { fetchProducts } from "Redux-Store/Products/ProductThunk";
import { useDispatch } from "react-redux"; // Import useDispatch and useSelector
import { fetchOrderById, updateOrderItems } from "Redux-Store/Orders/OrdersThunk";
import { useMediaQuery } from 'react-responsive';
import ProductPDF from "Views/Postlogin/Logistics/Orders/components/DrawerComponents/Invoice";

const AddItemInOrder = ({ selectedOrder, setFlashMessages }) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [visible, setVisible] = useState(false);
  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
    setCurrentPage(1); // Reset page to 1 when filters change
  };
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  // Prepare items for the table
  const handleCategoryChange = ({ detail }) => {
    setSelectedCategory(detail.selectedOption);
    setCurrentPage(1); // Reset page to 1 when filters change
  };
  const handleSubCategoryChange = ({ detail }) => {
    setSelectedSubCategory(detail.selectedOption);
    setCurrentPage(1); // Reset page to 1 when filters change
  };

  const [filteringText, setFilteringText] = React.useState("");

  const [fetchedPages, setFetchedPages] = useState({}); // Store fetched data per page
  const [pagesCount, setPagesCount] = useState(1); // Keep track of total pages
  const [currentPage, setCurrentPage] = useState(1);
  console.log("Current Page:", currentPage);
  const [nextKeys, setNextKeys] = useState({}); // Store nextKey per page
  useEffect(() => {
    // Define the pageKey for pagination (undefined for page 1)
    const pageKey = currentPage === 1 ? undefined : nextKeys[currentPage - 1];

    // Create a key to represent the current filters and page
    const filterKey = `${selectedCategory?.value || ""}-${
      selectedSubCategory?.value || ""
    }-${filteringText || ""}-${currentPage}`;

    // Check if the current page with the current filter has already been fetched
    if (!fetchedPages[filterKey]) {
      dispatch(
        fetchProducts({
          category: selectedCategory?.value || "",
          subCategory: selectedSubCategory?.value || "",
          search: filteringText || "",
          // active: selectedStatus?.value || "",
          pageKey, // Only pass the nextKey for pages beyond 1
          pageSize: 50, // Items per page
        })
      )
        .unwrap()
        .then((result) => {
          console.log("Fetched products for page:", currentPage, result);

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
    // selectedStatus,
    nextKeys,
    fetchedPages,
  ]);

  const [quantities, setQuantities] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  // Handle quantity change
  const handleQuantityChange = (item, value) => {
    setQuantities((prev) => ({
      ...prev,
      [item.id]: value,
    }));
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

  const resetFilters = () => {
    setFilteringText("");
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setCurrentPage(1);
  };

  const handleApplyItems = () => {
    const updatedSelectedItems = (selectedItems || []).map((item) => ({
      ...item,
      quantity: quantities[item.id] || 0,
    }));

    const addItems = updatedSelectedItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      quantityUnits: `${item.totalQuantityInB2c}${item.totalquantityB2cUnit}`,
    }));
    console.log(selectedItems || [],"select")

    console.log("Add Items Array:", addItems);

    sendApiRequest(addItems, null);
    setVisible(false);
    setSelectedItems([]);
    setQuantities({});
    resetFilters(); // Reset filters after saving
  };

  // Remove out of stock item
  const removeOutOfStockItem = (item) => {
    console.log(item, "remove item details");
    const removeProductIds = [item.productId]; // Single item or array of itemIds to remove

    console.log("Remove Product IDs:", removeProductIds);

    // Send removeProductIds to the API
    sendApiRequest(null, removeProductIds);
  };

  const sendApiRequest = async (addItems, removeProductIds) => {
    try {
      const result = await dispatch(updateOrderItems({
        orderId: selectedOrder?.orderId,
        addItems,
        removeProductIds
      })).unwrap();

      // Dispatch fetchOrderById to refresh the order
      dispatch(fetchOrderById(selectedOrder?.orderId));
      setFlashMessages("success", "Order updated successfully!");
    } catch (error) {
      console.error("Error occurred:", error);
      setFlashMessages("error", "Failed to update order!");
    }
  };

  return (
    <div>
      {/* Items List */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Box variant="h5">Items List </Box>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="inline-link"
            iconName="add-plus"
            onClick={() => setVisible(true)}
          >
            Add Item
          </Button>
          <ProductPDF orderData={selectedOrder}/>
       
        </div>
      </div>
      {/* Modal for Selecting Items */}
      <Modal
        size="max"
        onDismiss={() => {
          setVisible(false);
          resetFilters(); // Reset filters when modal is dismissed
        }}
        visible={visible}
        closeAriaLabel="Close modal"
        header={
          <Header>
            Add Items
          </Header>
        }
        style={{
          height: (() => {
            const currentPageData = fetchedPages[`${selectedCategory?.value || ""}-${selectedSubCategory?.value || ""}-${filteringText || ""}-${currentPage}`];
            console.log('Current Page Data:', currentPageData?.length);
            console.log('All Fetched Pages:', fetchedPages);
            return currentPageData?.length === 10 ? '100vh' : 'auto';
          })()
        }}
      >
        <Table
          pagination={
            <Pagination
              currentPageIndex={currentPage}
              onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
              pagesCount={pagesCount}
            />
          }
          header={
            <Header actions={
              !isMobile && (
                <Box float="right">
                  <SpaceBetween direction="horizontal" size="xs">
                    <button
                      className="cancel-btn"
                      style={{ borderRadius: "16px" }}
                      onClick={() => {
                        setVisible(false);
                        resetFilters(); // Reset filters when canceling
                      }}
                    >
                      Cancel
                    </button>
                    <Button
                      variant="primary"
                      onClick={handleApplyItems}
                      disabled={(selectedItems || []).length === 0}
                    >
                      Save
                    </Button>
                  </SpaceBetween>
                </Box>
              )
            }>
              <Grid
                gridDefinition={[
                  { colspan: { default: isMobile ? 12 : 6 } },
                  { colspan: { default: isMobile ? 12 : 3 } },
                  { colspan: { default: isMobile ? 12 : 3 } },
                  { colspan: { default: isMobile ? 12 : 12 } }
                ]}
              >
                {isMobile && (
                  <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                      <button
                        className="cancel-btn"
                        style={{ borderRadius: "16px" }}
                        onClick={() => {
                          setVisible(false);
                          resetFilters(); // Reset filters when canceling
                        }}
                      >
                        Cancel
                      </button>
                      <Button
                        variant="primary"
                        onClick={handleApplyItems}
                        disabled={(selectedItems || []).length === 0}
                      >
                        Save
                      </Button>
                    </SpaceBetween>
                  </Box>
                )}
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
                    {
                      label: "Bengali Special",
                      value: "Bengali Special",
                    },
                    {
                      label: "Eggs Meat & Fish",
                      value: "Eggs Meat & Fish",
                    },
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
              </Grid>
            </Header>
          }
          variant="borderless"
          columnDefinitions={[
            {
              header: "Item Code",
              sortingField: "Item Code",
              cell: (item) => "#" + item.id,
            },
            {
              header: "Item Name",
              sortingField: "Item Name",
              cell: (item) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                  />
                  {item.name}-{item.totalQuantityInB2c}
                  {item.totalquantityB2cUnit}
                </div>
              ),
            },

            {
              header: "Price Per Unit ",
              cell: (item) => item.sellingPrice,
            },
            {
              header: "Add Quantity",
              cell: (item) => (
                <Input
                  type="number"
                  value={quantities[item.id] || ""}
                  onChange={({ detail }) =>
                    handleQuantityChange(item, detail.value)
                  }
                  disabled={
                    !(selectedItems || []).some((selected) => selected.id === item.id)
                  }
                  placeholder="Enter quantity"
                />
              ),
            },
            {
              id: "status",
              header: "Status",
              cell: (e) => (
                <b
                  style={{
                    display: "flex",
                    width: "100px",
                    color:
                      (e.availability === true) | (e.active === true)
                        ? "green"
                        : "red",
                  }}
                >
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
          ]}
          // items={data.items}
          items={
            fetchedPages[
              `${selectedCategory?.value || ""}-${
                selectedSubCategory?.value || ""
              }-${filteringText || ""}-${currentPage}`
            ] || []
          }
          selectionType="multi"
          trackBy="id"
          selectedItems={selectedItems || []}
          onSelectionChange={({ detail }) =>
            setSelectedItems(detail.selectedItems || [])
          }
          isItemDisabled={(item) => item?.availability===false || item?.active===false}
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No Products</b>
              </SpaceBetween>
            </Box>
          }
        />
      </Modal>
      <Container>
        <Table
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <>
                  <b>No Orders available</b> {/* Show no data message */}
                </>
              </SpaceBetween>
            </Box>
          }
          columnDefinitions={[
            {
              header: "Product Name",
              cell: (item) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <img
                    src={item.productImage}
                    style={{
                      height: "30px",
                      width: "30px",
                      marginLeft: "5px",
                    }}
                    alt="products"
                  ></img>

                  <p>
                    {" "}
                    {item?.productName}-{item?.quantityUnits}
                    {item?.unit}
                  </p>
                </div>
              ),
            },
            {
              header: "Quantity",
              cell: (item) => (
                <div style={{ textAlign: "center" }}>{item.quantity}</div>
              ),
              maxWidth: 150,
            },
            {
              header: "Price",
              cell: (item) => (
                <div style={{ textAlign: "center" }}>{item.subtotal}</div>
              ),
              maxWidth: 150,
            },

            {
              header: "Action",
              cell: (item) => (
                <Button
                  iconName="remove"
                  variant="icon"
                  onClick={() => removeOutOfStockItem(item)}
                ></Button>
              ),
            },
          ]}
          items={selectedOrder?.items || []}
          // variant="embedded"
          variant="borderless"
          stickyHeader
        />
      </Container>
      {/* {selectedOrder?.removedItems?.length>0 & ( */}

      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            marginTop: "10px",
          }}
        >
          <Box variant="h4">Out Of Stock</Box>
        </div>
        <Container>
          <Table
            empty={
              <Box
                margin={{ vertical: "xs" }}
                textAlign="center"
                color="inherit"
              >
                <SpaceBetween size="m">
                  <>
                    <b>No Orders available</b> {/* Show no data message */}
                  </>
                </SpaceBetween>
              </Box>
            }
            columnDefinitions={[
              {
                header: "Product Name",
                cell: (item) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <img
                      src={item?.productImage}
                      style={{
                        height: "30px",
                        width: "30px",
                        marginLeft: "5px",
                      }}
                      alt="products"
                    ></img>

                    <p>
                      {" "}
                      {item?.productName}-{item?.quantityUnits}
                      {item?.unit}
                    </p>
                  </div>
                ),
              },
              {
                header: "Quantity",
                cell: (item) => (
                  <div style={{ textAlign: "center" }}>{item?.quantity}</div>
                ),
                maxWidth: 150,
              },
              {
                header: "Price",
                cell: (item) => (
                  <div style={{ textAlign: "center" }}>{item?.price}</div>
                ),
                maxWidth: 150,
              },
              {
                header: "Status",
                cell: (item) => (
                  <b style={{ textAlign: "center", color: "red" }}>
                    Out Of Stock
                  </b>
                ),
                maxWidth: 150,
              },
            ]}
            //show remove items here
            items={selectedOrder?.removedItems || []}
            // variant="embedded"
            variant="borderless"
            stickyHeader
          />
        </Container>
      </>
      {/* )} */}
    </div>
  );
};

export default AddItemInOrder;
