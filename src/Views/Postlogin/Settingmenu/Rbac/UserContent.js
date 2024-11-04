import React, { useState } from "react";
import {
  Header,
  Container,
  SpaceBetween,
  Button,
  Box,
  Table,
} from "@cloudscape-design/components";
import { ContentLayout, BreadcrumbGroup } from "@cloudscape-design/components";
import TextFilter from "@cloudscape-design/components/text-filter";
import Toggle from "@cloudscape-design/components/toggle";
import Select from "@cloudscape-design/components/select";
import Modal from "@cloudscape-design/components/modal";
import Badge from "@cloudscape-design/components/badge";
import Alloptions from "./alloptions";
import { useNavigate } from "react-router-dom";

const UsersContent = () => {
  const [selectedOption, setSelectedOption] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userFilteringText, setUserFilteringText] = useState("");
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false); // Modal for user request
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [isStatusChangeModalVisible, setIsStatusChangeModalVisible] =
    useState(false);
  const navigate = useNavigate(); // Initialize navigate

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
        <Container
          header={
            <Header
              variant="h2"
              actions={
                <Box float="right">
                  <SpaceBetween size="s" direction="horizontal">
                    <Modal
                      onDismiss={() => setIsRequestModalVisible(false)}
                      visible={isRequestModalVisible}
                      header="New User Request"
                    >
                      <SpaceBetween direction="vertical" size="m">
                        <Container>
                          Shaisthasamreen786@gmail.com
                          <Box float="right">
                            <button
                              onClick={() => setIsRequestModalVisible(false)}
                              style={{
                                color: "red",
                                border: "2px solid white",
                                fontWeight: "bold",
                                height: "32px",
                                width: "80px",
                                background: "white",
                                cursor: "pointer",
                              }}
                            >
                              Deny
                            </button>
                            <Button
                              variant="primary"
                              onClick={() => setIsRequestModalVisible(false)}
                            >
                              Allow
                            </Button>
                          </Box>
                        </Container>
                      </SpaceBetween>
                    </Modal>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/app/settings/rbac/createuser")} // Navigate to the create user page
                    >
                      Create New User
                    </Button>
                  </SpaceBetween>
                </Box>
              }
            >
              User Management
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="m">
            <SpaceBetween direction="horizontal" size="s">
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
              <Select
                selectedOption={selectedOption}
                placeholder="Select status"
                onChange={({ detail }) =>
                  setSelectedOption(detail.selectedOption)
                }
                options={[
                  { label: "All", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            </SpaceBetween>
            <Table
              columnDefinitions={[
                {
                  id: "username",
                  header: "User Name",
                  cell: (item) => item.username,
                },
                { id: "email", header: "Email", cell: (item) => item.email },
                {
                  id: "logindetails",
                  header: "Login Details",
                  cell: (item) => item.logindetails,
                },
                { id: "groups", header: "Groups", cell: (item) => item.groups },
                {
                  id: "createddate",
                  header: "Created Date",
                  cell: (item) => item.createddate,
                },
                {
                  id: "actions",
                  header: "Actions",
                  cell: (item) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Toggle
                        onChange={({ detail }) => {
                          setIsStatusChangeModalVisible(true); // Show the status change confirmation modal
                          setItemToUpdate(item); // Save the current item for later
                          setIsModalVisible(false); // Ensure the create user modal is closed
                        }}
                        checked={item.status === "Active"}
                      />
                      <span
                        style={{
                          color: item.status === "Active" ? "green" : "red",
                          fontWeight: "bold",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                  ),
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

          <Modal
            onDismiss={() => setIsStatusChangeModalVisible(false)}
            visible={isStatusChangeModalVisible}
            header="Status Change"
          >
            <SpaceBetween size="xxl">
              <Box>Are you sure you want to change the status?</Box>
              <Box float="right">
                <button
                  style={{
                    color: "red",
                    border: "2px solid red",
                    fontWeight: "bold",
                    height: "32px",
                    width: "100px",
                    borderRadius: "16px",
                    background: "white",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                  }}
                  onClick={() => setIsStatusChangeModalVisible(false)}
                >
                  Cancel
                </button>

                <Button
                  variant="primary"
                  onClick={() => {
                    setIsStatusChangeModalVisible(false); // Close the modal
                  }}
                >
                  Confirm
                </Button>
              </Box>
            </SpaceBetween>
          </Modal>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default UsersContent;
