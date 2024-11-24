import React, { useState, useEffect } from "react";
import { Modal, Input, Button, SpaceBetween, Box,TextFilter } from "@cloudscape-design/components";
import { fetchUsers } from "Redux-Store/Orders/OrdersThunk";
import { useDispatch, useSelector } from "react-redux";

const AssignToPackersModal = ({ isOpen, onClose, onAssign,selectedOrders }) => {
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
  const handleAssignOrders = () => {
    if (selectedPacker) {
      onAssign(selectedOrders); // Pass selected packer and orders to the parent
      setSelectedPacker(null); // Reset selected packer
      onClose(); // Close the modal after assigning
    }
  };

  return (
    <Modal
      size="medium"
      onDismiss={onClose}
      visible={isOpen}
      header="Assign To Packers"
      footer={
        <SpaceBetween direction="horizontal" size="s">
          <Button
            variant="primary"
            disabled={!selectedPacker} // Disable button if no packer is selected
            onClick={handleAssignOrders} // Assign orders and reset states
          >
            Assign Orders
          </Button>
        </SpaceBetween>
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
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Packer avatar"
                    style={{ borderRadius: "50%" }}
                  />
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
