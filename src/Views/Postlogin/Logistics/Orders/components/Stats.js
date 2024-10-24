import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Container, ColumnLayout } from '@cloudscape-design/components';
import { fetchOrderStats } from 'Redux-Store/Orders/OrdersThunk'; // Assuming you have this thunk for fetching stats

const Stats = () => {
  const dispatch = useDispatch();
  
  // Select data from the Redux store
  const { orderStats, statsLoading, statsError } = useSelector((state) => state.orderInventory);

  useEffect(() => {
    // Dispatch action to fetch stats when component mounts
    dispatch(fetchOrderStats());
  }, [dispatch]);

  // if (statsLoading) {
  //   return <p>Loading...</p>;
  // }

  // if (statsError) {
  //   return <p>Error: {statsError}</p>;
  // }

  return (
    <Container className="top-container" style={{ marginBottom: "1rem" }}>
      <ColumnLayout columns={5} variant="default" minColumnWidth={150}>
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
            {orderStats?.totalOrderCount || "N/A"}
          </span>
        </div>
        <div>
          <Box variant="awsui-key-label">
            <p style={{ fontSize: 12, fontWeight: "bold" }}>Orders Confirmed</p>
          </Box>
          <span
            style={{
              fontSize: 34,
              fontWeight: "900",
              lineHeight: 1.3,
              color: "#1D4ED8",
            }}
          >
            {orderStats?.confirmedOrderCount || "N/A"}
          </span>
        </div>
        <div>
          <Box variant="awsui-key-label">
            <p style={{ fontSize: 12, fontWeight: "bold" }}>Orders Completed</p>
          </Box>
          <span
            style={{
              fontSize: 34,
              fontWeight: "900",
              lineHeight: 1.3,
              color: "#1D4ED8",
            }}
          >
            {orderStats?.completedOrderCount || "N/A"}
          </span>
        </div>
        <div>
          <Box variant="awsui-key-label">
            <p style={{ fontSize: 12, fontWeight: "bold" }}>Orders Cancelled</p>
          </Box>
          <span
            style={{
              fontSize: 34,
              fontWeight: "900",
              lineHeight: 1.3,
              color: "#D91515",
            }}
          >
            {orderStats?.cancelledOrderCount || "N/A"}
          </span>
        </div>
        <div>
          <Box variant="awsui-key-label">
            <p style={{ fontSize: 12, fontWeight: "bold" }}>Orders Refunded</p>
          </Box>
          <span
            style={{
              fontSize: 34,
              fontWeight: "900",
              lineHeight: 1.3,
              color: "#1D4ED8",
            }}
          >
            {orderStats?.refundedOrderCount || "N/A"}
          </span>
        </div>
      </ColumnLayout>
    </Container>
  );
};

export default Stats;
