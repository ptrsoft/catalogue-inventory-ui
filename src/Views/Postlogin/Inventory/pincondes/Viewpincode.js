import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Header,
  SpaceBetween,
  TextContent,
  Tiles,
  Input,
  FormField,
  StatusIndicator,
  Alert,
  BreadcrumbGroup,
  Modal,
} from "@cloudscape-design/components";
import { useDispatch, useSelector } from "react-redux";
import { updateStatus } from "Redux-Store/Pincode/pincodeThunk";

const PincodeView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [localActive, setLocalActive] = useState(null); // Local active state to reflect immediate changes

  // Get the payload passed via navigation or fallback to first pincode
  const location = useLocation();
  const { payload, pincodes } = location.state || {};
  const currentData = payload || pincodes || {};
  const { pincode, deliveryType, shifts, active } = currentData;

  // Sync localActive state with Redux active status on initial load or update
  useEffect(() => {
    setLocalActive(active);
  }, [active]);

  // Open modal for updating status
  const handleConvertStatusClick = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Confirm status update
  const confirmUpdateStatus = () => {
    const newStatus = !localActive;

    // Update the local active state immediately
    setLocalActive(newStatus);

    // Dispatch the Redux action to update status in the backend
    dispatch(
      updateStatus({
        status: newStatus,
        pincodes: [pincode],
      })
    );

    // Close the modal
    setIsModalOpen(false);
  };

  // Function to navigate to the Add Pincode page
  const editbynavigating = (data) => {
    navigate("/app/inventory/pincodes/addpincode", {
      state: { pay: data },
    });
  };

  return (
    <SpaceBetween size="m">
      {/* Success Alert */}
      {payload && (
        <Alert
          dismissible
          type="info"
          header="Pincode has been added successfully"
        />
      )}
      {/* Breadcrumb */}
      <BreadcrumbGroup
        items={[
          { text: "Dashboard", href: "/app/dashboard" },
          { text: "Inventory", href: "/app/dashboard" },
          { text: "Pincodes", href: "/app/inventory/pincodes" },
          { text: "View Pincode", href: "#" },
        ]}
      />

      <Container
        header={
          <Header
            variant="h4"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="normal" onClick={handleConvertStatusClick}>
                  {localActive ? "Mark Inactive" : "Mark Active"}
                </Button>
                <Button
                  variant="normal"
                  onClick={() => editbynavigating(currentData)}
                  iconName="edit"
                >
                  Edit
                </Button>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="m" direction="vertical">
              <p>Pincode No</p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    fontWeight: "bolder",
                    color: "#0972D3",
                    fontSize: "40px",
                  }}
                >
                  {pincode}
                </span>
                <span style={{ marginTop: "8px" }}>
                  <StatusIndicator type={localActive ? "success" : "stopped"}>
                    {localActive ? "Active" : "Inactive"}
                  </StatusIndicator>
                </span>
              </div>
            </SpaceBetween>
          </Header>
        }
      >
        {/* Delivery Type */}
        <SpaceBetween direction="vertical" size="m">
          <h3>Delivery Type</h3>
          <Container>
            <Tiles
              value={deliveryType}
              onChange={({ detail }) => console.log(detail.value)}
              items={[
                {
                  label:
                    deliveryType === "same day"
                      ? "Same Day Delivery"
                      : "Next Day Delivery",
                  value: deliveryType,
                  description: `Item is delivered on the ${
                    deliveryType === "same day" ? "same day" : "next day"
                  } the order is placed.`,
                },
              ]}
              columns={1}
            />
          </Container>
        </SpaceBetween>

        {/* Shifts & Slots */}
        <Box margin={{ top: "m" }}>
          <TextContent>
            <h3>Shifts & Slots</h3>
          </TextContent>
          <Container>
            <SpaceBetween direction="vertical" size="m">
              {shifts?.map((shift, index) => (
                <Container key={index}>
                  <FormField label="Shift Name">
                    <Input value={shift.name} disabled />
                  </FormField>
                  <h4>Added Slots</h4>
                  {shift.slots.map((slot, slotIndex) => (
                    <SpaceBetween
                      size="m"
                      direction="horizontal"
                      key={slotIndex}
                    >
                      <FormField label="Start Time">
                        <Input value={slot.start} disabled />
                      </FormField>
                      <FormField label="End Time">
                        <Input value={slot.end} disabled />
                      </FormField>
                    </SpaceBetween>
                  ))}
                </Container>
              ))}
            </SpaceBetween>
          </Container>

          {/* Modal for confirming status or delivery type change */}
          <Modal
            visible={isModalOpen}
            onDismiss={closeModal}
            header={`Confirm Status Change`}
            footer={
              <Box>
                <Button variant="link" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmUpdateStatus}>
                  Confirm
                </Button>
              </Box>
            }
          >
            <TextContent>
              <p>
                Are you sure you want to change the status of pincode {pincode} to{" "}
                {localActive ? "Inactive" : "Active"}?
              </p>
            </TextContent>
          </Modal>
        </Box>
      </Container>
    </SpaceBetween>
  );
};

export default PincodeView;
