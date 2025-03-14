import React, {  useState } from "react";
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

import { cancelOrder, reattempt } from "Redux-Store/Orders/OrdersThunk";

import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import Invoice from "./Invoice";
import OrderDetails from "./DrawerComponents/OrderDetails";
import AddDiscount from "./DrawerComponents/AddDiscount";
import AddItemInOrder from "./DrawerComponents/Add&RemoveItemInOrder";
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
  const handleFlashMessage = (content) => {
    setFlashMessages(() => [content]);
    console.log(content,"content");
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
            <div
              class="button-container"
              style={{ marginTop: "15px", marginBottom: "15px" }}
            >
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
            <OrderDetails selectedOrder={selectedOrder} usersbyid={usersbyid} />
            <AddItemInOrder selectedOrder={selectedOrder} setFlashMessages={handleFlashMessage}/>

            
            <AddDiscount selectedOrder={selectedOrder} />
          </Box>
        </div>
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

