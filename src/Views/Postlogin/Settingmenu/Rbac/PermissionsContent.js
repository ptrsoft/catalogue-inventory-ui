import React from "react";
import {
  ContentLayout,
  BreadcrumbGroup,
  Header,
  Box,
  Container,
  SpaceBetween,
} from "@cloudscape-design/components";
import Alloptions from "./alloptions";
import Tabs from "@cloudscape-design/components/tabs";
import Table from "@cloudscape-design/components/table";
import Button from "@cloudscape-design/components/button";

const PermissionsContent = () => {
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
                        cell: (item) => item.permissionname,
                      },
                      {
                        id: "status",
                        header: "Status",
                        cell: (item) => item.status || "-",
                      },
                    ]}
                    enableKeyboardNavigation
                    items={[
                      {
                        permissionname: "Purchase Order",
                        status: "Active",
                      },
                      {
                        permissionname: "Purchase Receiver",
                        status: "Active",
                      },
                      {
                        permissionname: "Invoices",
                        status: "Active",
                      },
                      {
                        permissionname: "Payments",
                        status: "Active",
                      },
                    ]}
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
                    header={<Header> Permissions </Header>}
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
