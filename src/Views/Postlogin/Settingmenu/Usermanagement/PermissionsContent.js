import React from 'react';
import { ContentLayout, BreadcrumbGroup, Header, Container, SpaceBetween } from "@cloudscape-design/components";
import UserManagement from './usermanagement';

const PermissionsContent = () => {
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
<Container>hjkh</Container>   
</SpaceBetween>
    </ContentLayout>
  );
};

export default PermissionsContent;
