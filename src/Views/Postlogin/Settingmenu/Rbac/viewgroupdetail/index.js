import React, { useState } from "react";
import {
  Container,
  Header,
  Box,
  SpaceBetween,
  Table,
  Button,
  Badge,
  TextFilter,
  ContentLayout,
  BreadcrumbGroup,
  Tabs,
} from "@cloudscape-design/components";

const Viewgroupdetail = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [userFilteringText, setUserFilteringText] = useState("");
  const [roleFilteringText, setRoleFilteringText] = useState("");

  return (
    <ContentLayout
      headerVariant="high-contrast"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Settings", href: "/app/settings" },
            { text: "RBAC", href: "/app/settings/rbac/users" },
            { text: "Default User", href: "#" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={<Header variant="h1">RBAC</Header>}
    >
      <SpaceBetween size="m">
        <Container header={<Header variant="h2">Default User Group</Header>}>
          <Box>
            The Super admin is the highest level of administrative authority
            within a system, possessing unparalleled control access to all
            features, settings, and user data. Super admin hold the key to
            managing and overseeing the entire infrastructure, making critical
            decisions, and implementing security measures to protect the system
            from unauthorized access and potential breaches.
          </Box>
        </Container>

        <Tabs
          tabs={[
            {
              label: "Users",
              id: "users",
              content: (
                <Container>
                  <SpaceBetween size="m">
                    <Box>
                      <Box float="left">
                        <div style={{ width: "18rem" }}>
                          <TextFilter
                            filteringText={userFilteringText}
                            filteringPlaceholder="Search User"
                            filteringAriaLabel="Filter users"
                            onChange={({ detail }) =>
                              setUserFilteringText(detail.filteringText)
                            }
                          />
                        </div>
                      </Box>
                      <Box float="right">
                        <Button variant="primary">Add User</Button>
                      </Box>
                    </Box>
                    <Table
                      renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
                        `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                      }
                      onSelectionChange={({ detail }) =>
                        setSelectedItems(detail.selectedItems)
                      }
                      selectedItems={selectedItems}
                      ariaLabels={{
                        selectionGroupLabel: "Items selection",
                        allItemsSelectionLabel: () => "select all",
                        itemSelectionLabel: ({ selectedItems }, item) =>
                          item.username,
                      }}
                      columnDefinitions={[
                        {
                          id: "username",
                          header: "User Name",
                          cell: (item) => item.username,
                        },
                        {
                          id: "email",
                          header: "Email",
                          cell: (item) => item.email,
                        },
                        {
                          id: "status",
                          header: "Status",
                          cell: (item) => (
                            <span
                              style={{
                                color: item.status === "Active" ? "green" : "red",
                                fontWeight: "bold",
                                marginLeft: "0.5rem",
                              }}
                            >
                              {item.status}
                            </span>
                          ),
                        },
                        {
                          id: "logindetails",
                          header: "Login Details",
                          cell: (item) => item.logindetails,
                        },
                        {
                          id: "groups",
                          header: "Groups",
                          cell: (item) => item.groups,
                        },
                        {
                          id: "createddate",
                          header: "Created Date",
                          cell: (item) => item.createddate,
                        },
                      ]}
                      items={[
                        {
                          username: (
                            <>
                              User 1 <Badge color="green">Default</Badge>
                            </>
                          ),
                          email: "user1@example.com",
                          status: "Active",
                          logindetails: "Logged in 2 days ago",
                          groups: "2",
                          createddate: "2023-01-01",
                        },
                        {
                          username: "User 2",
                          email: "user2@example.com",
                          status: "Inactive",
                          logindetails: "Logged in 10 days ago",
                          groups: "4",
                          createddate: "2022-12-10",
                        },
                        {
                          username: "User 3",
                          email: "user3@example.com",
                          status: "Active",
                          logindetails: "Never logged in",
                          groups: "1",
                          createddate: "2023-03-15",
                        },
                      ]}
                      loadingText="Loading users"
                      selectionType="multi"
                      trackBy="name"
                      variant="borderless"
                      empty={
                        <Box
                          margin={{ vertical: "xs" }}
                          textAlign="center"
                          color="inherit"
                        >
                          <b>No Users</b>
                        </Box>
                      }
                    />
                  </SpaceBetween>
                </Container>
              ),
            },
            {
              label: "Roles",
              id: "roles",
              content: (
                <Container>
                  <SpaceBetween size="m">
                    <Box>
                      <Box float="left">
                        <div style={{ width: "18rem" }}>
                          <TextFilter
                            filteringText={roleFilteringText}
                            filteringPlaceholder="Search Roles"
                            filteringAriaLabel="Filter roles"
                            onChange={({ detail }) =>
                              setRoleFilteringText(detail.filteringText)
                            }
                          />
                        </div>
                      </Box>
                      <Box float="right">
                        <Button variant="primary">Add Role</Button>
                      </Box>
                    </Box>
                    <Table
                      renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
                        `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                      }
                      onSelectionChange={({ detail }) =>
                        setSelectedItems(detail.selectedItems)
                      }
                      selectedItems={selectedItems}
                      ariaLabels={{
                        selectionGroupLabel: "Items selection",
                        allItemsSelectionLabel: () => "select all",
                        itemSelectionLabel: ({ selectedItems }, item) =>
                          item.name,
                      }}
                      columnDefinitions={[
                        {
                          id: "rolename",
                          header: "Role Name",
                          cell: (item) => item.name,
                        },
                        {
                          id: "description",
                          header: "Description",
                          cell: (item) => item.description,
                        },
                      
                      ]}
                      items={[
                        {
                          name: "Admin",
                          description: "Full access to all features",
                        },
                        {
                          name: "Editor",
                          description: "Can edit content",
                        },
                        {
                          name: "Viewer",
                          description: "Can only view content",
                        },
                      ]}
                      loadingText="Loading roles"
                      selectionType="multi"
                      trackBy="name"
                      variant="borderless"
                      empty={
                        <Box
                          margin={{ vertical: "xs" }}
                          textAlign="center"
                          color="inherit"
                        >
                          <b>No Roles</b>
                        </Box>
                      }
                    />
                  </SpaceBetween>
                </Container>
              ),
            },
            {
              label: "Allowed Permissions",
              id: "allowedpermissions",
              content: (
                <Container>
                  <Box>Third tab content area</Box>
                </Container>
              ),
            },
            {
              label: "Disallowed Permissions",
              id: "disallowedpermissions",
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

export default Viewgroupdetail;
