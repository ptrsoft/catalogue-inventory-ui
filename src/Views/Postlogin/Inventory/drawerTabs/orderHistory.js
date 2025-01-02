import * as React from "react";
import { useSelector } from "react-redux";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Badge from "@cloudscape-design/components/badge"; // Import Badge component

const OrderHistory = () => {
  const orders = useSelector((state) => state.ordersInInventory?.orders?.data);
  

  // Function to determine badge color based on status
  const getBadgeColor = (status) => {
    switch (status) {
      case "Uninvoiced":
      case "Quote":
      case "Fulfilled":
        return "green";
      case "Unfulfilled":
      case "Unpaid":
        return "red";
      default:
        return "grey";
    }
  };

  return (
    <div style={{padding:"20px"}}>
      <Table
        variant="borderless"
        renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
          `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
        }
        columnDefinitions={[
          {
            id: "order_id",
            header: "Order ID",
            cell: (e) => e.order_id,
           
            isRowHeader: true
          },
          {
            id: "status",
            header: "Status",
            cell: (e) => (
              <Badge color={getBadgeColor(e.status)}>{e.status}</Badge>
            ),
          
            sortingField: "status"
          },
          {
            id: "date",
            header: "Date",
            cell: (e) => e.date,
         
            sortingField: "date"
          },
          {
            id: "location",
            header: "Location",
            cell: (e) => e.location,
         
            sortingField: "location"
          },
          {
            id: "quantity",
            header: "Quantity",
            cell: (e) => e.quantity,
           
            sortingField: "quantity"
          },
          {
            id: "subtotal",
            header: "Subtotal",
            cell: (e) => e.subtotal,
        
            sortingField: "subtotal"
          }
        ]}
        enableKeyboardNavigation
        items={orders}
        loadingText="Loading resources"
        resizableColumns
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>No resources</b>
              <Button>Create resource</Button>
            </SpaceBetween>
          </Box>
        }
      />
    </div>
  );
};

export default OrderHistory;
