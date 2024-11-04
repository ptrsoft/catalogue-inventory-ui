import React, { useState } from "react";
import {
  Button,
  Header,
  Container,
  TextFilter,
  Table,
  Box,
  Modal,
  SpaceBetween,
  Input,
  Select,
  Badge,
  Toggle,
} from "@cloudscape-design/components";
import Grid from "@cloudscape-design/components/grid";
import {
  ContentLayout,
  BreadcrumbGroup,
  Textarea,
} from "@cloudscape-design/components";
import Alloptions from "./alloptions";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const RolesContent = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [filterText, setFilterText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [toggleModalVisible, setToggleModalVisible] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [roleNameInvalid, setRoleNameInvalid] = useState(false);
  const [roleDescriptionInvalid, setRoleDescriptionInvalid] = useState(false);
  const [policyInvalid, setPolicyInvalid] = useState(false);

  const data = [
    {
      role: (
        <>
          Administrative <Badge color="green">Default</Badge>
        </>
      ),
      description: "Has full access to the system",
      preference: (
<span 
          style={{ color: "blue", fontWeight: "bold", cursor: "pointer" }} 
          onClick={() => navigate("/app/settings/rbac/viewpolicy")}
        >
          view policy
        </span>      ),
    },
    {
      role: (
        <>
          Basic User <Badge color="green">Default</Badge>
        </>
      ),
      description: "Can edit content",
      preference: (
<span 
          style={{ color: "blue", fontWeight: "bold", cursor: "pointer" }} 
          onClick={() => navigate("/app/settings/rbac/viewpolicy")}
        >
          view policy
        </span>      ),
    },
    {
      role: "Viewer",
      description: "Can view content only",
      preference: (
        <span 
          style={{ color: "blue", fontWeight: "bold", cursor: "pointer" }} 
          onClick={() => navigate("/app/settings/rbac/viewpolicy")}
        >
          view policy
        </span>
      ),
    },
  ];

  const handleToggleChange = () => {
    setToggleModalVisible(true);
  };

  const handleCloseToggleModal = () => {
    setToggleModalVisible(false);
  };

  const resetForm = () => {
    setRoleName("");
    setRoleDescription("");
    setSelectedPolicy(null);
    setRoleNameInvalid(false);
    setRoleDescriptionInvalid(false);
    setPolicyInvalid(false);
  };

  const handleCreateNewUser = () => {
    let isValid = true;
    if (roleName.trim() === "") {
      setRoleNameInvalid(true);
      isValid = false;
    } else {
      setRoleNameInvalid(false);
    }
    if (!selectedPolicy) {
      setPolicyInvalid(true);
      isValid = false;
    } else {
      setPolicyInvalid(false);
    }
    if (isValid) {
      console.log("Creating new role:", { roleName, selectedPolicy });
      resetForm();
      setModalVisible(false);
    }
  };

  const handleCloseModal = () => {
    resetForm();
    setModalVisible(false);
  };

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
        <Container>
          <SpaceBetween size="m">
            <Header
              variant="h2"
              actions={
                <Button variant="primary" onClick={() => setModalVisible(true)}>
                  Create New Role
                </Button>
              }
            >
              Roles
            </Header>
            <div style={{ width: "18rem" }}>
              <TextFilter
                filteringText={filterText}
                onChange={({ detail }) => setFilterText(detail.filteringText)}
                filteringPlaceholder="Search Role"
              />
            </div>
            <Table
              columnDefinitions={[
                { header: "Role", cell: (item) => item.role },
                { header: "Description", cell: (item) => item.description },
                { header: "Preferences", cell: (item) => item.preference },
                {
                  id: "actions",
                  header: "Actions",
                  cell: (item) => (
                    <Toggle
                      onChange={handleToggleChange}
                      ariaLabel="Toggle role status"
                    />
                  ),
                },
              ]}
              items={data}
              variant="borderless"
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No Roles</b>
                  <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                    No roles to display.
                  </Box>
                </Box>
              }
            />
            {/* Confirmation Modal for Toggle */}
            <Modal
              onDismiss={handleCloseToggleModal}
              visible={toggleModalVisible}
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
                    onClick={handleCloseToggleModal}
                  >
                    Cancel
                  </button>

                    <Button
                      variant="primary"
                      onClick={handleCloseToggleModal} // Close the modal
                    >
                      Confirm
                    </Button>
                  </Box>
              </SpaceBetween>
            </Modal>
            {/* New Role Modal */}
            <Modal
              onDismiss={handleCloseModal}
              visible={modalVisible}
              header="New Role"
            >
              <SpaceBetween size="xl">
                <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
                  <strong>Role Name:</strong>
                  <Input
                    value={roleName}
                    onChange={({ detail }) => {
                      setRoleName(detail.value);
                      setRoleNameInvalid(false);
                    }}
                    placeholder="Enter role name"
                    invalid={roleNameInvalid}
                  />
                </Grid>
                <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
                  <span>
                    <strong>Description:</strong>
                    <br></br>
                    <i>-optional</i>
                  </span>

                  <Textarea
                    value={roleDescription}
                    onChange={({ detail }) => {
                      setRoleDescription(detail.value);
                      setRoleDescriptionInvalid(false);
                    }}
                    placeholder="Max. 120 letters"
                  />
                </Grid>
                <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
                  <strong>Add Policy:</strong>
                  <Select
                    selectedOption={selectedPolicy}
                    onChange={({ detail }) => {
                      setSelectedPolicy(detail.selectedOption);
                      setPolicyInvalid(false);
                    }}
                    options={[
                      { label: "View Policy", value: "view-policy" },
                      { label: "Edit Policy", value: "edit-policy" },
                      { label: "Admin Policy", value: "admin-policy" },
                    ]}
                    placeholder="Add Policy to Role"
                    invalid={policyInvalid}
                  />
                </Grid>
                <Box>
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
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>

                    <Button variant="primary" onClick={handleCreateNewUser}>
                      Create{" "}
                    </Button>{" "}
                  </Box>{" "}
                </Box>{" "}
              </SpaceBetween>
            </Modal>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default RolesContent;
