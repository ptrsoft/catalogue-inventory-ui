import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Box,
  Input,
  Grid,
  Pagination,
  Select,
  Header,
  Container,
  TextFilter,
  Modal,
  Textarea,
  Flashbar
} from "@cloudscape-design/components";

import {
  ContentLayout,
  BreadcrumbGroup,
  SpaceBetween,
} from "@cloudscape-design/components";
import Stats from "./components/Stats";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderInventory,
  fetchOrderById,
  cancelOrder,
} from "Redux-Store/Orders/OrdersThunk";
const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null); // Store the order ID to cancel
  const [cancellationReason, setCancellationReason] = useState(""); // State for cancellation reason

  const handleOpenModal = (orderId) => {
    console.log(orderId, "modal");
    setCancelOrderId(orderId); // Set the order ID to cancel
    // console.log(Cancelo,"id from modal");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCancelOrderId(null); // Clear the order ID
    setCancellationReason(""); // Clear the cancellation reason
  };
  const [flashMessages, setFlashMessages] = useState([]);
  const handleCancelOrder = () => {
    if (cancelOrderId) {
      console.log(cancelOrderId, "id");

      // Dispatch the cancel order thunk with order ID and reason
      dispatch(cancelOrder({ orderId: cancelOrderId, reason: cancellationReason }))
        .unwrap() // to handle the response if you're using Redux Thunk
        .then(() => {
          // Show success flashbar when order is successfully canceled (e.g., 200 status)
          setFlashMessages([
            {
              type: "info",
              content: "Order successfully cancel.",
              dismissible: true,
              id: "successCancel",
              onDismiss: () => setFlashMessages([]),
            },
          ]);

          // Automatically dismiss the flash message after 3 seconds
          setTimeout(() => {
            setFlashMessages([]);
          }, 3000);

          handleCloseModal(); 
          if (selectedProduct) {
            dispatch(fetchOrderById(selectedProduct)); // Dispatch the thunk to fetch order details
          }// Close the modal after dispatch
        })
        .catch((error) => {
          // Show an error flashbar if the cancellation fails
          setFlashMessages([
            {
              type: "error",
              content: "Failed to cancel the order. Please try again.",
              dismissible: true,
              id: "errorCancel",
              onDismiss: () => setFlashMessages([]),
            },
          ]);
        });
    }
  };

  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50); // Number of rows per page

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [ageFilter, setAgeFilter] = useState(  { label: "7 Days Old",
    value: "7",}); // New state for age filter
  // Get loading, error, and selectedOrder from the Redux store
  const dispatch = useDispatch();
  const { selectedOrder } = useSelector((state) => state.orderInventory);
  const { orders, loading, error, count } = useSelector(
    (state) => state.orderInventory
  );
  // const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [statuscategory, setstatuscategory] = useState(null);
  const [pageKey, setPageKey] = useState("");
  const [filteringText, setFilteringText] = React.useState("");

  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
    // setCurrentPage(1); // Reset page to 1 when filters change
  };
  console.log(filteringText, "search");
  useEffect(() => {
    dispatch(
      fetchOrderInventory({
        search: filteringText || "",
        type: category?.value || "",
        status: statuscategory?.value || "",
        date: ageFilter?.value || "",
        pageKey,
      })
    );
  }, [dispatch, filteringText,ageFilter, statuscategory, category, pageKey]);

  useEffect(() => {
    if (selectedProduct) {
      dispatch(fetchOrderById(selectedProduct)); // Dispatch the thunk to fetch order details
    }
  }, [dispatch, selectedProduct]);


  const handleOrderClick = (orderId) => {
    setSelectedProduct(orderId);

    setIsDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Order Placed", value: "order placed" },
    { label: "Cancel Orders", value: "cancelled" },
    { label: "Packed", value: "packed" },
    { label: "On The Way", value: "ontheway" },
    { label: "Delivered", value: "delivered" },

    // Add other statuses if needed
  ];
  const ageOptions = [
    { label: "7 days old delivered", value: "7" },
    { label: "14 days old delivered", value: "14" },
    { label: "1 month old delivered", value: "1m" },
    { label: "2 months old delivered", value: "2m" },
    { label: "Older", value: "older" },
  ];
  const handleAgeFilterChange = ({ detail }) => {
    setAgeFilter(detail.selectedOption);
  };

  const paymentOptions = [
    { label: "All", value: "" },
    { label: "Cash On Delivery", value: "cash" },
    { label: "Prepaid", value: "online" },
    // Add other statuses if needed
  ];

  const columns = [
    {
      header: "Order ID",
      cell: (item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleOrderClick(item.id)}
        >
          {item.id}
        </div>
      ),
      width: 250,
      minWidth: 180,
    },
    { header: "Order Date", cell: (item) => item.orderDate.slice(0, 10) },

    { header: "Customer Name", cell: (item) => item.customerName },
    { header: "Items", cell: (item) => item.items },

    {
      header: "Payment Type",
      cell: (item) => (
        <strong>
          {item.paymentType === "cash" ? (
            "COD"
          ) : (
            <strong style={{ color: "#1D4ED8" }}>Prepaid</strong>
          )}
        </strong>
      ),
    },
    { header: "Order Status", cell: (item) => item.orderStatus },

    { header: "Total Amount", cell: (item) => item.totalAmount },
    { header: "Deliver Area", cell: (item) => item.area },
  ];

  const handlePageChange = ({ detail }) =>
    setCurrentPageIndex(detail.currentPageIndex);

  const handlepaymentChange = ({ detail }) =>
    setCategory(detail.selectedOption);

  const handlestatusChange = ({ detail }) =>
    setstatuscategory(detail.selectedOption);



  return (
    <ContentLayout
      headerVariant="high-contrast"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/Dashboard" },
            { text: "Logistics", href: "/app/Dashboard" },
            { text: "Orders", href: "#" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={<Header variant="h1">Orders</Header>}
    >
    
      <SpaceBetween direction="vertical" size="xl">
        <Stats />
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
                  <strong>Order ID:</strong>{" "}
                  <b>{selectedOrder?.userInfo?.id}</b>
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
                    {selectedOrder?.paymentDetails?.method === "cash"
                      ? "COD"
                      : "Prepaid"}
                  </span>
                </p>
                <p>
                  {selectedOrder?.shippingDetails?.address}{" "}
                  {selectedOrder?.shippingDetails?.zipcode}
                </p>
                <p>{selectedOrder?.userInfo?.number}</p>
                <hr />

                {/* Payment and Items on the same line */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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

        <div>
          <Grid
            gridDefinition={[
              { colspan: { default: 12, xxs: 4 } },
              { colspan: { default: 12, xxs: 2 } },
              { colspan: { default: 12, xxs: 2 } },
              { colspan: { default: 12, xxs: 2 } },
              { colspan: { default: 12, xxs: 2 } },
            ]}
          >
            {/* Search bar */}
            <TextFilter
              filteringText={filteringText}
              filteringPlaceholder="Search"
              filteringAriaLabel="Filter instances"
              onChange={handleSearchChange}
            />

            {/* Sort dropdown */}
            <Select
              required
              selectedOption={category}
              onChange={handlepaymentChange}
              options={paymentOptions}
              placeholder="Sort By Payment Type"
              selectedAriaLabel="Selected status"
            />
            <Select
              required
              selectedOption={statuscategory}
              onChange={handlestatusChange}
              options={statusOptions}
              placeholder="Sort By Status"
              selectedAriaLabel="Selected status"
            />
                {/* {statuscategory?.value === "delivered" && ( */}
                    {/* Conditionally render age filter */}
              <Select
                required
                selectedOption={ageFilter}
                onChange={handleAgeFilterChange}
                options={ageOptions}
                placeholder="Filter by Delivery Age"
                selectedAriaLabel="Selected age filter"
              />
            {/* )} */}
            <Box float="right">
              <Pagination
                currentPageIndex={currentPageIndex}
                onChange={handlePageChange}
                pagesCount={Math.ceil(orders.length / pageSize)}
                ariaLabels={{
                  nextPageLabel: "Next page",
                  previousPageLabel: "Previous page",
                  pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
                }}
              />
            </Box>
          </Grid>

          {/* Orders table */}
          <div
            className={`orders-container ${
              isDrawerOpen ? "blur-background" : ""
            }`}
          >
            <Table
              variant="borderless"
              columnDefinitions={columns}
              items={orders}
              // pagination={

              // }
              // resizableColumns
              // stickyHeader
            />
          </div>
        </div>

        {isDrawerOpen && selectedProduct && (
          
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              width: "380px",
              backgroundColor: "white",
              boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              overflowY: "auto",
              color: "red",
            }}
          >      {flashMessages.length > 0 && (
            <Flashbar items={flashMessages} />
          )}
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
                              {selectedOrder?.paymentDetails?.method === "cash"
                                ? "COD"
                                : "Prepaid"}
                            </span>
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Address:</span>
                          <span className="value">
                            {selectedOrder?.shippingDetails?.address}{" "}
                            {selectedOrder?.shippingDetails?.zipcode}
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
                }}
              >
                <Box variant="h4">Items List </Box>
                <div class="button-container">
                  <button
                    class="cancel-btn"
                    onClick={() => handleOpenModal(selectedOrder?.userInfo?.id)}
                  >
                    Cancel Order
                  </button>

                  <button class="print-btn">Print Bill</button>
                </div>
              </div>

              <Table
                 empty={
                  <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
                    <SpaceBetween size="m">
                      {error ? (
                        <b>{error} No orders</b>
                      ) : (
                        <>
                          <b>No Orders available</b>  {/* Show no data message */}
                       
                        </>
                      )}
                    </SpaceBetween>
                  </Box>
                }
                columnDefinitions={[
                  {
                    header: "Product Name",
                    cell: (item) => (
                      <Box display="flex" alignItems="center">
                        <span style={{ fontSize: "20px", marginRight: "8px" }}>
                          {item.productImage}
                        </span>
                        {item.productName}
                      </Box>
                    ),
                  },
                  { header: "Quantity", cell: (item) => item.quantity },
                  { header: "Price", cell: (item) => item.price },
                ]}
                items={selectedOrder?.items}
                variant="embedded"
                stickyHeader
              />
            </Box>
          </div>
        )}
      </SpaceBetween>
    </ContentLayout>
  );
};

export default Orders;

