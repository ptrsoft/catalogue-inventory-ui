import React, { useState, useEffect } from "react";
import { Modal, Input, Button, SpaceBetween, Box,TextFilter } from "@cloudscape-design/components";
import { fetchUsers,packOrders } from "Redux-Store/Orders/OrdersThunk";
import { useDispatch, useSelector } from "react-redux";

const AssignToPackersModal = ({ isOpen, onClose, onAssign,selectedOrders,showFlashbar,onAssignOrderStatusChange }) => {
  console.log(selectedOrders,"selected orders");

  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
  };
  const [selectedPacker, setSelectedPacker] = useState(null); // State to track selected packer
  // Redux hooks
  const dispatch = useDispatch();
  const [filteringText, setFilteringText] = useState("");
  const { users:packers, statsLoading, statsError } = useSelector((state) => state.orderInventory);
  // const {items:packers,count}=users
  console.log(packers,"packer");
  useEffect(() => {
   
      // Fetch packers data only when the modal is open
      dispatch(fetchUsers({search:filteringText ||""}));
    
  }, [dispatch,filteringText]);
 // Handle selecting a packer
 const handlePackerSelect = (packer) => {

  setSelectedPacker(packer);

};
console.log(selectedPacker,"selected packer and order" ,selectedOrders);
  // Handle assigning orders and reset states
  const handleAssignOrders = async () => {
    if (selectedPacker) {
      const requestBody = selectedOrders.map((order) => ({
        orderId: order.id,
        packerId: selectedPacker.id,
      }));
  
      try {
        await dispatch(packOrders(requestBody)).unwrap();
        console.log(showFlashbar,"flashbar")
        if (showFlashbar) {
          const message =
          selectedOrders.length > 1
            ? `${selectedOrders.length} orders has been assigned to ${selectedPacker.name} for Packing successfully!`
            : `${selectedOrders.length} order has been assigned to ${selectedPacker.name} for Packing successfully!`
          showFlashbar({
            type: "success",
            message,
          });
        }
        onAssign(selectedOrders);
        setSelectedPacker(null);
        onClose();
            // Call the parent handler to update the state
            const orderIds = selectedOrders.map(order => order.id);
    if (onAssignOrderStatusChange) {
      onAssignOrderStatusChange(orderIds);
    }
      } catch (error) {
        if (showFlashbar) {
          showFlashbar({
            type: "error",
            message: `Failed to assign orders. Please try again.Because of ${error}`,
          });
        }
        console.error("Error assigning orders:", error);
      }
    }
  };
  
  

  return (
    <Modal
      size="medium"
      onDismiss={onClose}
      visible={isOpen}
      header="Assign To Packers"
      footer={
        <Box float="right">
          <Button
            variant="primary"
            disabled={!selectedPacker} // Disable button if no packer is selected
            onClick={handleAssignOrders} // Assign orders and reset states
          >
            Assign Orders
          </Button>
        </Box>
      }
    >
      <SpaceBetween direction="vertical" size="m">
    
          <>
             <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Search Packer By name"
            filteringAriaLabel="Filter instances"
            onChange={handleSearchChange}
          />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                maxHeight: "215px", // Limit height to show only 3 items (50px each as an example)
                overflowY: "auto", // Enable vertical scrolling
              }}
            >
              {packers?.items?.map((packer) => (
                <div
                  className="runsheet-container"
                  key={packer.id}
                  style={{
                    margin: "10px",
                    padding: "10px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: selectedPacker?.id === packer.id ? "#e0f7fa" : "transparent", // Highlight selected packer
                    cursor: "pointer",
                  }}
                  onClick={() => handlePackerSelect(packer)} // Select the packer on click
                >
                  {/* <img
                    src="https://via.placeholder.com/40"
                    alt="Packer avatar"
                    style={{ borderRadius: "50%" }}
                  /> */}
                  <Box>
                    <div style={{ fontWeight: "bold" }}>{packer.name}</div>
                    <div>{packer.email}</div>
                  </Box>
                </div>
              ))}
            </div>
          </>
   
      </SpaceBetween>
    </Modal>
  );
};

export default AssignToPackersModal;
