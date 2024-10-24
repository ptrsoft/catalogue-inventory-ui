import React, { useState } from "react";
import {
  ContentLayout,
  BreadcrumbGroup,
  Header,
  Container,
  Grid,
  Box,
  SpaceBetween,
  FormField,
  Input,
  Textarea,
} from "@cloudscape-design/components";
import Table from "@cloudscape-design/components/table";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import { Link } from "react-router-dom";

const Creategroup = () => {
  const [selectedUserItems, setSelectedUserItems] = useState([]); // For the first table
  const [selectedRoleItems, setSelectedRoleItems] = useState([]); // For the second table
    const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const goBack = () => {
    window.history.back(); // Go to the previous page in browser history
  };
  const [filteringText1, setFilteringText1] = useState("");
  const [filteringText2, setFilteringText2] = useState("");



  return (
    <ContentLayout
      headerVariant="high-contrast"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Setting", href: "/app/settings" },
            { text: "User Management", href: "/app/settings/usermanagement" },
            { text: "Create Group", href: "#" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={<Header variant="h1">Create New Group</Header>}
    >
      <SpaceBetween size="m">
        <Container>
          <SpaceBetween size="xs">
            <Box>
              <Box float="left">
                <Header>New Group</Header>
              </Box>
              <Box float="right">
                <button
                  onClick={goBack} // This will go back to the previous page
                  style={{
                    color: "white",
                    border: "2px solid red",
                    fontWeight: "bold",
                    height: "32px",
                    width: "100px",
                    borderRadius: "16px",
                    background: "red",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                  }}
                >
                  Cancel
                </button>
                <Button
                  variant="primary"
                  onClick={goBack} // Go back on 'Create' button click
                >
                  Create
                </Button>
              </Box>
            </Box>
            <Grid
              gridDefinition={[
                { colspan: { default: 10, xxs: 2 } },
                { colspan: { default: 10, xxs: 8 } },
              ]}
            >
              <b>Group Name:</b>
              <div>
                <FormField>
                  <Input
                    value={groupName}
                    onChange={(event) => setGroupName(event.detail.value)}
                    placeholder="Enter group name"
                  />
                </FormField>
              </div>
            </Grid>

            <Grid
              gridDefinition={[
                { colspan: { default: 10, xxs: 2 } },
                { colspan: { default: 10, xxs: 8 } },
              ]}
            >
              <b>Group Description: </b>
              <div>
                <FormField>
                  <Textarea
                    value={groupDescription}
                    onChange={(event) =>
                      setGroupDescription(event.detail.value)
                    }
                    placeholder="Enter group description"
                    rows={4}
                  />
                </FormField>
              </div>
            </Grid>
          </SpaceBetween>
        </Container>
        <Container>
          <SpaceBetween size="m">
            <Header>Add User To Group</Header>
            <div style={{ width: "18rem" }}>
            <TextFilter
        filteringText={filteringText1}
        filteringPlaceholder="Find resources"
        onChange={({ detail }) => setFilteringText1(detail.filteringText)}
      />
            </div>

            <Table
              renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
                `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
              }
              onSelectionChange={({ detail }) =>
                setSelectedUserItems(detail.selectedItems) // Use the user state
              }
              selectedItems={selectedUserItems} // Use the user state
              ariaLabels={{
                selectionGroupLabel: "Items selection",
                allItemsSelectionLabel: () => "select all",
                itemSelectionLabel: ({ selectedItems }, item) => item.name,
              }}
              columnDefinitions={[
                {
                  id: "username",
                  header: "User Name",
                  cell: (item) => <Link href="#">{item.username}</Link>,
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
                  username: "User 1",
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
              ]}
              loadingText="Loading resources"
              selectionType="multi"
              trackBy="username"
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
            />
          </SpaceBetween>
        </Container>
        <Container>
          <SpaceBetween size="m">
            <Header>Add Roles To Group</Header>
            <div style={{ width: "18rem" }}>
            <TextFilter
        filteringText={filteringText2}
        filteringPlaceholder="Find resources"
        onChange={({ detail }) => setFilteringText2(detail.filteringText)}
      />
            </div>
            <Table
              renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
                `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
              }
              onSelectionChange={({ detail }) =>
                setSelectedRoleItems(detail.selectedItems) // Use the role state
              }
              selectedItems={selectedRoleItems} // Use the role state
              ariaLabels={{
                selectionGroupLabel: "Items selection",
                allItemsSelectionLabel: () => "select all",
                itemSelectionLabel: ({ selectedItems }, item) => item.name,
              }}
              columnDefinitions={[
                {
                  id: "roles",
                  header: "Roles",
                  cell: (item) => item.roles,
                },
                {
                  id: "description",
                  header: "Description",
                  cell: (item) => item.description,
                },
              ]}
              items={[
                {
                  roles: "Adminstrator",
                  description:
                    "The super admin is the highest level of administrative authority with in a system",
                },
                {
                  roles: "Basic User",
                  description: "A Basic User",
                },
                {
                  roles: "HR",
                  description: "Keep Tracking of all the Users",
                },
              ]}
              loadingText="Loading resources"
              selectionType="multi"
              trackBy="roles"
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
            />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default Creategroup;
