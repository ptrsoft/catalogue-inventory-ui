import React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  SpaceBetween,
  Modal,
  Input,
} from "@cloudscape-design/components";

const AddDiscount = ({ selectedOrder }) => {
  //discount modal
  const [isModalOpenForDiscount, setIsModalOpenForDiscount] = useState(false);
  const [discount, setDiscount] = useState("");
  const [finalAmount, setFinalAmount] = useState(selectedOrder?.finalTotal);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
  const handleConfirm = async () => {
    try {
      const response = await fetch("/api/apply-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: Number(discount), finalAmount }),
      });

      if (response.ok) {
        alert("Discount applied successfully!");
        setIsModalOpenForDiscount(false);
      } else {
        alert("Failed to apply discount.");
      }
    } catch (error) {
      console.error("Error applying discount:", error);
    }
  };
  const handleDiscountChange = (value) => {
    if (/^\d*$/.test(value)) {
      const discountValue = Number(value);
      setDiscount(value);
      setFinalAmount(selectedOrder?.finalTotal - discountValue);
      setIsConfirmDisabled(
        discountValue <= 0 || discountValue > selectedOrder?.finalTotal
      );
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          marginTop: "15px",
        }}
      >
        <Box variant="h5">Cost Details </Box>
        <Button
          variant="inline-link"
          onClick={() => setIsModalOpenForDiscount(true)}
        >
          Add Discount
        </Button>
      </div>
      <Container>
        <SpaceBetween direction="vertical" size="s">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Sub Total:</strong>
            <strong>RS.{selectedOrder?.subTotal}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Shipping Charges:</strong>
            <strong>RS.{selectedOrder?.deliveryCharges}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Discount:</strong>
            <strong>RS.{selectedOrder?.discount || 0.0}</strong>
          </div>

          <hr></hr>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Total Amount:</strong>
            <strong>RS.{selectedOrder?.finalTotal}</strong>
          </div>
        </SpaceBetween>
      </Container>
      {isModalOpenForDiscount && (
        <Modal
          size="medium"
          visible={isModalOpenForDiscount}
          onDismiss={() => setIsModalOpenForDiscount(false)}
          header="Add Discount"
          footer={
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsModalOpenForDiscount(false)}
                variant="link"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isConfirmDisabled}
                variant="primary"
              >
                Confirm
              </Button>
            </div>
          }
        >
          <SpaceBetween direction="vertical" size="m">
            <p>"Are you sure you want to apply this discount to your order?"</p>
            <div style={{ display: "flex", gap: "200px" }}>
              <strong>Final Amount:</strong>
              <strong>RS.{finalAmount || selectedOrder?.finalTotal}</strong>
            </div>
            <div style={{ display: "flex", gap: "200px" }}>
              <strong>Discount: </strong>
              <Input
                value={discount}
                placeholder="Enter Discount"
                onChange={({ detail }) => handleDiscountChange(detail.value)}
              />
            </div>
          </SpaceBetween>
        </Modal>
      )}
    </div>
  );
};

export default AddDiscount;
