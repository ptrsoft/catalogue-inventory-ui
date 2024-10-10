import React from 'react';
import { Box,Container,ColumnLayout } from '@cloudscape-design/components';

const Stats = () => {
  return (
    <Container className="top-container" style={{ marginBottom: "1rem" }}>
    <ColumnLayout columns={4} variant="default" minColumnWidth={150}>
      <div>
        <Box variant="awsui-key-label">
          <p style={{ fontSize: 12, fontWeight: "bold" }}>Total Orders</p>
        </Box>
        <span
          style={{
            fontSize: 34,
            fontWeight: "900",
            lineHeight: 1.3,
            color: "#1D4ED8",
          }}
        >
          {/* {orderStatus?.data?.totalOrderCount || "N/A"} */}
          34
        </span>
      </div>
      <div>
        <Box variant="awsui-key-label">
          <p style={{ fontSize: 12, fontWeight: "bold" }}>
            Orders Confirmed
          </p>
        </Box>
        <span
          style={{
            fontSize: 34,
            fontWeight: "900",
            lineHeight: 1.3,
            color: "#1D4ED8",
          }}
        >
          {/* {orderStatus?.data?.confirmedOrderCount} */}
          45
        </span>
      </div>
      <div>
        <Box variant="awsui-key-label">
          <p style={{ fontSize: 12, fontWeight: "bold" }}>
            Orders Completed
          </p>
        </Box>
        <span
          style={{
            fontSize: 34,
            fontWeight: "900",
            lineHeight: 1.3,
            color: "#1D4ED8",
          }}
        >
          {/* {orderStatus?.data?.completedOrderCount}
           */} 34
        </span>
      </div>
  
      <div>
        <Box variant="awsui-key-label">
          <p style={{ fontSize: 12, fontWeight: "bold" }}>
            Orders Cancelled
          </p>
        </Box>
        <span
          style={{
            fontSize: 34,
            fontWeight: "900",
            lineHeight: 1.3,
            color: "#D91515",
          }}
        >
          {/* {orderStatus?.data?.cancelledOrderCount} */}
          30
        </span>
      </div>
   
    </ColumnLayout>
  </Container>

  )
}

export default Stats