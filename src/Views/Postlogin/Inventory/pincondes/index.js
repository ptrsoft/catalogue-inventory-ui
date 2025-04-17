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
  Icon,
  Flashbar,
} from "@cloudscape-design/components";
import { useMediaQuery } from 'react-responsive';

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPincodes,
  updateDeliveryType,
  updateStatus,
} from "Redux-Store/Pincode/pincodeThunk"; // Assuming you have imported the thunk

function PincodeList() {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState({ label: "Active",
    value: true,});
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState({ label: "Same Day Delivery",
    value: "same day",});
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedPincode, setSelectedPincode] = useState(null); // Store selected pincode for modal
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [flashMessages, setFlashMessages] = useState([]); // State for flashbar messages

  const ITEMS_PER_PAGE = 50;
  // Track the status to update
  // Get pincodes data from Redux store
  const {
    data: pincodes,
    loading,
    error,
  } = useSelector((state) => state.pincode);
  console.log(pincodes,'pincodes from pincode');

  // Fetch pincodes on component mount
  useEffect(() => {
    console.log(statusFilter?.value,"status");
    dispatch(getPincodes({ search: searchQuery ,status: statusFilter?.value === true || statusFilter?.value === false ? statusFilter.value : "", type:deliveryTypeFilter?.value ||""})); // Fetch pincodes from the API
  }, [dispatch, searchQuery,statusFilter,deliveryTypeFilter]);

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
        deliveryTypes: [oppositeType],
        pincodes: selectedCodes,
      })
    )
    .unwrap()
    .then(() => {
      // Show success message
      setFlashMessages([
        {
          type: "success",
          content: `Delivery type updated to ${oppositeType} successfully`,
          dismissible: true,
          onDismiss: () => setFlashMessages([]),
        },
      ]);
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setFlashMessages([]);
      }, 3000);
      
      // Refresh the data
      dispatch(getPincodes({ 
        search: searchQuery, 
        status: statusFilter?.value === true || statusFilter?.value === false ? statusFilter.value : "", 
        type: deliveryTypeFilter?.value || "" 
      }));
      
      setIsModalOpen(false); // Close modal after confirming
      setSelectedPincode(null);
      setStatusToUpdate(null);
      setSelectedCodes([]); // Unselect all selected cards after confirming
    })
    .catch((error) => {
      // Show error message
      setFlashMessages([
        {
          type: "error",
          content: `Failed to update delivery type: "${error.message || error}" .Change Delivery Type From Edit`,
          dismissible: true,
          onDismiss: () => setFlashMessages([]),
        },
      ]);
    });
  };

  // Confirm status update
  const confirmUpdateStatus = () => {
    if (selectedCodes.length > 0 && selectedPincode) {
      dispatch(
        updateStatus({
          status: statusToUpdate,
          pincodes: selectedCodes,
        })
      )
      .unwrap()
      .then(() => {
        // Show success message
        setFlashMessages([
          {
            type: "success",
            content: `Status updated to ${statusToUpdate ? "active" : "inactive"} successfully`,
            dismissible: true,
            onDismiss: () => setFlashMessages([]),
          },
        ]);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
          setFlashMessages([]);
        }, 3000);
        
        // Refresh the data
        dispatch(getPincodes({ 
          search: searchQuery, 
          status: statusFilter?.value === true || statusFilter?.value === false ? statusFilter.value : "", 
          type: deliveryTypeFilter?.value || "" 
        }));
        
        setIsModalOpen(false);
        setSelectedPincode(null);
        setStatusToUpdate(null);
        setSelectedCodes([]); // Unselect all selected cards after confirming
      })
      .catch((error) => {
        // Show error message
        setFlashMessages([
          {
            type: "error",
            content: `Failed to update status: ${error.message || error}`,
            dismissible: true,
            onDismiss: () => setFlashMessages([]),
          },
        ]);
      });
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

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box>
      <SpaceBetween direction="vertical" size="m">
        {/* Flashbar for notifications */}
        {flashMessages.length > 0 && (
          <Flashbar items={flashMessages} />
        )}
        
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            // { text: "Inventory", href: "/app/dashboard" },
            { text: "Pincodes", href: "#" },
          ]}
        />
        <Header
          variant="h1"
          actions={
            isMobile && (
              <Button
                variant="primary"
                onClick={Addpincode}
                iconName="add-plus"
              >
                Add Pincode
              </Button>
            ) 
          
            
          }
        >
          <span style={{textDecoration: "underline", textDecorationColor: "#0972D3", textDecorationThickness: "2px", textUnderlineOffset: "6px"}}>Pincodes</span>
          </Header>
        {isMobile && (
          <Box float="right">
        <SpaceBetween direction="horizontal" size="s">
                <Button
                  disabled={selectedCodes.length === 0}
                  onClick={handleConvertStatusClick}
                >
                  Mark
                </Button>
                <Button
                  disabled={selectedCodes.length === 0} // Disable if no pincode is selected
                  onClick={handleConvertDeliveryTypeClick}
                >
                  Delivery Type
                </Button>

                </SpaceBetween>
                </Box>
        )}
        <Grid
          gridDefinition={[
            { colspan: { default: isMobile ? 10 : 12, xxs: isMobile ? 10 : 4 } },
            { colspan: { default: isMobile ? 2 : 12, xxs: isMobile ? 2 : 2 } },
            { colspan: { default: isMobile ? 12 : 12, xxs: isMobile ? 12 : 6 } },
          ]}
        >
          <TextFilter
            filteringText={searchQuery}
            filteringPlaceholder="Search Pincodes"
            filteringAriaLabel="Filter instances"
            onChange={handleSearchChange}
          />
          {/* Filter Toggle */}
          <span
            onClick={toggleFilter}
            style={{
              display: "flex",
              justifyContent: isMobile ? "center" : "space-between",
              alignItems: "center",
              cursor: "pointer",
              border: isMobile ? "2px solid #9BA7B6" : "3px solid #9BA7B6",
              padding: isMobile ? "4px" : "4px 8px",
              borderRadius: "8px",
              backgroundColor: "white",
              width: isMobile ? "32px" : "auto",
              gap: "5px",
            }}
          >
            {isMobile ? (
              <Icon variant="link" name="filter" />
            ) : (
              <>
                <div style={{ display: "flex", gap: "5px" }}>
                  <Icon variant="link" name="filter" />
                  <span
                    style={{
                      fontWeight: "normal", 
                      color: "#9BA7B6",
                      fontStyle: "italic",
                    }}
                  >
                    Filters
                  </span>
                </div>
                <Icon
                  variant="link"
                  name={isOpen ? "caret-up-filled" : "caret-down-filled"}
                />
              </>
            )}
          </span>
          <Box float="right">
            {!isMobile && (
              <SpaceBetween size="xs" direction="horizontal">
                <Button
                  disabled={selectedCodes.length === 0}
                  onClick={handleConvertStatusClick}
                >
                  Mark
                </Button>
                <Button
                  disabled={selectedCodes.length === 0}
                  onClick={handleConvertDeliveryTypeClick}
                >
                  Delivery Type
                </Button>
                <Button
                variant="primary"
                onClick={Addpincode}
                iconName="add-plus"
              >
                Add Pincode
              </Button>
              </SpaceBetween>
             )} 
          </Box>
        </Grid>

        {/* Filter UI that appears when toggle is clicked */}
        {isOpen && (
          <div style={{ marginBottom: "16px" }}>
            <Grid
              gridDefinition={[
                { colspan: { default: 12, xs: 12 } },
                { colspan: { default: 12, xs: 12 } },
              ]}
            >
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
            </Grid>
          </div>
        )}

        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        
        <h3>{pincodes?.items.length} Pincodes</h3>
        <Pagination
        
            currentPageIndex={currentPage}
            pagesCount={totalPages}
            onChange={(event) =>
              setCurrentPage(event.detail.currentPageIndex)
            }
          />
       
        </div>

        <ColumnLayout columns={3}>
          {currentItems?.map((pincode) => (
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
                  <strong>Delivery Types</strong>
                  <p>
  {pincode.deliveryTypes?.map((method, index) => (
    <span key={index}>
      {method}
      {index < pincode.deliveryTypes.length - 1 && ", "}
    </span>
  ))}
</p>

   
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
