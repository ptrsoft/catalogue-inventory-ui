import React, { useState } from 'react';
import { Container, Header, Box, Button, SpaceBetween, TextFilter, ColumnLayout } from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import UserManagement from './usermanagement';
import { ContentLayout, BreadcrumbGroup } from "@cloudscape-design/components";
import Badge from "@cloudscape-design/components/badge";
import Icon from "@cloudscape-design/components/icon";

const GroupsContent = () => {
  const navigate = useNavigate();
  const [filteringText, setFilteringText] = useState('');


  const items = [
    {
      name: "Default User",
      description: "This is the first item"
    }  ];

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
      <SpaceBetween size='m'>
<UserManagement /> 

    <Container
      header={
        <Header
          variant="h2"
          actions={
            <Box float="right">
              <Button variant="primary" onClick={() => navigate("/app/settings/usermanagement/creategroup")}>
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
            onChange={({ detail }) => setFilteringText(detail.filteringText)}
          />
        </div>
        <ColumnLayout columns={3} minColumnWidth={200}>
          {items.map((item, index) => (
            <Container key={index}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d3d3d3', marginBottom: '1rem', height: '2rem' }}>
    <div style={{ fontWeight: 'bold', gap: '0.5rem', display: 'flex'}}>
      <p>
        Default User</p>
        
        <Badge color="green">Default</Badge>

      </div>
      <Icon name="edit" style={{ marginLeft: '0.5rem' }} />
    </div>
              <SpaceBetween size='xs'>
              <ColumnLayout columns={2} minColumnWidth={80}>
              <div style={{fontWeight: 'bold'}}>Users:</div>
              <div style={{fontWeight: 'bold'}}>Roles:</div>

              </ColumnLayout>
              <ColumnLayout columns={2} minColumnWidth={80}>
              <div style={{fontSize: "24px", fontWeight: 'bold'}}>12</div>
              <div style={{fontSize: "24px", fontWeight: 'bold'}}>02</div>

              </ColumnLayout>
              <strong>Group Description:</strong>
              <p>Default user is the user which as limited access within a system.</p>
              <div style={{width: '12rem', margin: 'auto', marginTop: '0.5rem'}}>
              <Button variant="primary">View Group Details</Button></div>

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
