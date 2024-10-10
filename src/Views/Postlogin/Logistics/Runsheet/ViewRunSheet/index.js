import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Header,
  SpaceBetween,
  Input,
  BreadcrumbGroup,
  Modal
} from "@cloudscape-design/components";

const ViewRunsheet = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const orderIds = [
    "54764", "54764", "54764", "54764", "54764",
    "54764", "54764", "54764", "54764", "54764"
  ];

  const handleCloseRunsheet = () => setIsModalVisible(true);
  const handleConfirmClose = () => {
    setIsModalVisible(false);
    // Perform any additional actions to close the runsheet here
  };
  const handleCancel = () => setIsModalVisible(false);

  return (
    <Box>
      {/* Breadcrumbs */}
      <SpaceBetween direction="vertical" size="s">
        <BreadcrumbGroup
          items={[
            { text: "Logistics", href: "/app/dashboard" },
            { text: "Runsheet", href: "/app/Logistics/runsheet" },
            { text: "View Runsheet", href: "/runsheet/view" },
          ]}
          ariaLabel="Breadcrumbs"
        />
        <Header
          variant="h1"
          actions={<Button variant="primary" onClick={handleCloseRunsheet}>Close Runsheet</Button>}
        >
          View Runsheet
        </Header>

        <Container>
          <SpaceBetween direction="vertical" size="s">
            {/* Runsheet Details */}
            <Box>
              <Box fontWeight="bold">Runsheet ID</Box>
              <Box fontWeight="normal" variant="p">12345678</Box>
            </Box>

            <Box>
              <Box fontWeight="bold">Rider Name</Box>
              <Box fontWeight="normal" variant="p">Santu</Box>
            </Box>

            {/* Line of Orders */}
            <Box fontWeight="bold" variant="h2">
              Line of orders <span style={{ color: "#000716", fontWeight: "700", fontSize: "14px" }}>({orderIds.length} Orders)</span>
            </Box>
            <Header variant="h4">Order ID</Header>
            <SpaceBetween direction="vertical">
              {orderIds.map((orderId, index) => (
                <div style={{ width: "280px" }} key={index}>
                  <Input value={orderId} readOnly />
                </div>
              ))}
            </SpaceBetween>
          </SpaceBetween>
        </Container>

        {/* Confirmation Modal */}
        {isModalVisible && (
          <Modal
            onDismiss={handleCancel}
            visible={isModalVisible}
            closeAriaLabel="Close"
            header="Confirm Close Runsheet"
            footer={
              <Box float="right">
                      <div class="button-container">
    <button class="cancel-btn">Cancel Order</button>
    <button class="print-btn">Confirm</button>
  </div>
  </Box>
            }
          >
            Are you sure you want to close this runsheet?
          </Modal>
        )}
      </SpaceBetween>
    </Box>
  );
};

export default ViewRunsheet;
