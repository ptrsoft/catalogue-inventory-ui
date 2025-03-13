import React, { useState } from "react";
import { Button, Modal, Flashbar } from "@cloudscape-design/components";

const MultipleOrdersCancellation = ({
  selectedItems,
  cancelOrdersThunk,
  dispatch,
  setFlashMessages,
  onOrdersCancelled, // Callback to notify the parent about the reset
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [flashMessages, setLocalFlashMessages] = useState([]);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleCancellingMultipleOrders = () => {
    if (selectedItems.length === 0) return;

    Promise.all(
      selectedItems.map((order) =>
        dispatch(
          cancelOrdersThunk({
            orderId: order.id,
            reason: order.reason || "No reason provided",
             })
        ).unwrap()
      )
    )
      .then(() => {
        // Show a success message for all canceled orders
        setFlashMessages([
          {
            type: "info",
            content: "All selected orders have been successfully cancelled.",
            dismissible: true,
            id: "successCancel",
          },
        ]);

        setTimeout(() => setFlashMessages([]), 3000); // Dismiss the flash message after 3 seconds

        handleCloseModal();
       // Notify the parent to reset selectedItems
       if (onOrdersCancelled) {
        onOrdersCancelled();
      }
      })
      .catch((error) => {
        // Handle cancellation errors
        setFlashMessages([
          {
            type: "error",
            content: `Failed to cancel some orders. Please try again. Error: ${error}`,
            dismissible: true,
            id: "errorCancel",
          },
        ]);
      });
  };

  return (
    <div>
      <Button
        variant="normal"
        onClick={handleOpenModal}
        disabled={selectedItems.length === 0} // Disable when no items are selected
      >
        Cancel Orders
      </Button>

      <Modal
        visible={isModalVisible}
        header="Confirm Order Cancellation"
        onDismiss={handleCloseModal}
        closeAriaLabel="Close modal"
        footer={
          <div>
            <Button onClick={handleCloseModal} variant="link">
              Cancel
            </Button>
            <Button onClick={handleCancellingMultipleOrders} variant="primary">
              Confirm
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to cancel the selected orders? This action cannot be undone.
        </p>
      </Modal>

      <Flashbar items={flashMessages} />
    </div>
  );
};

export default MultipleOrdersCancellation;
