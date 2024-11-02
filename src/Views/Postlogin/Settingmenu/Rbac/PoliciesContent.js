import React, { useState } from 'react';
import { Container, Header, Box, Button, TextFilter, SpaceBetween } from "@cloudscape-design/components";
import Checkbox from "@cloudscape-design/components/checkbox";
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import { ContentLayout, BreadcrumbGroup } from "@cloudscape-design/components";
import Alloptions from './alloptions';

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
      <SpaceBetween size='m'>
        <Alloptions /> 

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

            {/* Expandable Section with Checkboxes */}
            <ExpandableSection
      expanded
      variant="container"
      headerText="Additional configuration"
    >
              <SpaceBetween size="m" direction="vertical">
                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy1(detail.checked)}
                  checked={checkedPolicy1}
                >
                  <strong>All Access</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy2(detail.checked)}
                  checked={checkedPolicy2}
                >
                  <strong>Procurement</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy3(detail.checked)}
                  checked={checkedPolicy3}
                >
                  <strong>Inventory</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy4(detail.checked)}
                  checked={checkedPolicy4}
                >
                  <strong>E-Commerce</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy5(detail.checked)}
                  checked={checkedPolicy5}
                >
                  <strong>Buyer</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy6(detail.checked)}
                  checked={checkedPolicy6}
                >
                  <strong>Packer</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy7(detail.checked)}
                  checked={checkedPolicy7}
                >
                  <strong>Rider</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy8(detail.checked)}
                  checked={checkedPolicy8}
                >
                  <strong>Policy Access 3</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy9(detail.checked)}
                  checked={checkedPolicy9}
                >
                  <strong>Policy Access 4</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy10(detail.checked)}
                  checked={checkedPolicy10}
                >
                  <strong>Policy Access 5</strong>
                </Checkbox>

                <Checkbox
                  onChange={({ detail }) => setCheckedPolicy11(detail.checked)}
                  checked={checkedPolicy11}
                >
                  <strong>Policy Access 6</strong>
                </Checkbox>
              </SpaceBetween>
            </ExpandableSection>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default PoliciesContent;
