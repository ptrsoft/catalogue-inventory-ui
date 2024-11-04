import React, { useState } from "react";
import {
  Container,
  Header,
  Box,
  Button,
  TextFilter,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";

import { ContentLayout, BreadcrumbGroup } from "@cloudscape-design/components";
import Alloptions from "./alloptions";

const PoliciesContent = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [filterText, setFilterText] = useState("");
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

  const toggleSubSubAccordion = (subSubIndex) => {
    setExpandedSubSubIndex(expandedSubSubIndex === subSubIndex ? null : subSubIndex);
  };

  const accordionItems = [
    {
      title: "All Access",
      subItems: [
        {
          title: "Procurement",
          subItems: [
            { title: "Purchase Order", content: "Details about Purchase Order" },
            { title: "Purchase Receiver", content: "Details about Purchase Receiver" },
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
                  <Button
                    variant="primary"
                    onClick={() => navigate("/app/settings/rbac/createpolicy")}
                  >
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
            {/* Text Filter */}
            <div style={{ width: "18rem" }}>
              <TextFilter
                filteringText={filterText}
                onChange={({ detail }) => setFilterText(detail.filteringText)}
                filteringPlaceholder="Search Policy"
              />
            </div>

            {/* Accordion Section */}
            <div>
              {accordionItems.map((item, index) => (
                <Box key={index} padding={{ vertical: "xs" }}>
                  {/* Main Accordion Item */}
                  <div
                    onClick={() => toggleAccordion(index)}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      borderBottom: "1px solid #ccc",
                      padding: "10px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{item.title}</span>
                    <Button
                      iconName={expandedIndex === index ? "angle-up" : "angle-down"}
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
                            onClick={() => toggleSubAccordion(subIndex)}
                            style={{
                              cursor: "pointer",
                              fontWeight: "normal",
                              padding: "5px 0",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderBottom: subIndex === item.subItems.length - 1 ? "1px solid #ccc" : "none", // Only add a border to the last sub-item
                            }}
                          >
                            <span>{subItem.title}</span>
                            <Button
                              iconName={expandedSubIndex === subIndex ? "angle-up" : "angle-down"}
                              variant="icon"
                              ariaLabel="Toggle submenu"
                              onClick={() => toggleSubAccordion(subIndex)}
                            />
                          </div>

                          {/* Display Sub-sub-items if the Sub-item is expanded */}
                          {expandedSubIndex === subIndex && subItem.subItems && (
                            <Box padding={{ left: "m", vertical: "xs" }}>
                              {subItem.subItems.map((subSubItem, subSubIndex) => (
                                <Box key={subSubIndex} padding={{ vertical: "xs" }}>
                                  <div
                                    onClick={() => toggleSubSubAccordion(subSubIndex)}
                                    style={{
                                      cursor: "pointer",
                                      fontWeight: "normal",
                                      padding: "5px 0",
                                      borderBottom: subSubIndex === subItem.subItems.length - 1 ? "1px solid #f0f0f0" : "none", // Only add a border to the last sub-sub-item
                                    }}
                                  >
                                    {subSubItem.title}
                                  </div>

                                  {/* Display content for the sub-sub-item */}
                                  {expandedSubSubIndex === subSubIndex && (
                                    <Box padding={{ left: "l", vertical: "xs" }} color="inherit">
                                      {subSubItem.content}
                                    </Box>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          )}

                          {/* Display content for items without further sub-items */}
                          {expandedSubIndex === subIndex && !subItem.subItems && (
                            <Box padding={{ vertical: "xs" }} color="inherit">
                              {subItem.content}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Display content for items without subItems */}
                  {expandedIndex === index && !item.subItems && (
                    <Box padding={{ vertical: "xs" }} color="inherit">
                      {item.content}
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

export default PoliciesContent;
