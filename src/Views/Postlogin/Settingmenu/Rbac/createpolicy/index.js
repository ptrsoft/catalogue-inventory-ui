import React, { useState } from "react";
import {
  ContentLayout,
  BreadcrumbGroup,
  Header,
  Container,
  Box,
  SpaceBetween,
  Grid,
  FormField,
  Input,
  Textarea,
  Button,
} from "@cloudscape-design/components"; // Import required components
import Checkbox from "@cloudscape-design/components/checkbox"; // Import Checkbox component

const Createpolicy = () => {
  const [policyName, setPolicyName] = useState(""); // Define state for policy name
  const [policyDescription, setPolicyDescription] = useState(""); // Define state for policy description
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedSubIndex, setExpandedSubIndex] = useState(null);
  const [expandedSubSubIndex, setExpandedSubSubIndex] = useState(null);

  const [checkedItems, setCheckedItems] = useState({}); // State to manage checkbox checked status

  const goBack = () => {
    window.history.back(); // Navigates back to the previous page
  };

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setExpandedSubIndex(null); // Reset any open sub-items when a new section is opened
    setExpandedSubSubIndex(null); // Reset any open sub-sub-items when a new section is opened
  };

  const toggleSubAccordion = (subIndex) => {
    setExpandedSubIndex(expandedSubIndex === subIndex ? null : subIndex);
    setExpandedSubSubIndex(null); // Reset any open sub-sub-items when a new sub-section is opened
  };

// Handle checkbox change for main items
const handleCheckboxChange = (index, isChecked) => {
  setCheckedItems((prev) => ({
    ...prev,
    [index]: isChecked,
  }));

  // Check/uncheck all sub-items and sub-sub-items
  const subItems = accordionItems[index]?.subItems;
  if (subItems) {
    subItems.forEach((_, subIndex) => {
      setCheckedItems((prev) => ({
        ...prev,
        [`${index}-${subIndex}`]: isChecked,
      }));

      // Check/uncheck sub-sub-items
      const subSubItems = accordionItems[index].subItems[subIndex]?.subItems;
      if (subSubItems) {
        subSubItems.forEach((_, subSubIndex) => {
          setCheckedItems((prev) => ({
            ...prev,
            [`${index}-${subIndex}-${subSubIndex}`]: isChecked,
          }));
        });
      }
    });
  }
};

// Handle checkbox change for sub-items
const handleSubCheckboxChange = (index, subIndex, isChecked) => {
  setCheckedItems((prev) => ({
    ...prev,
    [`${index}-${subIndex}`]: isChecked,
  }));

  // Check/uncheck all sub-sub-items under the selected sub-item
  const subSubItems = accordionItems[index]?.subItems[subIndex]?.subItems;
  if (subSubItems) {
    subSubItems.forEach((_, subSubIndex) => {
      setCheckedItems((prev) => ({
        ...prev,
        [`${index}-${subIndex}-${subSubIndex}`]: isChecked,
      }));
    });
  }
};

  const accordionItems = [
    {
      title: "All Access",
      subItems: [
        {
          title: "Procurement",
          subItems: [
            {
              title: "Purchase Order",
              content: "Details about Purchase Order",
            },
            {
              title: "Purchase Receiver",
              content: "Details about Purchase Receiver",
            },
          ],
        },
        { title: "Inventory", content: "Description of Inventory access" },
        { title: "Packer", content: "Description of Packer access" },
        { title: "Rider", content: "Description of Rider access" },
      ],
    },
    {
      title: "Minimal Access",
      content: "Description of minimal access policies.",
    },
  ];

  return (
    <ContentLayout
      headerVariant="high-contrast"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Settings", href: "/app/settings" },
            { text: "RBAC", href: "/app/settings/rbac/policies" },
            { text: "Create Policy", href: "#" }, // Reflect the current action
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={<Header variant="h1">Create New Policy</Header>} // Title for the page
    >
      <SpaceBetween size="m">
        <Container>
          <SpaceBetween size="xs">
            <Box>
              <Box float="left">
                <Header>New Policy</Header>
              </Box>
              <Box float="right">
                <button
                  onClick={goBack} // This will go back to the previous page
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
                >
                  Cancel
                </button>
                <Button
                  variant="primary"
                  onClick={goBack} // Go back on 'Create' button click (change this logic as needed)
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
              <b>Policy Name:</b>
              <div>
                <FormField>
                  <Input
                    value={policyName}
                    onChange={(event) => setPolicyName(event.detail.value)}
                    placeholder="Enter Policy Name"
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
              <span>
                <b>Policy Description: </b>
                <br />
                <i>- optional</i>
              </span>

              <div>
                <FormField>
                  <Textarea
                    value={policyDescription}
                    onChange={(event) =>
                      setPolicyDescription(event.detail.value)
                    }
                    placeholder="Max. 120 letters"
                    rows={4}
                  />
                </FormField>
              </div>
            </Grid>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Policies</Header>}>
          <SpaceBetween size="m">
            <div>
              {accordionItems.map((item, index) => (
                <Box key={index} padding={{ vertical: "xs" }}>
                  {/* Main Accordion Item */}
                  <div
                    style={{
                      fontWeight: "bold",
                      borderBottom: "1px solid #ccc",
                      padding: "10px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Checkbox
                      checked={checkedItems[index] || false}
                      onChange={(event) => {
                        handleCheckboxChange(index, event.detail.checked);
                        event.stopPropagation(); // Stop event from bubbling up
                      }}
                    />
                    <span style={{ flexGrow: 1 }}>{item.title}</span>
                    <Button
                      iconName={
                        expandedIndex === index ? "angle-up" : "angle-down"
                      }
                      variant="icon"
                      ariaLabel="Toggle submenu"
                      onClick={() => toggleAccordion(index)}
                    />
                  </div>

                  {/* Display Sub-items if the Main Item is expanded */}
                  {expandedIndex === index && item.subItems && (
                    <Box padding={{ left: "l", vertical: "xs" }}>
                      {item.subItems.map((subItem, subIndex) => (
                        <Box key={subIndex} padding={{ vertical: "xs" }}>
                          <div
                            style={{
                              fontWeight: "normal",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              borderBottom:
                                subIndex === item.subItems.length - 1
                                  ? "1px solid #ccc"
                                  : "none",
                            }}
                          >
                            <p>
                              <Checkbox
                                checked={
                                  checkedItems[`${index}-${subIndex}`] || false
                                }
                                onChange={(event) => {
                                  handleSubCheckboxChange(
                                    index,
                                    subIndex,
                                    event.detail.checked
                                  );
                                  event.stopPropagation();
                                }}
                              />
                            </p>
                            <span style={{ flexGrow: 1 }}>
                              {subItem.title}
                            </span>
                            <Button
                              iconName={
                                expandedSubIndex === subIndex
                                  ? "angle-up"
                                  : "angle-down"
                              }
                              variant="icon"
                              ariaLabel="Toggle submenu"
                              onClick={() => toggleSubAccordion(subIndex)}
                            />
                          </div>

                          {/* Display Sub-Sub-items if the Sub-item is expanded */}
                          {expandedSubIndex === subIndex && subItem.subItems && (
                            <Box padding={{ left: "l", vertical: "xs" }}>
                              {subItem.subItems.map(
                                (subSubItem, subSubIndex) => (
                                  <div
                                    key={subSubIndex}
                                    style={{
                                      padding: "10px 0",
                                      fontWeight: "normal",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                      borderBottom:
                                        subSubIndex ===
                                        subItem.subItems.length - 1
                                          ? "1px solid #ccc"
                                          : "none",
                                    }}
                                  >
                                    <Checkbox
                                      checked={
                                        checkedItems[
                                          `${index}-${subIndex}-${subSubIndex}`
                                        ] || false
                                      }
                                      onChange={(event) => {
                                        setCheckedItems((prev) => ({
                                          ...prev,
                                          [`${index}-${subIndex}-${subSubIndex}`]:
                                            event.detail.checked,
                                        }));
                                        event.stopPropagation();
                                      }}
                                    />
                                    <span>{subSubItem.title}</span>
                                  </div>
                                )
                              )}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </div>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default Createpolicy;
