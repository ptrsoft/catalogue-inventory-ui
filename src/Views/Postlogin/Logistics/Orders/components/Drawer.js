import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Flashbar,
  Header,
  Button,
  Table,
  SpaceBetween,
  Modal,
  Textarea,
  Input,
  Pagination,
  TextFilter,
  Select
} from "@cloudscape-design/components";
import { fetchProducts } from "Redux-Store/Products/ProductThunk";

import {
  cancelOrder,
  fetchUsersbyid,
  reattempt,
} from "Redux-Store/Orders/OrdersThunk";

import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import Invoice from "./Invoice";
const Drawer = ({
  isDrawerOpen,
  selectedProduct,
  handleCloseDrawer,
  selectedOrder,
  error,
  usersbyid,
  onCancelOrder,
}) => {
  const [cancellationReason, setCancellationReason] = useState(""); // State for cancellation reason
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null); // Store the order ID to cancel
  const [flashMessages, setFlashMessages] = useState([]);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCancelOrderId(null); // Clear the order ID
    setCancellationReason(""); // Clear the cancellation reason
  };
  const handleOpenModal = (orderId) => {
    setCancelOrderId(orderId); // Set the order ID to cancel
    // console.log(Cancelo,"id from modal");
    setIsModalOpen(true);
  };
  //cancel api
  const dispatch = useDispatch();
  const handleCancelOrder = () => {
    if (!cancelOrderId) return; // Ensure there's an order ID to cancel

    console.log(cancelOrderId, "id");

    // Dispatch the cancel order thunk with order ID and reason
    dispatch(
      cancelOrder({ orderId: cancelOrderId, reason: cancellationReason })
    )
      .unwrap() // Handle the response using Redux Thunk's `unwrap`
      .then(() => {
        // Show a success flash message when the order is successfully canceled
        setFlashMessages([
          {
            type: "info",
            content: "Order successfully canceled.",
            dismissible: true,
            id: "successCancel",
            onDismiss: () => setFlashMessages([]),
          },
        ]);

        // Automatically dismiss the flash message after 3 seconds
        setTimeout(() => {
          setFlashMessages([]);
        }, 3000);

        // Call the parent handler if provided
        if (onCancelOrder) {
          onCancelOrder(cancelOrderId);
        }

        // Close the modal
        handleCloseModal();
      })
      .catch((error) => {
        // Show an error flash message if the cancellation fails
        setFlashMessages([
          {
            type: "error",
            content: `Failed to cancel the order. Please try again. Error: ${error}`,
            dismissible: true,
            id: "errorCancel",
            onDismiss: () => setFlashMessages([]),
          },
        ]);
      });
  };

  //reattempt logic
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openConfirmationModal = () => {
    setIsModalVisible(true);
  };

  const closeConfirmationModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirmAction = () => {
    dispatch(reattempt({ orderId: selectedOrder.orderId }));
    console.log(selectedOrder.orderId, "reattempt");
    setIsModalVisible(false); // Close modal after dispatching the action
  };

  console.log(selectedOrder);
  //add item code 
  
    const products = useSelector((state) => state.products.products);
    console.log(products, "prod");
    console.log("pro", products);
    const { data = [] } = products;
    console.log("modal data", data.items);
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
      const [visible, setVisible] = useState(false);
        const [items, setItems] = useState([]);
      
        const [quantities, setQuantities] = useState({});
        const [selectedItems, setSelectedItems] = useState([]);
        
        // Handle quantity change
        const handleQuantityChange = (item, value) => {
          setQuantities((prev) => ({
            ...prev,
            [item.id]: value,
          }));
        };
        
        // Update selected items to include quantity
        const handleApplyItems = () => {
          const updatedSelectedItems = selectedItems.map((item) => ({
            ...item,
            quantity: quantities[item.id] || 0, // Default to 0 if no quantity entered
          }));
        
          console.log("Selected Items with Quantity:", updatedSelectedItems);
        
          // You can now use updatedSelectedItems for further processing
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

  //discount modal 
  const [isModalOpenForDiscount, setIsModalOpenForDiscount] = useState(false);
  const [discount, setDiscount] = useState("");
  const [finalAmount, setFinalAmount] = useState(selectedOrder?.finalTotal);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  const handleDiscountChange = (value) => {
    if (/^\d*$/.test(value)) {
      const discountValue = Number(value);
      setDiscount(value);
      setFinalAmount(selectedOrder?.finalTotal - discountValue);
      setIsConfirmDisabled(discountValue <= 0 || discountValue > selectedOrder?.finalTotal);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch("/api/apply-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: Number(discount), finalAmount }),
      });

      if (response.ok) {
        alert("Discount applied successfully!");
        setIsModalOpen(false);
      } else {
        alert("Failed to apply discount.");
      }
    } catch (error) {
      console.error("Error applying discount:", error);
    }
  };

  return (
    <div>
      {isDrawerOpen && selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100%",
            width: "450px",
            backgroundColor: "white",
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            overflowY: "auto",
            // color: "red",
          }}
        >
          {" "}
          {flashMessages.length > 0 && <Flashbar items={flashMessages} />}
          <Box padding="l">
            
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Header variant="h3">Orders Details</Header>

              <Button
                iconName="close"
                variant="icon"
                onClick={handleCloseDrawer}
              />
            </div>
            <hr></hr>
            <div class="button-container" style={{marginTop:'15px',marginBottom:'15px'}}>
                {selectedOrder?.status === "cancelled" ? (
                  <button
                    class="cancel-btn"
                    style={{
                      border: "2px solid #0972D3",
                      borderColor: "#0972D3",
                      color: "#0972D3",
                    }}
                    onClick={openConfirmationModal}
                  >
                    Re Attempt
                  </button>
                ) : (
                  <button
                    class="cancel-btn"
                    onClick={() => handleOpenModal(selectedOrder?.userInfo?.id)}
                  >
                    Cancel Order
                  </button>
                )}
                <Invoice selectedOrder={selectedOrder} flag={"single"} />
              
              </div>
            {/* Order and Customer Info */}
            <div className="items-container">
              <div style={{ marginBottom: "10px" }}>
                <Container>
                  <div className="product-card">
                    <div className="details">
                      <div className="info-row">
                        <b>Order ID:</b>
                        <span className="value">
                          {selectedOrder?.userInfo?.id}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Customer Name:</span>
                        <span className="value">
                          {selectedOrder?.userInfo?.name}
                          <span
                            style={{
                              backgroundColor: "#4B5563",
                              color: "#FFF",
                              padding: "2px 8px",
                              borderRadius: "5px",
                              fontSize: "12px",
                              marginLeft: "5px",
                            }}
                          >
                            {selectedOrder?.paymentDetails?.method}
                          </span>
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Address:</span>
                        <span className="value">
                        {selectedOrder?.address?.house_number}, {selectedOrder?.address?.address}, {selectedOrder?.address?.landmark_area}, {selectedOrder?.address?.zipCode}

                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Contact No:</span>
                        <span className="value">
                          {selectedOrder?.userInfo?.number}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Payment:</span>
                        <span className="value">
                          {selectedOrder?.paymentDetails?.method}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Total Items:</span>
                        <span className="value">
                          {selectedOrder?.items.length}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="label">Order Status:</span>
                        <span className="value">{selectedOrder?.status}</span>
                      </div>
                      <div className="info-row">
                        <span className="label">Total Price:</span>
                        <span className="value">
                          {selectedOrder?.totalPrice}
                        </span>
                      </div>

                      {usersbyid.map((user) => (
                        <div className="info-row" key={user.id}>
                          <span className="label">
                            {user.role === "rider"
                              ? "Rider Name:"
                              : user.role === "packer"
                              ? "Packer Name:"
                              : ""}
                          </span>
                          <span className="value">{user.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Container>
              </div>
            </div>

            {/* Action Buttons */}

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
              <Button variant="inline-link" iconName="add-plus"               
                      onClick={() => setVisible(true)}
              >Add Item</Button>
           
            </div>
            {/* Modal for Selecting Items */}
      <Modal
        onDismiss={() => setVisible(false)}
        visible={visible}
        closeAriaLabel="Close modal"
        size="large"
        // header={<Header>Add Items</Header>}
        header={
          <Header
            actions={
              <div style={{marginLeft:'420px'}}>
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => setVisible(false)}>Cancel</Button>
                <Button
              variant="primary"
              onClick={handleApplyItems}
              disabled={selectedItems.length === 0} // Disable if no item is selected
            >
              Save
            </Button>
              </SpaceBetween>
              </div>
            }
          >Add Items</Header>
        }
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
            <Header>
              <SpaceBetween direction="horizontal" size="xs">
                <div style={{ width: "400px" }}>
                  <TextFilter
                    filteringText={filteringText}
                    filteringPlaceholder="Search"
                    filteringAriaLabel="Filter instances"
                    onChange={handleSearchChange}
                  />
                </div>
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
              </SpaceBetween>
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
                  {item.name}
                </div>
              ),
            },
         
            {
              header: "Price Per Unit ",
              cell: (item) => item.purchasingPrice,
            },
            {
              header: "Add Quantity",
              cell: (item) => (
                <Input
                type="number"
                value={quantities[item.id] || ""}
                onChange={({ detail }) => handleQuantityChange(item, detail.value)}
                disabled={!selectedItems.some((selected) => selected.id === item.id)}
                placeholder="Enter quantity"
              />
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
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) =>
            setSelectedItems(detail.selectedItems)
          }
          trackBy="itemCode"
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
                  <Box
                    margin={{ vertical: "xs" }}
                    textAlign="center"
                    color="inherit"
                  >
                    <SpaceBetween size="m">
                      {error ? (
                        <b>{error} No orders</b>
                      ) : (
                        <>
                          <b>No Orders available</b>{" "}
                          {/* Show no data message */}
                        </>
                      )}
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

                        <p> {item.productName}</p>
                      </div>
                    ),
                  },
                  { header: "Quantity", cell: (item) => item.quantity },
                  { header: "Price", cell: (item) => item.price },
                ]}
                items={selectedOrder?.items}
                // variant="embedded"
                variant="borderless"
                stickyHeader
              />
            </Container>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
                marginTop:'15px'
              }}
            >
              <Box variant="h5">Cost Details </Box>
              <Button variant="inline-link" onClick={() => setIsModalOpenForDiscount(true)}>Add Discount</Button>
           
            </div>
            <Container>
              <SpaceBetween direction="vertical" size="s">
            <div style={{display:'flex',justifyContent:"space-between"}}>
                        <strong >Sub Total:</strong>
                        <strong >
                          RS.{selectedOrder?.subTotal}
                        </strong>
                      </div>
                      <div style={{display:'flex',justifyContent:"space-between"}}>
                        <strong >Shipping Charges:</strong>
                        <strong >
                          RS.{selectedOrder?.deliveryCharges}
                        </strong>
                      </div>
                      <div style={{display:'flex',justifyContent:"space-between"}}>
                        <strong >Discount:</strong>
                        <strong >
                         RS.{selectedOrder?.discount||0.0}
                        </strong>
                      </div>
                      
                      <hr></hr>
                      <div style={{display:'flex',justifyContent:"space-between"}}>
                        <strong >Total Amount:</strong>
                        <strong >
                          RS.{selectedOrder?.finalTotal}
                        </strong>
                      </div>
                      </SpaceBetween>

            </Container>
          </Box>
        </div>
      )}
       {isModalOpenForDiscount && (
        <Modal
        size="medium"
          visible={isModalOpenForDiscount}
          onDismiss={() => setIsModalOpenForDiscount(false)}
          header="Add Discount"
          footer={
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsModalOpenForDiscount(false)} variant="link">Cancel</Button>
              <Button onClick={handleConfirm} disabled={isConfirmDisabled} variant="primary">
                Confirm
              </Button>
            </div>
          }
        >
                        <SpaceBetween direction="vertical" size="m">

          <p>"Are you sure you want to apply this discount to your order?"</p>
          <div style={{display:'flex',gap:'200px'}}>
                        <strong >Final Amount:</strong>
                        <strong >
                          RS.{finalAmount||selectedOrder?.finalTotal}
                        </strong>
                      </div>
                      <div style={{display:'flex',gap:'200px'}}>
                        <strong >Discount: </strong>
                        <Input value={discount} placeholder="Enter Discount" onChange={({ detail }) => handleDiscountChange(detail.value)} />

                      </div>
  
              
          
          </SpaceBetween>
        </Modal>
      )}

      {isModalVisible && (
        <Modal
          onDismiss={closeConfirmationModal}
          visible={isModalVisible}
          header="Confirm Action"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={closeConfirmationModal} variant="link">
                  Cancel
                </Button>
                <Button onClick={handleConfirmAction} variant="primary">
                  Confirm
                </Button>
              </SpaceBetween>
            </Box>
          }
        >
          Are you sure you want to Reattempt This Order?
        </Modal>
      )}
      {isModalOpen && (
        <Modal
          size="medium"
          visible={isModalOpen}
          onDismiss={handleCloseModal}
          closeAriaLabel="Close"
          header={<Header>Order Cancel Reason</Header>}
        >
          <hr />

          <div>
            
            {/* Adjusted line-height here */}
            <SpaceBetween direction="vertical" size="s">
              <p style={{ color: "#1D4ED8" }}>
                <strong>Order ID:</strong> <b>{selectedOrder?.userInfo?.id}</b>
              </p>
              <p>
                <strong>{selectedOrder?.userInfo?.name}</strong>{" "}
                <span
                  style={{
                    backgroundColor: "#4B5563",
                    color: "#FFF",
                    padding: "2px 8px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    marginLeft: "5px",
                  }}
                >
                  {selectedOrder?.paymentDetails?.method}
                </span>
              </p>
              <p>
                {selectedOrder?.shippingDetails?.address}{" "}
                {selectedOrder?.shippingDetails?.zipcode}
              </p>
              <p>{selectedOrder?.userInfo?.number}</p>
              <hr />

              {/* Payment and Items on the same line */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>
                  <strong>Payment:</strong>{" "}
                  <b style={{ color: "#1D4ED8" }}>
                    <i>{selectedOrder?.totalPrice}</i>
                  </b>
                </p>
                <p>
                  <strong>{selectedOrder?.items?.length} Items</strong>
                </p>
              </div>

              {/* Reason Textarea */}
              <b>Reason</b>
              <Textarea
                rows={4} // Use curly braces for numbers
                value={cancellationReason} // Controlled input
                onChange={({ detail }) => setCancellationReason(detail.value)} // Capture the reason using Cloudscape's `detail.value`
                placeholder="Enter cancellation reason"
                ariaLabel="Cancellation reason"
                style={{ width: "100%", marginBottom: "1rem" }} // Inline styles
              />

              {/* Cancel Order Button */}
              <button
                className="cancel-btn"
                style={{ float: "right" }}
                onClick={handleCancelOrder}
              >
                confirm Cancel
              </button>
            </SpaceBetween>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Drawer;
