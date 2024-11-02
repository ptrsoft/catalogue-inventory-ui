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
  Table,  ColumnLayout,
} from "@cloudscape-design/components";
import TextFilter from "@cloudscape-design/components/text-filter";
import { ContentLayout, BreadcrumbGroup } from "@cloudscape-design/components";

const Createuser = () => {
  const [selectedItems, setSelectedItems] = useState([]);
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
            { text: "RBAC", href: "#" },
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
            submitButton: "Create User0",
          }}
          onNavigate={({ detail }) =>
            setActiveStepIndex(detail.requestedStepIndex)
          }
          activeStepIndex={activeStepIndex}
          allowSkipTo
          steps={[
            {
              title: "User Details",
              content: (
                <ColumnLayout minColumnWidth={170} columns={2}>
                  <FormField label="First Name">
                    <Input />
                  </FormField>
                  <FormField label="Second Name">
                    <Input />
                  </FormField>
                  <FormField
                    label={
                      <span>
                        User Name <i>- optional</i>
                      </span>
                    }
                  >
                    <Input />
                  </FormField>
                  <FormField label="Email Address">
                    <Input />
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
                      <Button variant="primary" href="/app/settings/rbac/creategroup">Create Group</Button>
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
                  <SpaceBetween direction="vertical" size="l">
                    <FormField label="First field">
                      <Input />
                    </FormField>
                    <FormField label="Second field">
                      <Input />
                    </FormField>
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
