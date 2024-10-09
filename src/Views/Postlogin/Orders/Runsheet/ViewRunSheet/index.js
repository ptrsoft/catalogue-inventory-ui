import React from "react";
import {
  Box,
  Button,
  Container,
  Header,
  SpaceBetween,
  Input,
  BreadcrumbGroup,
} from "@cloudscape-design/components";

const ViewRunsheet = () => {
  const orderIds = [
    "54764",
    "54764",
    "54764",
    "54764",
    "54764",
    "54764",
    "54764",
    "54764",
    "54764",
    "54764",
  ];

  return (
    <Box>
      {/* Breadcrumbs */}
      <SpaceBetween direction="vertical" size="s">
        <BreadcrumbGroup
          items={[
            { text: "Logistics", href: "/logistics" },
            { text: "Runsheet", href: "/runsheet" },
            { text: "View Runsheet", href: "/runsheet/view" },
          ]}
          ariaLabel="Breadcrumbs"
        />
        <Header variant="h1" actions={ <Button variant="primary">Close Runsheet</Button>}>View Runsheet</Header>

        <Container>
       
          <SpaceBetween direction="vertical" size="s">
            {/* Runsheet Details */}
          <Box>
   
            <Box fontWeight="bold">Runsheet ID</Box>
          
          
       

            <Box fontWeight="normal" variant="p">
              12345678
            </Box>
            </Box>

            <Box>
              <Box fontWeight="bold">Rider Name</Box>
              <Box fontWeight="normal" variant="p">
                Santu
              </Box>
            </Box>
            {/* <Input value="Santu" readOnly /> */}

            {/* Line of Orders */}
            <Box fontWeight="bold" variant="h2">
              Line of orders <span>({orderIds.length} Orders)</span>
            </Box>

            <Header variant="h4">Order ID</Header>
            <SpaceBetween direction="vertical" size="xs">
              {orderIds.map((orderId, index) => (
                <Input key={index} value={orderId} readOnly/>
              ))}
            </SpaceBetween>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>
  );
};

export default ViewRunsheet;
