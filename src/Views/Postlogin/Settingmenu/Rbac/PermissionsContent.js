import React, { useState } from "react";
import {
  ContentLayout,
  BreadcrumbGroup,
  Header,
  Box,
  Container,
  SpaceBetween,
  Button,
} from "@cloudscape-design/components";
import Alloptions from "./alloptions";
import Tabs from "@cloudscape-design/components/tabs";
import Table from "@cloudscape-design/components/table";

const PermissionsContent = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Define items with child permissions
  const permissions = [
    {
      permissionname: "Purchase Order",
      status: "Active",
      subPermissions: [
        { permissionname: "Create", status: "Active" },
        { permissionname: "Edit", status: "Active" },
        { permissionname: "Delete", status: "Active" },
      ],
    },
    { permissionname: "Purchase Receiver", status: "Active" },
    { permissionname: "Invoices", status: "Active" },
    { permissionname: "Payments", status: "Active" },
  ];

  // Flatten items to include sub-permissions based on the toggle state
  const displayedPermissions = permissions.flatMap((item) =>
    item.subPermissions && isExpanded
      ? [item, ...item.subPermissions.map((sub) => ({ ...sub, isSub: true }))]
      : [item]
  );

  return (
    <ContentLayout
      headerVariant="high-contrast"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Settings", href: "/app/settings" },
            { text: "RBAC", href: "#" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={<Header variant="h1">RBAC</Header>}
    >
      <SpaceBetween size="m">
        <Alloptions />
        <Tabs
          tabs={[
            {
              label: "Procurement",
              id: "procurement",
              content: (
                <Container>
                  <Table
                    renderAriaLive={({
                      firstIndex,
                      lastIndex,
                      totalItemsCount,
                    }) =>
                      `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                    }
                    columnDefinitions={[
                      {
                        id: "permissionname",
                        header: "Permission Name",
                        cell: (item) => (
                          <Box
                            display="flex"
                            alignItems="center"
                            padding={{ left: item.isSub ? "l" : "none" }}
                          >
                            <span>{item.permissionname}</span>
                            {item.permissionname === "Purchase Order" && (
                              <Button
                                iconName={isExpanded ? "angle-down" : "angle-right"}
                                variant="icon"
                                onClick={() => setIsExpanded(!isExpanded)}
                                ariaLabel="Toggle sub-permissions"
                              />
                            )}
                          </Box>
                        ),
                      },
                      {
                        id: "status",
                        header: "Status",
                        cell: (item) => (
                          <span
                            style={{
                              fontWeight: "bold",
                              color: item.status === "Active" ? "green" : "red", // Green for Active, Red for Inactive
                            }}
                          >
                            {item.status || "-"}
                          </span>
                        ),
                      }
                                          ]}
                    enableKeyboardNavigation
                    items={displayedPermissions}
                    loadingText="Loading resources"
                    variant="borderless"
                    empty={
                      <Box
                        margin={{ vertical: "xs" }}
                        textAlign="center"
                        color="inherit"
                      >
                        <SpaceBetween size="m">
                          <b>No resources</b>
                          <Button>Create resource</Button>
                        </SpaceBetween>
                      </Box>
                    }
                    header={<Header>Permissions</Header>}
                  />
                </Container>
              ),
            },
            {
              label: "E-commerce",
              id: "ecommerce",
              content: (
                <Container>
                  <Box>Fourth tab content area</Box>
                </Container>
              ),
            },
            {
              label: "Inventory",
              id: "inventory",
              content: (
                <Container>
                  <Box>Fourth tab content area</Box>
                </Container>
              ),
            },
            {
              label: "Packer",
              id: "packer",
              content: (
                <Container>
                  <Box>Fourth tab content area</Box>
                </Container>
              ),
            },
          ]}
        />
      </SpaceBetween>
    </ContentLayout>
  );
};

export default PermissionsContent;
