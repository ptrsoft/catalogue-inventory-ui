import React from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';
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
  BreadcrumbGroup
} from '@cloudscape-design/components';

const PincodeView = () => {
  const navigate = useNavigate();

  // Function to navigate to the Add Pincode page
  const editbynavigating = (data) => {
    navigate("/app/inventory/pincodes/addpincode", { state: { payload: data } });
  }

  // Get the payload passed via navigation or fallback to first pincode
  const location = useLocation();
  const { payload, pincodes } = location.state || {}; 

  // Use payload if available, otherwise fallback to the first item in pincodes
  const currentData = payload || pincodes || {}; 
  const { pincode, deliveryType, shifts, active } = currentData;

  return (
    <SpaceBetween size="m">
      {/* Success Alert */}
      {payload &&
      <Alert dismissible type="info" header="Pincode has been added successfully" />
      }
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
                <Button variant="normal">Mark Inactive</Button>
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: '2em', color: '#0972D3' }}>{pincode}</span>
                <span style={{marginTop:"8px"}}>
                <StatusIndicator  type={active === 'active' ? "success" : "stopped"}>
                  {active === 'active' ? "Active" : "Inactive"}
                </StatusIndicator>
                </span>
              </div>
            </SpaceBetween>
          </Header>
        }
      >
        {/* Delivery Type */}
        <SpaceBetween direction='vertical' size='m'>
          <h3>Delivery Type</h3>
          <Container>
          <Tiles
  value={deliveryType}
  onChange={({ detail }) => console.log(detail.value)} // Handle selection change
  items={[
    {
      label: deliveryType === "same day" ? "Same Day Delivery" : "Next Day Delivery",
      value: deliveryType,
      description: `Item is delivered on the ${deliveryType === "same day" ? "same day" : "next day"} the order is placed.`
    }
  ]}
  columns={1}
/>

          </Container>
        </SpaceBetween>

        {/* Shifts & Slots */}
        <Box margin={{ top: 'm' }}>
          <TextContent>
            <h3>Shifts & Slots</h3>
          </TextContent>
          <Container>
            <SpaceBetween direction='vertical' size='m'>
              {shifts?.map((shift, index) => (
                <Container key={index}>
                  <FormField label="Shift Name">
                    <Input value={shift.name} disabled />
                  </FormField>
                  <h4>Added Slots</h4>
                  {shift.slots.map((slot, slotIndex) => (
                    <SpaceBetween size="m" direction="horizontal" key={slotIndex}>
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
        </Box>
      </Container>
    </SpaceBetween>
  );
};

export default PincodeView;
