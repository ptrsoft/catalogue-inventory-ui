import React, { useState } from 'react';
import { Container, Header, Box, Button, TextFilter, SpaceBetween } from "@cloudscape-design/components";
import Checkbox from "@cloudscape-design/components/checkbox";
import UserManagement from './usermanagement';
import { ContentLayout, BreadcrumbGroup } from "@cloudscape-design/components";


const PoliciesContent = () => {
  const [filterText, setFilterText] = useState("");
  const [checkedPolicy1, setCheckedPolicy1] = useState(false);
  const [checkedPolicy2, setCheckedPolicy2] = useState(false);
  const [checkedPolicy3, setCheckedPolicy3] = useState(false);
  const [checkedPolicy4, setCheckedPolicy4] = useState(false);
  const [checkedPolicy5, setCheckedPolicy5] = useState(false);
  const [checkedPolicy6, setCheckedPolicy6] = useState(false);
  const [checkedPolicy7, setCheckedPolicy7] = useState(false);
  const [checkedPolicy8, setCheckedPolicy8] = useState(false);
  const [checkedPolicy9, setCheckedPolicy9] = useState(false);
  const [checkedPolicy10, setCheckedPolicy10] = useState(false);
  const [checkedPolicy11, setCheckedPolicy11] = useState(false);

  // State to track the expansion/collapse of checkboxes
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the expansion state
  const toggleExpansion = () => {
    setIsExpanded(prevState => !prevState);
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
      <SpaceBetween size='m'><UserManagement /> 


    <Container
      header={
        <Header
          variant="h2"
          actions={
            <Box float="right">
              <Button variant="primary">
                Create New Policy
              </Button>
            </Box>
          }
        >
          Policies
        </Header>
      }
    >
      <SpaceBetween size="m">
        {/* Simple Text Filter Input */}
        <div style={{ width: "18rem" }}>
          <TextFilter
            filteringText={filterText}
            onChange={({ detail }) => setFilterText(detail.filteringText)}
            filteringPlaceholder="Search Policy"
          />
        </div>

        {/* All Access Checkbox with button to expand/collapse other checkboxes */}
        <SpaceBetween size="m" direction="horizontal">
          <Checkbox
            onChange={({ detail }) => setCheckedPolicy1(detail.checked)}
            checked={checkedPolicy1}
          >
            <strong>All Access</strong>
          </Checkbox>
          <Button
            iconName={isExpanded ? "angle-down" : "angle-right"}
            variant="icon"
            onClick={toggleExpansion} // Toggle on button click
          />
        </SpaceBetween>

        {/* Other Checkboxes (shown only if expanded) */}
        {isExpanded && (
          <>
            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy2(detail.checked)}
                checked={checkedPolicy2}
              >
                <strong>Procurement</strong>
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy3(detail.checked)}
                checked={checkedPolicy3}
              >
                <strong>Inventory</strong>
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy4(detail.checked)}
                checked={checkedPolicy4}
              >
                <strong>E-Commerce</strong>
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy5(detail.checked)}
                checked={checkedPolicy5}
              >
                <strong>Buyer</strong>
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy6(detail.checked)}
                checked={checkedPolicy6}
              >
                <strong>Packer</strong>
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy7(detail.checked)}
                checked={checkedPolicy7}
              >
                <strong>Rider</strong>
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy8(detail.checked)}
                checked={checkedPolicy8}
              >
                <strong>Policy Access 3</strong>
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy9(detail.checked)}
                checked={checkedPolicy9}
              >
                <strong>Policy Access 4</strong>
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy10(detail.checked)}
                checked={checkedPolicy10}
              >
                <strong>Policy Access 5</strong>
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal">
              <Checkbox
                onChange={({ detail }) => setCheckedPolicy11(detail.checked)}
                checked={checkedPolicy11}
              >
                <strong>Policy Access 6</strong>
              </Checkbox>
            </SpaceBetween>
          </>
        )}
      </SpaceBetween>
    </Container>
    </SpaceBetween>

    </ContentLayout>

  );
};

export default PoliciesContent;
