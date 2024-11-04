import React, { useState } from "react";
import {
  ContentLayout,
  BreadcrumbGroup,
  Header,
  Container,
  Box,
  SpaceBetween,
  Button,
} from "@cloudscape-design/components"; // Import required components

const Viewpolicy = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedSubIndex, setExpandedSubIndex] = useState(null);
  const [expandedSubSubIndex, setExpandedSubSubIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
    setExpandedSubIndex(null); // Reset any open sub-items when a new section is opened
    setExpandedSubSubIndex(null); // Reset any open sub-sub-items when a new section is opened
  };

  const toggleSubAccordion = (subIndex) => {
    setExpandedSubIndex(expandedSubIndex === subIndex ? null : subIndex);
    setExpandedSubSubIndex(null); // Reset any open sub-sub-items when a new sub-section is opened
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
            { text: "RBAC", href: "/app/settings/rbac/users" },
            { text: "Default User", href: "#" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={<Header variant="h1">Default User</Header>}
    >
      <SpaceBetween size="m">
        <Container>
          The Super admin is the highest level of administrative authority
          within a system, possessing unparalleled control access to all
          features, settings, and user data. Super admin hold the key to
          managing and overseing the entire infrastructure, making critical
          decisions, and implementing security measures to protect the system
          from unauthorized access and Potential breaches.
        </Container>
        <Container header={<Header variant="h2">Policies</Header>}>
          <SpaceBetween size="m">
            <div>
              {accordionItems.map((item, index) => (
                <Box key={index} padding={{ vertical: "xs" }}>
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
                            <span style={{ flexGrow: 1 }}>{subItem.title}</span>
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

                          {expandedSubIndex === subIndex &&
                            subItem.subItems && (
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

export default Viewpolicy;
