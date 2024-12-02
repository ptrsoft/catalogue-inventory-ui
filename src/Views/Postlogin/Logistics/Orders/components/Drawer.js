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
} from "@cloudscape-design/components";
import { cancelOrder, fetchUsersbyid } from "Redux-Store/Orders/OrdersThunk";

import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
const Drawer = ({
  isDrawerOpen,
  selectedProduct,
  handleCloseDrawer,
  selectedOrder,
  handlePrint,
  error,
  usersbyid,
  onCancelOrder
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
    dispatch(cancelOrder({ orderId: cancelOrderId, reason: cancellationReason }))
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
  

  console.log(selectedOrder);
  return (
    <div>
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

                <button onClick={handlePrint} class="print-btn">
                  Print Bill
                </button>
              </div>
            </div>

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
                        <b>No Orders available</b> {/* Show no data message */}
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
