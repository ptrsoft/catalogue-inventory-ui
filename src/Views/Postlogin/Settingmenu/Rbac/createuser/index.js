import React, { useState } from "react";
import Wizard from "@cloudscape-design/components/wizard";
import {
  Header,
  Container,
  SpaceBetween,
  Input,
  FormField,
  Button,
  Box,
  Table,
  ColumnLayout,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import TextFilter from "@cloudscape-design/components/text-filter";
import { ContentLayout, BreadcrumbGroup } from "@cloudscape-design/components";
import Grid from "@cloudscape-design/components/grid";

const Createuser = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItems1, setSelectedItems1] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  
  const [roleFilteringText, setRoleFilteringText] = useState("");
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  return (
    <ContentLayout
      headerVariant="high-contrast"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Settings", href: "/app/settings" },
            { text: "RBAC", href: "/app/settings/rbac/users" },
            { text: "New user", href: "#" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={<Header variant="h1">RBAC</Header>}
    >
      <Container>
        <Wizard
          i18nStrings={{
            stepNumberLabel: (stepNumber) => `Step ${stepNumber}`,
            collapsedStepsLabel: (stepNumber, stepsCount) =>
              `Step ${stepNumber} of ${stepsCount}`,
            skipToButtonLabel: (step) => `Skip to ${step.title}`,
            navigationAriaLabel: "Steps",
            cancelButton: "Cancel",
            previousButton: "Previous",
            nextButton: "Next",
            submitButton: "Create User",
          }}
          onNavigate={({ detail }) =>
            setActiveStepIndex(detail.requestedStepIndex)
          }
          onCancel={() => navigate("/app/settings/rbac/users")} // Navigate on cancel
          activeStepIndex={activeStepIndex}
          allowSkipTo
          steps={[
            {
              title: "User Details",
              content: (
                <ColumnLayout minColumnWidth={170} columns={2}>
                 <FormField label="First Name">
  <Input
    value={firstName} // Assuming you have a state variable for first name
    onChange={({ detail }) => setFirstName(detail.value)} // Handle change
  />
</FormField>
<FormField label="Second Name">
  <Input
    value={secondName} // Assuming you have a state variable for second name
    onChange={({ detail }) => setSecondName(detail.value)} // Handle change
  />
</FormField>
<FormField
  label={
    <span>
      User Name <i>- optional</i>
    </span>
  }
>
  <Input
    value={userName} // Assuming you have a state variable for user name
    onChange={({ detail }) => setUserName(detail.value)} // Handle change
  />
</FormField>
<FormField label="Email Address">
  <Input
    value={email} // Assuming you have a state variable for email
    onChange={({ detail }) => setEmail(detail.value)} // Handle change
  />
</FormField>

                </ColumnLayout>
              ),
            },
            {
              title: "Add User to Group",
              content: (
                <SpaceBetween size="m">
                  <Box>
                    <Box float="left">
                      <div style={{ width: "18rem" }}>
                        <TextFilter
                          filteringText={roleFilteringText}
                          filteringPlaceholder="Search"
                          filteringAriaLabel="Filter roles"
                          onChange={({ detail }) =>
                            setRoleFilteringText(detail.filteringText)
                          }
                        />
                      </div>
                    </Box>
                    <Box float="right">
                      <Button
                        variant="primary"
                        href="/app/settings/rbac/creategroup"
                      >
                        Create Group
                      </Button>
                    </Box>
                  </Box>
                  <Table
                    renderAriaLive={({
                      firstIndex,
                      lastIndex,
                      totalItemsCount,
                    }) =>
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
                        id: "groups",
                        header: "Groups",
                        cell: (item) => item.name,
                      },
                      {
                        id: "attachedpolicies",
                        header: "Attached Policies",
                        cell: (item) => item.description,
                      },
                    ]}
                    items={[
                      {
                        name: "Admin",
                        description: "Multiple",
                      },
                      {
                        name: "Editor",
                        description: "Single",
                      },
                      {
                        name: "Viewer",
                        description: "Single",
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
              ),
            },
            {
              title: "Review and Create",
              content: (
                <SpaceBetween size="m">
                  <Box>
                    <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
                      <div>First Name:</div>
                      <div style={{ fontWeight: "bold" }}>Shaistha samreen</div>
                    </Grid>
                    <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
                      <div>Second Name:</div>
                      <div style={{ fontWeight: "bold" }}>Shaistha samreen</div>
                    </Grid>
                    <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
                      <div>Email Address:</div>
                      <div style={{ fontWeight: "bold" }}>
                        Shaisthasamreen123@gmail.com
                      </div>
                    </Grid>
                  </Box>
                  <Table
                    renderAriaLive={({
                      firstIndex,
                      lastIndex,
                      totalItemsCount,
                    }) =>
                      `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
                    }
                    onSelectionChange={({ detail }) =>
                      setSelectedItems1(detail.selectedItems)
                    }
                    selectedItems={selectedItems1}
                    ariaLabels={{
                      selectionGroupLabel: "Items selection",
                      allItemsSelectionLabel: () => "select all",
                      itemSelectionLabel: ({ selectedItems1 }, item) =>
                        item.name,
                    }}
                    columnDefinitions={[
                      {
                        id: "groups",
                        header: "Groups",
                        cell: (item) => item.name,
                      },
                      {
                        id: "attachedpolicies",
                        header: "Attached Policies",
                        cell: (item) => item.description,
                      },
                    ]}
                    items={[
                      {
                        name: "Admin",
                        description: "Multiple",
                      },
                      {
                        name: "Editor",
                        description: "Single",
                      },
                      {
                        name: "Viewer",
                        description: "Single",
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
              ),
            },
          ]}
        />
      </Container>
    </ContentLayout>
  );
};

export default Createuser;
