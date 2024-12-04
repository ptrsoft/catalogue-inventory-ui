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
} from "@cloudscape-design/components";
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderInventory,
  fetchOrderById,
  fetchUsersbyid,
} from "Redux-Store/Orders/OrdersThunk";
//components import
import Stats from "./components/Stats";
import AssignToPackersModal from "./components/AssignToPackerModal";
import Drawer from "./components/Drawer";
import Invoice from "./components/Invoice";
import FilterComponent from "./components/FilterComponent";

const Orders = () => {
  //declaring states
  const [flashbarItems, setFlashbarItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Track selected orders
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [filteringText, setFilteringText] = React.useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedPages, setFetchedPages] = useState({}); // Store fetched data per page
  const [pagesCount, setPagesCount] = useState(1); // Keep track of total pages
  const [nextKeys, setNextKeys] = useState({}); // Store nextKey per page

  // getting redux states using useselector
  const { selectedOrder } = useSelector((state) => state.orderInventory);

  const { orders, loading, error } = useSelector(
    (state) => state.orderInventory.orders.data[currentPage] || []
  );
  console.log(orders, "orderssss");
  const { usersbyid } = useSelector((state) => state.orderInventory);
  console.log(usersbyid, "user from order");
  const [filters, setFilters] = useState({
    category: null,
    statuscategory: { label: "order placed", value: "order placed" },
    ageFilter: {
      label: "7 Days Old",
      value: "7",
    },
    shifts: null,
  });
  console.log(filters?.category?.value);
  console.log(filters, "filter from order compo");
  const getFilterKey = useCallback(() => {
    const category = filters?.category?.value || "";
    const statuscategory = filters?.statuscategory?.value || "";
    const ageFilter = filters?.ageFilter?.value || "";
    const shifts = filters?.shifts?.value || "";

    return `${category}-${statuscategory}-${ageFilter}-${shifts}-${
      filteringText || ""
    }-${currentPage}`;
  }, [
    filters?.category?.value,
    filters?.statuscategory?.value,
    filters?.ageFilter?.value,
    filters?.shifts?.value,
    currentPage,
    filteringText,
  ]);
 

  //using dispatch hitting apis
  const dispatch = useDispatch();
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

  // function for imidiates changes in Ui after Cancelling order
  const handleCancelOrder = (orderId) => {
    const orderIdsArray = Array.isArray(orderId) ? orderId : [orderId];
    const isMultipleOrders = orderIdsArray.length > 1;  // Check if it's multiple orders
  
    // Update the fetchedPages state after canceling an order
    setFetchedPages((prev) => {
      const filterKey = getFilterKey(); // Get the current filter key (e.g., filter by status)
      
      const updatedPage = prev[filterKey]?.map((order) =>
        // Apply dynamic orderStatus based on whether it's a single order or multiple orders
        orderIdsArray.includes(order.id)
          ? { ...order, orderStatus: isMultipleOrders ? "order processing" : "cancelled" }
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
          ? { ...order, orderStatus: "order processing"  }
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
  const printRef = useRef();

  const handlePrint = () => {
    // Trigger the print
    const printContent = printRef.current;
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(printContent.outerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

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
    { header: "Order Date", cell: (item) => item.orderDate.slice(0, 10) },

    { header: "Customer Name", cell: (item) => item.customerName },
    { header: "Items", cell: (item) => item.items },

    {
      header: "Payment Type",
      cell: (item) => (
        <strong>
          {item.paymentType === "cash" ? (
            "COD"
          ) : (
            <strong style={{ color: "#1D4ED8" }}>Prepaid</strong>
          )}
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
  ...(filters?.statuscategory?.value === 'cancelled' || filters?.statuscategory?.value === 'undelivered' ? [
    {
      header: "Reason",
      cell: (item) => {
        if (item.orderStatus === "cancelled" || item.orderStatus === "undelivered") {
          return item?.cancelReason || item?.cancellationData?.cancelReason;
        }
        return "-"; // or return null if you don't want to show anything
      },
      width: 250,
      minWidth: 180,
    }
  ] : []),


    { header: "Total Amount", cell: (item) => item.totalAmount },
    {
      header: "Delivery Slot Time",
      cell: (item) =>
        `${item?.deliverySlot.startTime} To ${item?.deliverySlot.endTime}`,
    },
    { header: "Deliver Area", cell: (item) => item.area },

  ];

  const [isModalOpenForPacker, setIsModalOpenForPacker] = useState(false);

  const handleAssignOrders = () => {
    console.log("Selected orders:", selectedItems);
    setIsModalOpenForPacker(false);
    setSelectedItems([]);
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
    navigate('/app/Logistics/runsheet/CreateRunSheet', { state: { selectedItems } });
  };

  return (
    <ContentLayout
      headerVariant="high-contrast"
      notifications={<Flashbar items={flashbarItems} />}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/Dashboard" },
            { text: "Logistics", href: "/app/Dashboard" },
            { text: "Orders", href: "#" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      header={
        <Header
          actions={
            <>
          {filters?.statuscategory?.value === 'order placed' ? (
  <Button
    variant="primary"
    onClick={() => setIsModalOpenForPacker(true)}
    disabled={selectedItems.length === 0} // Disable when no items are selected
  >
    Assign To Packer
  </Button>
) : filters?.statuscategory?.value === 'undelivered'|| filters?.statuscategory?.value === 'packed' ? (
  <Button
    variant="primary"
    onClick={NavigateToRunsheet}
    disabled={selectedItems.length === 0} // Disable when no items are selected
  >
    Create Runsheet
  </Button>
) : null}

              <AssignToPackersModal
                isOpen={isModalOpenForPacker}
                onClose={() => setIsModalOpenForPacker(false)}
                onAssign={handleAssignOrders}
                selectedOrders={selectedItems}
                showFlashbar={showFlashbar}
                 // Correctly passed here
                 onAssignOrderStatusChange={handleAssignOrdersStatus}
              />
            </>
          }
          variant="h1"
        >
          Orders
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="xl">
        <Stats />
        <div>
          <Grid
            gridDefinition={[
              { colspan: { default: 12, xxs: 4 } },
              { colspan: { default: 12, xxs: 8 } },
            ]}
          >
            {/* Search bar */}
            <TextFilter
              filteringText={filteringText}
              filteringPlaceholder="Search"
              filteringAriaLabel="Filter instances"
              onChange={handleSearchChange}
            />

            {/* Sort dropdown */}
            <FilterComponent
              statuscategory={filters.statuscategory}
              ageFilter={filters.ageFilter}
              shifts={filters.shifts}
              category={filters.category}
              currentPage={currentPage}
              onFilterChange={handleFilterChange} // Corrected prop name
            />
          </Grid>
          {/* Orders table */}
          <div
            className={`orders-container ${
              isDrawerOpen ? "blur-background" : ""
            }`}
          >
            <Table
              selectedItems={selectedItems}
              ariaLabels={{
                selectionGroupLabel: "Select orders",
                itemSelectionLabel: (item) => `Select order ${item.id}`,
              }}
              onSelectionChange={({ detail }) =>
                setSelectedItems(detail.selectedItems)
              } // Update selected items
              selectionType="multi" // Enable multi-select checkboxes
              renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
                `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
              }
              trackBy="id" // Unique identifier for items
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
              pagination={
                <Box float="right">
                  <Pagination
                    currentPageIndex={currentPage}
                    onChange={({ detail }) =>
                      handlePageChange(detail.currentPageIndex)
                    }
                    pagesCount={pagesCount}
                  />
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
          handlePrint={handlePrint}
          error={error}
          usersbyid={usersbyid}
          fetchpages={fetchedPages}
          onCancelOrder={handleCancelOrder} // Pass handler to child
        
        />
      </SpaceBetween>
      <Invoice printRef={printRef} selectedOrder={selectedOrder} />
    </ContentLayout>
  );
};

export default Orders;

