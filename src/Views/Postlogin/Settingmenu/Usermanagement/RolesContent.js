import React, { useState } from "react";
import { 
  Button, 
  Header, 
  Container, 
  TextFilter, 
  Table,
  Box,
  ButtonDropdown,
  Modal,
  SpaceBetween,
  Input,
  Select,
} from "@cloudscape-design/components";
import Grid from "@cloudscape-design/components/grid";
import { ContentLayout, BreadcrumbGroup, Textarea} from "@cloudscape-design/components";
import UserManagement from './usermanagement';
import Badge from "@cloudscape-design/components/badge";


const RolesContent = () => {
  const [filterText, setFilterText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
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
      preference: <span style={{ color: "blue", fontWeight: 'bold' }}>view policy</span>,
    },
    {
      role: (
        <>
          Basic User <Badge color="green">Default</Badge>
        </>
      ),
      description: "Can edit content",
      preference: <span style={{ color: "blue", fontWeight: 'bold' }}>view policy</span>,
    },
      { role: "Viewer", description: "Can view content only", preference: <span style={{ color: "blue", fontWeight: 'bold' }}>view policy</span> }
  ];

  const resetForm = () => {
    setRoleName("");          // Clear role name
    setRoleDescription("");   // Clear description
    setSelectedPolicy(null);  // Clear selected policy
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
      console.log("Creating new role:", {
        roleName,
        selectedPolicy
      });
      resetForm(); // Clear form after creating a new role
      setModalVisible(false); // Close modal after creating a new role
    }
  };

  const handleCloseModal = () => {
    resetForm(); // Reset form when closing modal
    setModalVisible(false); // Close modal
  };

  return (
    <ContentLayout
    headerVariant="high-contrast"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Settings", href: "/app/settings" },
            { text: "RBAC", href: "#" }
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={<Header variant="h1">RBAC</Header>}
    >
      <SpaceBetween size="m">
<UserManagement /> 
    <Container>
      <SpaceBetween size="m">
      <Header
        variant="h1"
        actions={<Button variant="primary" onClick={() => setModalVisible(true)}>Create New Role</Button>}
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
          { header: "Role", cell: item => item.role },
          { header: "Description", cell: item => item.description },
          { header: "Preferences", cell: item => item.preference },
          {
            id: "actions",
            header: "Actions",
            cell: (item) => (
              <ButtonDropdown
                items={[
                  { id: "edit", text: "Edit" },
                  { id: "markasinactive", text: "Mark as Inactive" },
                ]}
                ariaLabel="Control instance"
                variant="icon"
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
                setRoleNameInvalid(false); // Remove invalid state on input change
              }}
              placeholder="Enter role name"
              invalid={roleNameInvalid}  // Show invalid state if input is empty
            />
          </Grid>
          <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
            <strong>Description:</strong>
            <Textarea
              value={roleDescription}
              onChange={({ detail }) => {
                setRoleDescription(detail.value);
                setRoleDescriptionInvalid(false); // Remove invalid state on input change
              }}
              placeholder="Enter description"
            />
          </Grid>
          <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
            <strong>Add Policy:</strong>
            <Select
              selectedOption={selectedPolicy}
              onChange={({ detail }) => {
                setSelectedPolicy(detail.selectedOption);
                setPolicyInvalid(false); // Remove invalid state on selection change
              }}
              options={[
                { label: "View Policy", value: "view-policy" },
                { label: "Edit Policy", value: "edit-policy" },
                { label: "Admin Policy", value: "admin-policy" }
              ]}
              placeholder="Select a policy"
              invalid={policyInvalid}  // Show invalid state if no policy is selected
            />
          </Grid>
          <Box>
            <button
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
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <Box float="right">
              <Button variant="primary" onClick={handleCreateNewUser}>
                Create
              </Button>
            </Box>
          </Box>
        </SpaceBetween>
      </Modal>
      </SpaceBetween>
    </Container>
    </SpaceBetween>
    </ContentLayout>
  );
};

export default RolesContent;
