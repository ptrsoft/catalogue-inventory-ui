import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Table,
  Button,
  Box,
  Grid,
  Pagination,
  Header,
  TextFilter,
  Flashbar,
  StatusIndicator,
  ContentLayout,
  BreadcrumbGroup,
  SpaceBetween,
  Icon,
  Input,
  Container,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import { cancelOrder, fetchUsersbyid } from "Redux-Store/Orders/OrdersThunk";
import { useMediaQuery } from 'react-responsive';

import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderInventory,
  fetchOrderById,
  updatePaymentStatus
} from "Redux-Store/Orders/OrdersThunk";
//components import
import Stats from "./components/Stats";
import AssignToPackersModal from "./components/AssignToPackerModal";
import Drawer from "./components/Drawer";
import Invoice from "./components/Invoice";
import FilterComponent from "./components/FilterComponent";
import MultipleOrdersCancellation from "./components/MultipleOrderCancellation";

const Orders = () => {
  //declaring states
  const [flashbarItems, setFlashbarItems] = useState([]);
  const [flashMessages, setFlashMessages] = useState([]); // Flash messages for notifications

  const [selectedItems, setSelectedItems] = useState([]); // Track selected orders
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [filteringText, setFilteringText] = React.useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedPages, setFetchedPages] = useState({}); // Store fetched data per page
  const [pagesCount, setPagesCount] = useState(1); // Keep track of total pages
  const [nextKeys, setNextKeys] = useState({}); // Store nextKey per page
  const [isModalOpenForPacker, setIsModalOpenForPacker] = useState(false);
  // getting redux states using useselector
  const { selectedOrder } = useSelector((state) => state.orderInventory);

  const { orders, loading, error } = useSelector(
    (state) => state.orderInventory.orders.data[currentPage] || []
  );
  const { usersbyid } = useSelector((state) => state.orderInventory);
  const [filters, setFilters] = useState({
    category: null,
    statuscategory: { label: "Order Placed", value: "order placed" },
    ageFilter: {
      label: "Today's Orders",
      value: "today",
    },
    shifts: null,
    pincode: null,
  });
  const getFilterKey = useCallback(() => {
    const category = filters?.category?.value || "";
    const statuscategory = filters?.statuscategory?.value || "";
    const ageFilter = filters?.ageFilter?.value || "";
    const shifts = filters?.shifts?.value || "";
    const pincode = filters?.pincode?.value || "";

    return `${category}-${statuscategory}-${ageFilter}-${shifts}-${pincode}-${
      filteringText || ""
    }-${currentPage}`;
  }, [
    filters?.category?.value,
    filters?.statuscategory?.value,
    filters?.ageFilter?.value,
    filters?.shifts?.value,
    filters?.pincode?.value,
    currentPage,
    filteringText,
  ]);

  //using dispatch hitting apis
  const dispatch = useDispatch();

  // Check if device is mobile
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  
  useEffect(() => {
    const pageKey = currentPage === 1 ? undefined : nextKeys[currentPage - 1];
    const filterKey = getFilterKey();

    if (!fetchedPages[filterKey]) {
      dispatch(
        fetchOrderInventory({
          type: filters.category?.value || "",
          status: filters.statuscategory?.value || "",
          date: filters.ageFilter?.value || "",
          shift: filters.shifts?.value || "",
          pincode: filters.pincode?.value || "",
          search: filteringText || "",
          pageKey,
          pageSize: 50,
        })
      )
        .unwrap()
        .then((result) => {
          if (Array.isArray(result.data)) {
            setFetchedPages((prev) => ({
              ...prev,
              [filterKey]: result.data,
            }));

            if (result.nextKey && !nextKeys[currentPage]) {
              setNextKeys((prevKeys) => ({
                ...prevKeys,
                [currentPage]: result.nextKey,
              }));
              setPagesCount((prevCount) => prevCount + 1);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching inventory data:", error);
        });
    }
  }, [
    filters,
    filteringText,
    currentPage,
    fetchedPages,
    nextKeys,
    dispatch,
    getFilterKey,
  ]);

  console.log("Next Keys:", nextKeys);
  // flashbar for assign order to packer
  const showFlashbar = ({ type, message }) => {
    setFlashbarItems((prev) => [
      ...prev,
      {
        type,
        content: message,
        dismissible: true,
        onDismiss: () =>
          setFlashbarItems((items) =>
            items.filter((item) => item.content !== message)
          ),
      },
    ]);

    // Automatically dismiss the flashbar after 3 seconds
    setTimeout(() => {
      setFlashbarItems((items) =>
        items.filter((item) => item.content !== message)
      );
    }, 3000);
  };

  // function for immidiate changes in Ui after Cancelling order
  const handleCancelOrder = (orderId) => {
    const orderIdsArray = Array.isArray(orderId) ? orderId : [orderId];
    const isMultipleOrders = orderIdsArray.length > 1; // Check if it's multiple orders

    // Update the fetchedPages state after canceling an order
    setFetchedPages((prev) => {
      const filterKey = getFilterKey(); // Get the current filter key (e.g., filter by status)

      const updatedPage = prev[filterKey]?.map((order) =>
        // Apply dynamic orderStatus based on whether it's a single order or multiple orders
        orderIdsArray.includes(order.id)
          ? {
              ...order,
              orderStatus: isMultipleOrders ? "order processing" : "cancelled",
            }
          : order
      );

      return {
        ...prev,
        [filterKey]: updatedPage,
      };
    });

    // Optional: If needed, trigger other actions (e.g., API call, flash messages)
  };
  //function for immidiate changes in UI after assigning order
  const handleAssignOrdersStatus = (orderId) => {
    const orderIdsArray = Array.isArray(orderId) ? orderId : [orderId];

    // Update the fetchedPages state after canceling an order
    setFetchedPages((prev) => {
      const filterKey = getFilterKey(); // Get the current filter key (e.g., filter by status)

      const updatedPage = prev[filterKey]?.map((order) =>
        // Apply dynamic orderStatus based on whether it's a single order or multiple orders
        orderIdsArray.includes(order.id)
          ? { ...order, orderStatus: "order processing" }
          : order
      );

      return {
        ...prev,
        [filterKey]: updatedPage,
      };
    });

    // Optional: If needed, trigger other actions (e.g., API call, flash messages)
  };

  // dispatching order by id
  useEffect(() => {
    if (selectedProduct) {
      dispatch(fetchOrderById(selectedProduct)); // Dispatch the thunk to fetch order details
    }
  }, [dispatch, selectedProduct]);

  // dispatching assign order to packer
  useEffect(() => {
    const packerId = selectedOrder?.packerId;
    const riderId = selectedOrder?.riderId;

    if (packerId) {
      dispatch(fetchUsersbyid({ id: packerId }));
    }
    if (riderId) {
      dispatch(fetchUsersbyid({ id: riderId }));
    }
  }, [selectedOrder, dispatch]);
  const handleReasonChange = (orderId, reason) => {
    setSelectedItems((prev) =>
      prev.map(
        (item) => (item.id === orderId ? { ...item, reason } : item) // Update the reason for the selected order
      )
    );
  };

  // for drawer
  const handleOrderClick = (orderId) => {
    setSelectedProduct(orderId);

    setIsDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };
  // for printing bill
  const printRef = useRef([]);
  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
    // setCurrentPage(1); // Reset page to 1 when filters change
  };
  // Handle page changes
  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex); // Update current page
  };
  // difining table columns
  const columns = [
    {
      header: "Order ID",
      cell: (item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleOrderClick(item.id)}
        >
          {item.id}
        </div>
      ),
      width: 250,
      minWidth: 180,
    },
    {
      header: "Order Date",
      cell: (item) => item.orderDate
        ? new Date(item.orderDate).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).replace(/\//g, "-")
        : "N/A"
    },
    { header: "Customer Name", cell: (item) => item.customerName },
    { header: "Items", cell: (item) => item.items },

    {
      header: "Payment Type",
      cell: (item) => (
        <strong
          style={{
            color: item.paymentType === "COD" ? "#414D5C" : item.paymentType === "Prepaid" ? "#1D4ED8" : "black", // Default to black if neither
          }}
        >
          {item.paymentType}
        </strong>
      ),
    },
    {
      header: "Payment Status",
      cell: (item) => (
        <strong
          style={{
            color: item.paymentStatus === "PENDING" 
            ? "#B2911C" 
            : item.paymentStatus === "Paid" 
            ? "#00B207" 
            : item.paymentStatus === "REFUND" 
            ? "red" 
            : "black", // Default to black if none match
                    }}
        >
          {item.paymentStatus}
        </strong>
      ),
    },

    {
      header: "Order Status",
      cell: (item) => {
        // Map order statuses to StatusIndicator types
        const statusMapping = {
          "order processing": { type: "pending", text: "Order Processing" },
          packed: { type: "success", text: "Packed" },
          "on the way": { type: "info", text: "On the Way" },
          delivered: { type: "success", text: "Delivered" },
          undelivered: { type: "warning", text: "undelivered" },
          cancelled: { type: "error", text: "Cancelled" },
          "Request for Cancellation": {
            type: "error",
            text: "Request For Cancellation",
          },
          "order placed": { type: "in-progress", text: "Order Placed" },
        };

        const status = statusMapping[item.orderStatus] || {
          type: "info",
          text: "Unknown Status",
        };

        return (
          <StatusIndicator type={status.type}>{status.text}</StatusIndicator>
        );
      },
    },

    // Conditionally add "Reason" column if filters.statuscategory is "cancelled" and order status is "cancelled" or "undelivered"
    ...(filters?.statuscategory?.value === "cancelled" ||
    filters?.statuscategory?.value === "undelivered" ||
    filters?.statuscategory?.value === "Request for Cancellation"
      ? [
          {
            header: "Reason",
            cell: (item) => {
              if (
                item.orderStatus === "cancelled" ||
                item.orderStatus === "undelivered"
              ) {
                return item?.cancellationData?.cancelReason || "-";
              } else if (item.orderStatus === "Request for Cancellation") {
                // Input field for "Request for Cancellation"
                return (
                  <Input
                    value={
                      selectedItems.find((order) => order.id === item.id)
                        ?.reason || ""
                    }
                    onChange={(e) =>
                      handleReasonChange(item.id, e.detail.value)
                    }
                    placeholder="Enter reason"
                    ariaLabel="Reason input"
                    style={{
                      width: "100%",
                    }}
                  />
                );
              }
              return "-"; // Default fallback
            },
            width: 250,
            minWidth: 180,
          },
        ]
      : []),
    {
      header: "Total Amount",
      cell: (item) => `₹${item.finalTotal}`,
    },

    {
      header: "Delivery Slot Time",
      cell: (item) =>
        `${item?.deliverySlot.startTime}${item?.deliverySlot.startAmPm} To ${item?.deliverySlot.endTime}${item?.deliverySlot.endAmPm}`,
    },
    { header: "Deliver Area", cell: (item) => item.address.address },
  ];

  //function for assigning order to packer
  const handleAssignOrders = () => {
    console.log("Selected orders:", selectedItems);
    setIsModalOpenForPacker(false);
    setSelectedItems([]);
  };
  //its for deseleting the selected items after cancelling multiple
  const handleResetSelectedItems = () => {
    setSelectedItems([]); // Reset selected items
  };
  const handleFilterChange = (newFilters) => {
    console.log("Received filters:", newFilters);
    if (typeof newFilters === "object" && newFilters !== null) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
      }));
    } else {
      console.error("Invalid filters received:", newFilters);
    }
  };
  const navigate = useNavigate();
  const NavigateToRunsheet = () => {
    navigate("/app/Logistics/runsheet/CreateRunSheet", {
      state: { selectedItems },
    });
  };
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  //function of changing payment status 
  const handlePaymentStatusChange = () => {
    if (selectedItems.length === 0) {
      showFlashbar({
        type: "error",
        message: "Please select at least one order to update payment status"
      });
      return;
    }

    // Update payment status for each selected order
    selectedItems.forEach(item => {
      dispatch(updatePaymentStatus({
        orderId: item.id,
        paymentStatus: "PAID"
      }))
        .unwrap()
        .then(() => {
          // Immediately update the UI by modifying the fetchedPages state
          setFetchedPages((prev) => {
            const filterKey = getFilterKey();
            const updatedPage = prev[filterKey]?.map((order) =>
              order.id === item.id
                ? { ...order, paymentStatus: "PAID" }
                : order
            );

            return {
              ...prev,
              [filterKey]: updatedPage,
            };
          });

          showFlashbar({
            type: "success",
            message: `Payment status updated for order ${item.id}`
          });
        })
        .catch(error => {
          showFlashbar({
            type: "error",
            message: `Failed to update payment status for order ${item.id}: ${error.message}`
          });
        });
    });

    // Clear selected items after updating
    setSelectedItems([]);
  };

  // Main content for both mobile and desktop
  const ordersContent = (
    <SpaceBetween direction="vertical" size="xl">
      <Stats />
      <div>
        <Grid
          gridDefinition={[
            { colspan: { default:isMobile ? 10 : 12, xxs: isMobile ? 10 : 4 } },
            { colspan: { default:isMobile ? 2 : 12, xxs: isMobile ? 2 : 2 } },
            { colspan: { default:isMobile ? 12 : 12, xxs: isMobile ? 12 : 6 } },
          ]}
        >
          {/* Search bar */}
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Search"
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
            {/* Sort dropdown */}
     

          <Box float="right">
            <Button 
              variant="primary" 
              onClick={handlePaymentStatusChange} 
              disabled={selectedItems.length === 0}
            >
              {isMobile ? "Update payment status" : "Update Payment Status"}
            </Button>
          </Box>
        </Grid>
        {isOpen && (
          <FilterComponent
            statuscategory={filters.statuscategory}
            ageFilter={filters.ageFilter}
            shifts={filters.shifts}
            category={filters.category}
            pincode={filters.pincode}
            currentPage={currentPage}
            onFilterChange={handleFilterChange}
          />
        )}
      
        {/* Orders table */}
        <div
          className={`orders-container ${
            isDrawerOpen ? "blur-background" : ""
          }`}
        >
          <Table
            header={
              <div style={{marginTop:'10px'}}>
                <Header actions={
                  <Box float="right">
                    <Pagination
                      currentPageIndex={currentPage}
                      onChange={({ detail }) =>
                        handlePageChange(detail.currentPageIndex)
                      }
                      pagesCount={pagesCount}
                    />
                  </Box>
                }>
                  {isMobile ? `Selected: ${selectedItems.length}` : `Total Selected Items: ${selectedItems.length}`}
                </Header>
              </div>
            }
            selectedItems={selectedItems}
            ariaLabels={{
              selectionGroupLabel: "Select orders",
              itemSelectionLabel: (item) => `Select order ${item.id}`,
            }}
            onSelectionChange={({ detail }) =>
              setSelectedItems(detail.selectedItems)
            }
            selectionType="multi"
            renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
              `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
            }
            trackBy="id"
            variant="borderless"
            columnDefinitions={columns}
            items={fetchedPages[getFilterKey()] || []}
            empty={
              <Box
                margin={{ vertical: "xs" }}
                textAlign="center"
                color="inherit"
              >
                <SpaceBetween size="m">
                  <b>No Orders {error}</b>
                </SpaceBetween>
              </Box>
            }
          />
        </div>
      </div>
      <Drawer
        isDrawerOpen={isDrawerOpen}
        selectedProduct={selectedProduct}
        handleCloseDrawer={handleCloseDrawer}
        selectedOrder={selectedOrder}
        error={error}
        usersbyid={usersbyid}
        fetchpages={fetchedPages}
        onCancelOrder={handleCancelOrder}
      />
    </SpaceBetween>
  );

  return (
    isMobile ? (
      <div>
            <SpaceBetween direction="vertical" size="m">

        <Flashbar items={flashbarItems} />
          <BreadcrumbGroup
              items={[
                { text: "Dashboard", href: "/app/Dashboard" },
                // { text: "Logistics", href: "/app/Dashboard" },
                { text: "Orders", href: "#" },
              ]}
              ariaLabel="Breadcrumbs"
            />
        <Header
          variant="h2"
          actions={
            <div style={{display:"flex", gap:"10px", marginBottom:"22px"}}>
              {filters?.statuscategory?.value === "order placed" ? (
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpenForPacker(true)}
                  disabled={selectedItems.length === 0}
                  title="Assign To Packer"
                >
                  {isMobile ? "Assign To Packer" : "Assign To Packer"}
                </Button>
              ) : filters?.statuscategory?.value === "undelivered" ||
                filters?.statuscategory?.value === "packed" ? (
                <Button
                  variant="primary"
                  onClick={NavigateToRunsheet}
                  disabled={selectedItems.length === 0}
                  iconName="file-open"
                  title="Create Runsheet"
                >
                  {isMobile ? "Create Runsheet" : "Create Runsheet"}
                </Button>
              ) : filters?.statuscategory?.value ===
                "Request for Cancellation" ? (
                <MultipleOrdersCancellation
                  onOrdersCancelled={handleResetSelectedItems}
                  selectedItems={selectedItems}
                  cancelOrdersThunk={cancelOrder}
                  dispatch={dispatch}
                  setFlashMessages={setFlashbarItems}
                />
              ) : null}

              <AssignToPackersModal
                isOpen={isModalOpenForPacker}
                onClose={() => setIsModalOpenForPacker(false)}
                onAssign={handleAssignOrders}
                selectedOrders={selectedItems}
                showFlashbar={showFlashbar}
                onAssignOrderStatusChange={handleAssignOrdersStatus}
              />
              
              <div style={{ marginLeft: "10px" }}>
                  <Invoice 
                    printRef={printRef} 
                    flag={'multiple'} 
                    selectedOrder={selectedItems.length > 0 ? selectedItems : selectedOrder} 
                  />
                </div>
            </div>
          }
        >
          <span style={{textDecoration: "underline", textDecorationColor: "#0972D3", textDecorationThickness: "2px", textUnderlineOffset: "6px"}}>Orders</span>
        </Header>
        </SpaceBetween>
        
        {ordersContent}
      </div>
    ) : (
      <ContentLayout
        headerVariant="high-contrast"
        notifications={<Flashbar items={flashbarItems} />}
        breadcrumbs={
          <>
            <BreadcrumbGroup
              items={[
                { text: "Dashboard", href: "/app/Dashboard" },
                { text: "Logistics", href: "/app/Dashboard" },
                { text: "Orders", href: "#" },
              ]}
              ariaLabel="Breadcrumbs"
            />
          </>
        }
        header={
          <Header
            actions={
              <>
                {filters?.statuscategory?.value === "order placed" ? (
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpenForPacker(true)}
                    disabled={selectedItems.length === 0}
                  >
                    Assign To Packer
                  </Button>
                ) : filters?.statuscategory?.value === "undelivered" ||
                  filters?.statuscategory?.value === "packed" ? (
                  <Button
                    variant="primary"
                    onClick={NavigateToRunsheet}
                    disabled={selectedItems.length === 0}
                  >
                    Create Runsheet
                  </Button>
                ) : filters?.statuscategory?.value ===
                  "Request for Cancellation" ? (
                  <MultipleOrdersCancellation
                    onOrdersCancelled={handleResetSelectedItems}
                    selectedItems={selectedItems}
                    cancelOrdersThunk={cancelOrder}
                    dispatch={dispatch}
                    setFlashMessages={setFlashbarItems}
                  />
                ) : null}

                <AssignToPackersModal
                  isOpen={isModalOpenForPacker}
                  onClose={() => setIsModalOpenForPacker(false)}
                  onAssign={handleAssignOrders}
                  selectedOrders={selectedItems}
                  showFlashbar={showFlashbar}
                  onAssignOrderStatusChange={handleAssignOrdersStatus}
                />
                <div style={{ marginLeft: "10px" }}>
                  <Invoice 
                    printRef={printRef} 
                    flag={'multiple'} 
                    selectedOrder={selectedItems.length > 0 ? selectedItems : selectedOrder} 
                  />
                </div>
              </>
            }
            variant="h1"
          >
            Orders
          </Header>
        }
      >
        {ordersContent}
      </ContentLayout>
    )
  );
};

export default Orders;
