import React, { useState } from "react";
import {
  Container,
  Header,
  Box,
  Button,
  SpaceBetween,
  TextFilter,
  ColumnLayout,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import Alloptions from "./alloptions";
import { ContentLayout, BreadcrumbGroup } from "@cloudscape-design/components";
import Badge from "@cloudscape-design/components/badge";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";

const GroupsContent = () => {
  const navigate = useNavigate();
  const [filteringText, setFilteringText] = useState("");
  const items = [
    {
      name: "Default User",
      description: "This is the first item",
    },
    {
      name: "Default User",
      description: "This is the first item",
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
                    onClick={() =>
                      navigate("/app/settings/rbac/creategroup")
                    }
                  >
                    Create New Group
                  </Button>
                </Box>
              }
            >
              Groups
            </Header>
          }
        >
          <SpaceBetween size="l" direction="vertical">
            <div style={{ width: "18rem" }}>
              <TextFilter
                filteringText={filteringText}
                filteringPlaceholder="Search Group"
                onChange={({ detail }) =>
                  setFilteringText(detail.filteringText)
                }
              />
            </div>
            <ColumnLayout columns={3} minColumnWidth={200}>
              {items.map((item, index) => (
                <Container key={index}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #d3d3d3",
                      marginBottom: "1rem",
                      height: "2rem",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        gap: "0.5rem",
                        display: "flex",
                      }}
                    >
                      <p>Default User</p>
                      <Badge color="green">Default</Badge>
                    </div>

                    {/* Replacing Icon with ButtonDropdown */}
                    <ButtonDropdown
                      items={[
                        { id: "editgroup", text: "Edit Group" },
                        { id: "disable", text: "Disable Group", disabled: true }
                      ]}
                      ariaLabel="Control instance"
                      variant="icon"
                    />
                  </div>
                  <SpaceBetween size="xs">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column", // arrange elements vertically
                          justifyContent: "center",
                          alignItems: "center", // horizontally center the content
                          backgroundColor: "#C6C7F8",
                          height: "5rem",
                          width: "7.5rem",
                          gap: "1rem",
                          borderRadius: "1rem",
                        }}
                      >
                        <h3>Users:</h3>
                        <p style={{ fontSize: "2rem", fontWeight: "900" }}>
                          12
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column", // arrange elements vertically
                          justifyContent: "center",
                          alignItems: "center", // horizontally center the content
                          backgroundColor: "#D3E7F9",
                          height: "5rem",
                          width: "7.5rem",
                          gap: "1rem",
                          borderRadius: "1rem",
                        }}
                      >
                        <h3>Roles:</h3>
                        <p style={{ fontSize: "2rem", fontWeight: "900" }}>
                          12
                        </p>
                      </div>
                    </div>

                    <strong>Group Description:</strong>
                    <p>
                      Default user is the user which as limited access within a
                      system.
                    </p>
                    <div
                      style={{
                        width: "12rem",
                        margin: "auto",
                        marginTop: "0.5rem",
                      }}
                    >
                      <Button
                        variant="primary"
                        onClick={() =>
                          navigate(
                            "/app/settings/rbac/groups/viewgroupdetail"
                          )
                        }
                      >
                        View Group Details
                      </Button>
                    </div>
                  </SpaceBetween>
                </Container>
              ))}
            </ColumnLayout>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default GroupsContent;
