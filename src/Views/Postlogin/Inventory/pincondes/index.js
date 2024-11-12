import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  Header,
  StatusIndicator,
  Pagination,
  BreadcrumbGroup,
  Select,
  SpaceBetween,
  TextFilter,
  ColumnLayout,
  Modal,
  FormField,
  // ButtonFlow,
  TextContent
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPincodes, updateDeliveryType,updateStatus } from "Redux-Store/Pincode/pincodeThunk"; // Assuming you have imported the thunk

function PincodeList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedPincode, setSelectedPincode] = useState(null); // Store selected pincode for modal
  const [statusToUpdate, setStatusToUpdate] = useState(""); // Track the status to update
  // Get pincodes data from Redux store
  const { data: pincodes, loading, error } = useSelector((state) => state.pincode);
  console.log(pincodes);

  // Fetch pincodes on component mount
  useEffect(() => {
    dispatch(getPincodes({search:searchQuery})); // Fetch pincodes from the API
  }, [dispatch,searchQuery]);

  const Addpincode = () => {
    navigate("/app/inventory/pincodes/addpincode");
  };



  // Handle selection of pincode cards
  const handleSelect = (code) => {
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Open modal when clicking the "Convert Delivery Type" button
  const handleConvertDeliveryTypeClick = () => {
    const selectedPincodeData = pincodes?.items.find((p) => p.pincode === selectedCodes[0]);
    setSelectedPincode(selectedPincodeData);

    setIsModalOpen(true);
   
  };

 // Open modal for updating status
 const handleConvertStatusClick = () => {
  const selectedPincodeData = pincodes?.items.find((p) => selectedCodes.includes(p.pincode));
  setSelectedPincode(selectedPincodeData);
  const oppositeStatus = selectedPincodeData?.active === "active" ? "inactive" : "active";
  setStatusToUpdate(oppositeStatus);
  setIsModalOpen(true);

};

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPincode(null);
    setStatusToUpdate("");
    setSelectedCodes([]);
  };

// Confirm the action and dispatch updateDeliveryType
const confirmConvertDeliveryType = () => {
  const oppositeType = selectedPincode.deliveryType === "same day" ? "next day" : "same day";
  dispatch(updateDeliveryType({
    type: oppositeType,
    pincodes: selectedCodes,
  }));
  setIsModalOpen(false); // Close modal after confirming
  setSelectedPincode(null);
  setStatusToUpdate("");
  setSelectedCodes([]); // Unselect all selected cards after confirming
};

// Confirm status update
const confirmUpdateStatus = () => {
  if (selectedCodes.length > 0 && selectedPincode) {
    dispatch(updateStatus({
      status: statusToUpdate,
      pincodes: selectedCodes,
    }));
    setIsModalOpen(false);
    setSelectedPincode(null);
    setStatusToUpdate("");
    setSelectedCodes([]); // Unselect all selected cards after confirming
  }
};
const handleViewPincode = (pincodes) => {
  console.log(pincodes,"pincode values");
  navigate("/app/inventory/pincodes/viewpincode", { state: { pincodes } });
};

const handleSearchChange = ({ detail }) => {
  setSearchQuery(detail.filteringText);
  // setCurrentPage(1); // Reset page to 1 when filters change
};


  return (
    <Box>
      <SpaceBetween direction="vertical" size="m">
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Inventory", href: "/app/dashboard" },
            { text: "Pincodes", href: "#" },
          ]}
        />
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="s">
             <Button
                disabled={selectedCodes.length === 0}
                onClick={handleConvertStatusClick}
              >
                Convert Status
              </Button>
              <Button
                disabled={selectedCodes.length === 0} // Disable if no pincode is selected
                onClick={handleConvertDeliveryTypeClick}
              >
                Convert Delivery Type
              </Button>
              <Button
                variant="primary"
                onClick={Addpincode}
                iconName="add-plus"
              >
                Add Pincode
              </Button>
            </SpaceBetween>
          }
        >
          Pincodes
        </Header>
        <Grid
          gridDefinition={[{ colspan: 5 }, { colspan: 2 }, { colspan: 2 }, { colspan: 3 }]}
        >
          <TextFilter
              filteringText={searchQuery}
              filteringPlaceholder="Search Pincodes"
              filteringAriaLabel="Filter instances"
              onChange={handleSearchChange}
          />
          <Select
            placeholder="Status"
            selectedOption={statusFilter}
            onChange={({ detail }) => setStatusFilter(detail.selectedOption)}
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
          <Select
            placeholder="Delivery Type"
            selectedOption={deliveryTypeFilter}
            onChange={({ detail }) => setDeliveryTypeFilter(detail.selectedOption)}
            options={[
              { label: "Same Day Delivery", value: "same day" },
              { label: "Next Day Delivery", value: "next day" },
            ]}
          />
          <Box float="right">
            <Pagination
              currentPageIndex={1}
              pagesCount={2}
              onChange={(event) =>
                console.log("Page change:", event.detail.currentPageIndex)
              }
            />
          </Box>
        </Grid>

        <ColumnLayout columns={3}>
        {(pincodes?.items || pincodes || []).map((pincode) => (
            <Container
              key={pincode.pincode}
              header={
                <Header
                  variant="h3"
                  actions={
                    <Checkbox
                      checked={selectedCodes.includes(pincode.pincode)}
                      onChange={() => handleSelect(pincode.pincode)}
                    />
                  }
                >
                <div onClick={() => handleViewPincode(pincode)} style={{ cursor: 'pointer' }}>
                    {pincode.pincode}
                  </div>
                </Header>
              }
            >
              <ColumnLayout minColumnWidth={2} disableGutters columns={2}>
                <Box>
                  <strong>Status</strong>
                  <div>
                    {pincode.active === "active" ? (
                      <StatusIndicator type="success">Active</StatusIndicator>
                    ) : (
                      <StatusIndicator type="stopped">Inactive</StatusIndicator>
                    )}
                  </div>
                </Box>
                <Box>
                  <strong>Delivery Type</strong>
                  <p>{pincode.deliveryType}</p>
                </Box>

                <Box>
                  <strong>Shifts</strong>
                  <p>{pincode.shifts?.length} Shift(s)</p>
                </Box>

                <Box>
                  <strong>Slots</strong>
                  <p>
                    {pincode.shifts?.reduce(
                      (total, shift) => total + (shift.slots?.length || 0),
                      0
                    )}{" "}
                    Slot(s)
                  </p>
                </Box>
              </ColumnLayout>
            </Container>
          ))}
        </ColumnLayout>

      {/* Modal for confirming status or delivery type change */}
      <Modal
          visible={isModalOpen}
          onDismiss={closeModal}
          header={`Confirm ${statusToUpdate ? 'Status' : 'Delivery Type'} Change`}
          footer={
            <Box>
              <Button variant="link" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={statusToUpdate ? confirmUpdateStatus : confirmConvertDeliveryType}>
                Confirm
              </Button>
            </Box>
          }
        >
          <TextContent>
            <p>
              {statusToUpdate
                ? `Are you sure you want to change the status of the selected pincode(s) to ${statusToUpdate}?`
                : `Are you sure you want to change the delivery type of the selected pincode(s) to ${
                    selectedPincode?.deliveryType === "same day" ? "Next Day" : "Same Day"
                  }?`}
            </p>
          </TextContent>
        </Modal>
      </SpaceBetween>
    </Box>
  );
}

export default PincodeList;
