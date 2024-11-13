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
  TextContent,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPincodes,
  updateDeliveryType,
  updateStatus,
} from "Redux-Store/Pincode/pincodeThunk"; // Assuming you have imported the thunk

function PincodeList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedPincode, setSelectedPincode] = useState(null); // Store selected pincode for modal
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 15;
  // Track the status to update
  // Get pincodes data from Redux store
  const {
    data: pincodes,
    loading,
    error,
  } = useSelector((state) => state.pincode);
  console.log(pincodes);

  // Fetch pincodes on component mount
  useEffect(() => {
    dispatch(getPincodes({ search: searchQuery })); // Fetch pincodes from the API
  }, [dispatch, searchQuery]);

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
    const selectedPincodeData = pincodes?.items.find(
      (p) => p.pincode === selectedCodes[0]
    );
    setSelectedPincode(selectedPincodeData);

    setIsModalOpen(true);
  };

  // Open modal for updating status
  const handleConvertStatusClick = () => {
    const selectedPincodeData = pincodes?.items.find((p) =>
      selectedCodes.includes(p.pincode)
    );
    setSelectedPincode(selectedPincodeData);
    const oppositeStatus = selectedPincodeData?.active === true ? false : true;
    setStatusToUpdate(oppositeStatus);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPincode(null);
    setStatusToUpdate(null);
    setSelectedCodes([]);
  };

  // Confirm the action and dispatch updateDeliveryType
  const confirmConvertDeliveryType = () => {
    const oppositeType =
      selectedPincode.deliveryType === "same day" ? "next day" : "same day";
    dispatch(
      updateDeliveryType({
        type: oppositeType,
        pincodes: selectedCodes,
      })
    );
    setIsModalOpen(false); // Close modal after confirming
    setSelectedPincode(null);
    setStatusToUpdate(null);
    setSelectedCodes([]); // Unselect all selected cards after confirming
  };

  // Confirm status update
  const confirmUpdateStatus = () => {
    if (selectedCodes.length > 0 && selectedPincode) {
      dispatch(
        updateStatus({
          status: statusToUpdate,
          pincodes: selectedCodes,
        })
      );
      setIsModalOpen(false);
      setSelectedPincode(null);
      setStatusToUpdate("");
      setSelectedCodes([]); // Unselect all selected cards after confirming
    }
  };
  const handleViewPincode = (pincodes) => {
    console.log(pincodes, "pincode values");
    navigate("/app/inventory/pincodes/viewpincode", { state: { pincodes } });
  };

  const handleSearchChange = ({ detail }) => {
    setSearchQuery(detail.filteringText);
    // setCurrentPage(1); // Reset page to 1 when filters change
  };
  const totalPages = Math.ceil((pincodes?.items.length || 0) / ITEMS_PER_PAGE);
  const currentItems = pincodes?.items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          <span style={{ fontWeight: "bolder" }}>Pincodes</span>
        </Header>
        <Grid
          gridDefinition={[
            { colspan: 5 },
            { colspan: 2 },
            { colspan: 2 },
            { colspan: 3 },
          ]}
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
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
          />
          <Select
            placeholder="Delivery Type"
            selectedOption={deliveryTypeFilter}
            onChange={({ detail }) =>
              setDeliveryTypeFilter(detail.selectedOption)
            }
            options={[
              { label: "Same Day Delivery", value: "same day" },
              { label: "Next Day Delivery", value: "next day" },
            ]}
          />
          <Box float="right">
            <Pagination
              currentPageIndex={currentPage}
              pagesCount={totalPages}
              onChange={(event) =>
                setCurrentPage(event.detail.currentPageIndex)
              }
            />
          </Box>
        </Grid>

        <ColumnLayout columns={3}>
          {pincodes?.items.map((pincode) => (
            <div className="runsheet-container" key={pincode.pincode}>
              <Header
                // variant="h2"
                actions={
                  <Checkbox
                    checked={selectedCodes.includes(pincode.pincode)}
                    onChange={() => handleSelect(pincode.pincode)}
                  />
                }
              >
                <div
                  onClick={() => handleViewPincode(pincode)}
                  style={{
                    cursor: "pointer",
                    color: "#0972D3",

                    fontSize: "20px",
                    fontWeight: "bolder",
                  }}
                >
                  {pincode.pincode}
                </div>
              </Header>

              <ColumnLayout minColumnWidth={20} columns={2}>
                <Box>
                  <strong>Status</strong>
                  <div>
                    {pincode.active === true ? (
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
                  <p>
                    {pincode.shifts?.length}{" "}
                    {pincode.shifts?.length === 1 ? "Shift" : "Shifts"}
                  </p>
                </Box>

                <Box>
                  <strong>Slots</strong>
                  <p>
                    {pincode.shifts?.reduce(
                      (total, shift) => total + (shift.slots?.length || 0),
                      0
                    )}{" "}
                    {pincode.shifts?.reduce(
                      (total, shift) => total + (shift.slots?.length || 0),
                      0
                    ) === 1
                      ? "Slot"
                      : "Slots"}
                  </p>
                </Box>
              </ColumnLayout>
            </div>
          ))}
        </ColumnLayout>

        {/* Modal for confirming status or delivery type change */}
        <Modal
          visible={isModalOpen}
          onDismiss={closeModal}
          header={`Confirm ${
            statusToUpdate ? "Status" : "Delivery Type"
          } Change`}
          footer={
            <Box>
              <Button variant="link" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={
                  statusToUpdate !== null
                    ? confirmUpdateStatus
                    : confirmConvertDeliveryType
                }
              >
                Confirm
              </Button>
            </Box>
          }
        >
          <TextContent>
            <p>
              {statusToUpdate !== null
                ? `Are you sure you want to change the status of the selected pincodes to ${
                    statusToUpdate ? "active" : "inactive"
                  }?`
                : `Are you sure you want to change the delivery type of the selected pincodes to ${
                    selectedPincode?.deliveryType === "same day"
                      ? "Next Day"
                      : "Same Day"
                  } service?`}
            </p>
          </TextContent>
        </Modal>
      </SpaceBetween>
    </Box>
  );
}

export default PincodeList;
