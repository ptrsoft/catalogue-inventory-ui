import React from 'react'
import {ContentLayout,BreadcrumbGroup,Header,Container,ColumnLayout,Box,} from "@cloudscape-design/components"
const PurchaseOrders = () => {
  return (
    <div>   <ContentLayout
    headerVariant="high-contrast"
    defaultPadding
    breadcrumbs={
      <BreadcrumbGroup
        items={[
          { text: "Purchase Order", href: "/app/purchaseOrder" },
          { text: "purchase", href: "#components" },
        ]}
        ariaLabel="Breadcrumbs"
      />
    }
    header={
      <Header
        variant="h1"
      >
        Purchase order
      </Header>
    }
  >
    <Container>
      <ColumnLayout columns={4} variant="default" minColumnWidth={120}>
        <div>
          <Box variant="awsui-key-label">
            <p style={{ fontSize: 12 }}>Today's Orders</p>
          </Box>
          <span
            style={{
              fontSize: 40,
              fontWeight: "1000",
              lineHeight: 1.3,
              color: "#037F0C",
            }}
          >
            1000
          </span>
        </div>
        <div>
          <Box variant="awsui-key-label">
            <p style={{ fontSize: 12 }}>Approved Orders</p>
          </Box>
          <span
            style={{
              fontSize: 40,
              fontWeight: "1000",
              lineHeight: 1.3,
              color: "#602400",
            }}
          >
            800
          </span>
        </div>
        <div>
          <Box variant="awsui-key-label">
            <p style={{ fontSize: 12 }}>Declined Orders</p>
          </Box>
          <span
            style={{
              fontSize: 40,
              fontWeight: "1000",
              lineHeight: 1.3,
              color: "#2EA597",
            }}
          >
            200
          </span>
        </div>
        <div>
          <Box variant="awsui-key-label">
            <p style={{ fontSize: 12 }}>Pending Orders</p>
          </Box>
          <span
            style={{
              fontSize: 40,
              fontWeight: "1000",
              lineHeight: 1.3,
              color: "#56CCF2",
            }}
          >
            100
          </span>
        </div>
        
      </ColumnLayout>
    </Container>
  </ContentLayout>
  
  
  </div>
  )
}

export default PurchaseOrders