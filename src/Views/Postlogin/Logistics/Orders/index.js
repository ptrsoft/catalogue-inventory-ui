import React, { useState, useEffect,useRef } from "react";
import {
  Table,
  Button,
  Box,
  Input,
  Grid,
  Pagination,
  Select,
  Header,
  Container,
  TextFilter,
  Modal,
  Textarea,
  Flashbar
} from "@cloudscape-design/components";
import logo from "../../../../assets/images/image.png"

import {
  ContentLayout,
  BreadcrumbGroup,
  SpaceBetween,
} from "@cloudscape-design/components";
import Stats from "./components/Stats";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderInventory,
  fetchOrderById,
  cancelOrder,
} from "Redux-Store/Orders/OrdersThunk";
import AssignToPackersModal from "./components/AssignToPackerModal";

const Orders = () => {
  const [selectedItems, setSelectedItems] = useState([]); // Track selected orders
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null); // Store the order ID to cancel
  const [cancellationReason, setCancellationReason] = useState(""); // State for cancellation reason
  const [flashMessages, setFlashMessages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [ageFilter, setAgeFilter] = useState(  { label: "7 Days Old",
    value: "7",}); // New state for age filter
    
    const [currentPage, setCurrentPage] = useState(1);
    const [fetchedPages, setFetchedPages] = useState({}); // Store fetched data per page
    const [pagesCount, setPagesCount] = useState(1); // Keep track of total pages

    const [nextKeys, setNextKeys] = useState({}); // Store nextKey per page
  // const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [statuscategory, setstatuscategory] = useState(null);

  const [filteringText, setFilteringText] = React.useState("");
    //functions 
      // Get loading, error, and selectedOrder from the Redux store
  const dispatch = useDispatch();
  const { selectedOrder } = useSelector((state) => state.orderInventory);

  const { orders, loading, error, count } = useSelector(
    (state) => state.orderInventory.orders.data[currentPage]||[]
  );
  console.log(orders,"orders");
  // const { data = [] } = orders;
  // console.log(orders,"order for nextkey");
  console.log("Current Page:", currentPage);


  const handleOpenModal = (orderId) => {
    console.log(orderId, "modal");
    setCancelOrderId(orderId); // Set the order ID to cancel
    // console.log(Cancelo,"id from modal");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCancelOrderId(null); // Clear the order ID
    setCancellationReason(""); // Clear the cancellation reason
  };

  const handleCancelOrder = () => {
    if (cancelOrderId) {
      console.log(cancelOrderId, "id");

      // Dispatch the cancel order thunk with order ID and reason
      dispatch(cancelOrder({ orderId: cancelOrderId, reason: cancellationReason }))
        .unwrap() // to handle the response if you're using Redux Thunk
        .then(() => {
          // Show success flashbar when order is successfully canceled (e.g., 200 status)
          setFlashMessages([
            {
              type: "info",
              content: "Order successfully cancel.",
              dismissible: true,
              id: "successCancel",
              onDismiss: () => setFlashMessages([]),
            },
          ]);

          // Automatically dismiss the flash message after 3 seconds
          setTimeout(() => {
            setFlashMessages([]);
          }, 3000);

          handleCloseModal(); 
          if (selectedProduct) {
            dispatch(fetchOrderById(selectedProduct)); // Dispatch the thunk to fetch order details
          }// Close the modal after dispatch
        })
        .catch((error) => {
          // Show an error flashbar if the cancellation fails
          setFlashMessages([
            {
              type: "error",
              content: "Failed to cancel the order. Please try again.",
              dismissible: true,
              id: "errorCancel",
              onDismiss: () => setFlashMessages([]),
            },
          ]);
        });
    }
  };


  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
    // setCurrentPage(1); // Reset page to 1 when filters change
  };
  console.log(filteringText, "search");

  useEffect(() => {
    // Define the pageKey for pagination (undefined for page 1)
    const pageKey = currentPage === 1 ? undefined : nextKeys[currentPage - 1];
    console.log("Page Key for Current Page:", pageKey);
    // Create a unique key for the filter and page combination
    const filterKey = `${category?.value || ""}-${statuscategory?.value || ""}-${filteringText || ""}-${ageFilter?.value || ""}-${currentPage}`;
    
    // Check if the data for the current filter and page combination has already been fetched
    if (!fetchedPages[filterKey]) {
      dispatch(
        fetchOrderInventory({
          type: category?.value || "",
          status: statuscategory?.value || "",
          search: filteringText || "",
          date: ageFilter?.value || "",
          pageKey, 
          pageSize: 50,
        })
      )
      .unwrap()
      .then((result) => {
        console.log("Fetched products for page:", currentPage, result);
  
        if (Array.isArray(result.data)) {
          // Store fetched items for the current page and filters
          setFetchedPages((prev) => ({
            ...prev,
            [filterKey]: result.data,
          }));
  
          // Store nextKey and update pagesCount only if it's new data
          if (result.nextKey && !nextKeys[currentPage]) {
            setNextKeys((prevKeys) => ({
              ...prevKeys,
              [currentPage]: result.nextKey,
            }));
            setPagesCount((prevCount) => prevCount + 1);
          }
        } else {
          console.error("Unexpected data structure:", result.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
    }
  }, [
    dispatch,
    currentPage,
    filteringText,
    category,
    statuscategory,
    ageFilter,
    nextKeys,
    fetchedPages,
  ]);
  console.log("Next Keys:", nextKeys);


      // Handle page changes
      const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex); // Update current page
      };
  useEffect(() => {
    if (selectedProduct) {
      dispatch(fetchOrderById(selectedProduct)); // Dispatch the thunk to fetch order details
    }
  }, [dispatch, selectedProduct]);


  const handleOrderClick = (orderId) => {
    setSelectedProduct(orderId);

    setIsDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };
  const printRef = useRef();






  const handlePrint = () => {
 


      // Trigger the print
      const printContent = printRef.current;
      const WinPrint = window.open('', '', 'width=900,height=650');
      WinPrint.document.write(printContent.outerHTML);
      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();

      // Make the invoice visible again
   
    }

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Order Placed", value: "order placed" },
    { label: "Cancel Orders", value: "cancelled" },
    { label: "Packed", value: "packed" },
    { label: "On The Way", value: "on the way" },
    { label: "Delivered", value: "delivered" },

    // Add other statuses if needed
  ];
  const ageOptions = [
    { label: "7 days old delivered", value: "7" },
    { label: "14 days old delivered", value: "14" },
    { label: "1 month old delivered", value: "1m" },
    { label: "2 months old delivered", value: "2m" },
    { label: "Older", value: "older" },
  ];
  const handleAgeFilterChange = ({ detail }) => {
    setAgeFilter(detail.selectedOption);
    setCurrentPage(1);
  };

  const paymentOptions = [
    { label: "All", value: "" },
    { label: "Cash On Delivery", value: "cash" },
    { label: "Prepaid", value: "online" },
    // Add other statuses if needed
  ];

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
    { header: "Order Status", cell: (item) => item.orderStatus },

    { header: "Total Amount", cell: (item) => item.totalAmount },
    { header: "Deliver Area", cell: (item) => item.area },
  ];



  const handlepaymentChange = ({ detail }) =>{
    setCategory(detail.selectedOption);
  setCurrentPage(1);
  }

  const handlestatusChange = ({ detail }) =>{
    setstatuscategory(detail.selectedOption);
  setCurrentPage(1);
  }

  const [isModalOpenForPacker, setIsModalOpenForPacker] = useState(false);

  const handleAssignOrders = () => {
   
    console.log("Selected orders:", selectedItems);
    setIsModalOpenForPacker(false);
     setSelectedItems([])
  };



  return (
    <ContentLayout
      headerVariant="high-contrast"
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
      
      header={<Header actions={
        <>
        <Button onClick={() => setIsModalOpenForPacker(true)}

disabled={selectedItems.length === 0} // Disable when no items are selected
          >Assign To Packer</Button>
        <AssignToPackersModal
          isOpen={isModalOpenForPacker}
          onClose={() => setIsModalOpenForPacker(false)}
          onAssign={handleAssignOrders}
          selectedOrders={selectedItems}
        />
        </>
      } variant="h1">Orders</Header>}
      
    >
   
      <SpaceBetween direction="vertical" size="xl">
        <Stats />
        {isModalOpen && (
          <Modal
            size="medium"
            visible={isModalOpen}
            onDismiss={handleCloseModal}
            closeAriaLabel="Close"
            header={<Header>Order Cancel Reason</Header>}
          >
            <hr />

            <div>
              {/* Adjusted line-height here */}
              <SpaceBetween direction="vertical" size="s">
                <p style={{ color: "#1D4ED8" }}>
                  <strong>Order ID:</strong>{" "}
                  <b>{selectedOrder?.userInfo?.id}</b>
                </p>
                <p>
                  <strong>{selectedOrder?.userInfo?.name}</strong>{" "}
                  <span
                    style={{
                      backgroundColor: "#4B5563",
                      color: "#FFF",
                      padding: "2px 8px",
                      borderRadius: "5px",
                      fontSize: "12px",
                      marginLeft: "5px",
                    }}
                  >
                    {selectedOrder?.paymentDetails?.method === "cash"
                      ? "COD"
                      : "Prepaid"}
                  </span>
                </p>
                <p>
                  {selectedOrder?.shippingDetails?.address}{" "}
                  {selectedOrder?.shippingDetails?.zipcode}
                </p>
                <p>{selectedOrder?.userInfo?.number}</p>
                <hr />

                {/* Payment and Items on the same line */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>
                    <strong>Payment:</strong>{" "}
                    <b style={{ color: "#1D4ED8" }}>
                      <i>{selectedOrder?.totalPrice}</i>
                    </b>
                  </p>
                  <p>
                    <strong>{selectedOrder?.items?.length} Items</strong>
                  </p>
                </div>

                {/* Reason Textarea */}
                <b>Reason</b>
                <Textarea
                  rows={4} // Use curly braces for numbers
                  value={cancellationReason} // Controlled input
                  onChange={({ detail }) => setCancellationReason(detail.value)} // Capture the reason using Cloudscape's `detail.value`
                  placeholder="Enter cancellation reason"
                  ariaLabel="Cancellation reason"
                  style={{ width: "100%", marginBottom: "1rem" }} // Inline styles
                />

                {/* Cancel Order Button */}
                <button
                  className="cancel-btn"
                  style={{ float: "right" }}
                  onClick={handleCancelOrder}
                >
                  confirm Cancel
                </button>
              </SpaceBetween>
            </div>
          </Modal>
        )}

        <div>
          <Grid
            gridDefinition={[
              { colspan: { default: 12, xxs: 4 } },
              { colspan: { default: 12, xxs: 2 } },
              { colspan: { default: 12, xxs: 2 } },
              { colspan: { default: 12, xxs: 2 } },
              { colspan: { default: 12, xxs: 2 } },
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
            <Select
              required
              selectedOption={category}
              onChange={handlepaymentChange}
              options={paymentOptions}
              placeholder="Sort By Payment Type"
              selectedAriaLabel="Selected status"
            />
            <Select
              required
              selectedOption={statuscategory}
              onChange={handlestatusChange}
              options={statusOptions}
              placeholder="Sort By Status"
              selectedAriaLabel="Selected status"
            />
                {/* {statuscategory?.value === "delivered" && ( */}
                    {/* Conditionally render age filter */}
              <Select
                required
                selectedOption={ageFilter}
                onChange={handleAgeFilterChange}
                options={ageOptions}
                placeholder="Filter by Delivery Age"
                selectedAriaLabel="Selected age filter"
              />
                 <Select
                required
                // selectedOption={ageFilter}
                // onChange={handleAgeFilterChange}
                // options={ageOptions}
                placeholder="Filter by Delivery Slot"
                selectedAriaLabel="Selected age filter"
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
                onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)} // Update selected items
                selectionType="multi" // Enable multi-select checkboxes
              renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
                `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
              }
              
              trackBy="id" // Unique identifier for items
              variant="borderless"
              columnDefinitions={columns}
               items={fetchedPages[`${category?.value || ""}-${statuscategory?.value || ""}-${filteringText || ""}-${ageFilter?.value || ""}-${currentPage}`] || []}
               empty={
                <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
                  <SpaceBetween size="m">
                    <b>No Orders {loading||error}</b>
                  </SpaceBetween>
                </Box>
              }
              pagination={
                      <Box float="right" margin={{top:"xl"}}>
            <Pagination
      currentPageIndex={currentPage}
      onChange={({ detail }) => handlePageChange(detail.currentPageIndex)}
      pagesCount={pagesCount}
    />
            </Box>

              }
             
            />
          </div>
        </div>

        {isDrawerOpen && selectedProduct && (
          
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              width: "380px",
              backgroundColor: "white",
              boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              overflowY: "auto",
              color: "red",
            }}
          >      {flashMessages.length > 0 && (
            <Flashbar items={flashMessages} />
          )}
            <Box padding="l">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Header variant="h3">Orders Details</Header>

                <Button
                  iconName="close"
                  variant="icon"
                  onClick={handleCloseDrawer}
                />
              </div>
              <hr></hr>
              {/* Order and Customer Info */}
              <div className="items-container">
                <div style={{ marginBottom: "10px" }}>
                  <Container>
                    <div className="product-card">
                      <div className="details">
                        <div className="info-row">
                          <b>Order ID:</b>
                          <span className="value">
                            {selectedOrder?.userInfo?.id}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Customer Name:</span>
                          <span className="value">
                            {selectedOrder?.userInfo?.name}
                            <span
                              style={{
                                backgroundColor: "#4B5563",
                                color: "#FFF",
                                padding: "2px 8px",
                                borderRadius: "5px",
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              {selectedOrder?.paymentDetails?.method === "cash"
                                ? "COD"
                                : "Prepaid"}
                            </span>
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Address:</span>
                          <span className="value">
                            {selectedOrder?.shippingDetails?.address}{" "}
                            {selectedOrder?.shippingDetails?.zipcode}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Contact No:</span>
                          <span className="value">
                            {selectedOrder?.userInfo?.number}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Payment:</span>
                          <span className="value">
                            {selectedOrder?.paymentDetails?.method}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Total Items:</span>
                          <span className="value">
                            {selectedOrder?.items.length}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Order Status:</span>
                          <span className="value">{selectedOrder?.status}</span>
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
              </div>

              {/* Action Buttons */}

              {/* Items List */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box variant="h4">Items List </Box>
                <div class="button-container">
                  <button
                    class="cancel-btn"
                    onClick={() => handleOpenModal(selectedOrder?.userInfo?.id)}
                  >
                    Cancel Order
                  </button>

                  <button onClick={handlePrint} class="print-btn">Print Bill</button>
                </div>
              </div>

              <Table
                 empty={
                  <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
                    <SpaceBetween size="m">
                      {error ? (
                        <b>{error} No orders</b>
                      ) : (
                        <>
                          <b>No Orders available</b>  {/* Show no data message */}
                       
                        </>
                      )}
                    </SpaceBetween>
                  </Box>
                }
                columnDefinitions={[
                  {
                    header: "Product Name",
                    cell: (item) => (
                      <Box display="flex" alignItems="center">
                        <span style={{ fontSize: "20px", marginRight: "8px" }}>
                          {item.productImage}
                        </span>
                        {item.productName}
                      </Box>
                    ),
                  },
                  { header: "Quantity", cell: (item) => item.quantity },
                  { header: "Price", cell: (item) => item.price },
                ]}
                items={selectedOrder?.items}
                variant="embedded"
                stickyHeader
              />
            </Box>
          </div>
        )}
      </SpaceBetween>
      <div
        ref={printRef}
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          padding: "20px",
          border: "1px dashed #000",
          fontFamily: "'Arial', sans-serif",
   
        }}
        className="print-content"
      >
        <div>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100px",height:"100px", marginBottom: "10px" }}
          />
          <h2 style={{ margin: "0", fontSize: "20px" }}>PROMODE AGRO FARMS</h2>
          <p style={{ margin: "0", fontSize: "14px" }}>Deliver Season’s Best</p>
          <p style={{ fontSize: "12px", margin: "5px 0" }}>
            Dargah Khaleej Khan<br />
            Kismatpur, Hyderabad, Telangana, 500028<br />
            Phone: 9701610033
          </p>
          <p style={{ fontSize: "12px", margin: "5px 0" }}>
            GSTIN NO: 36ABCFP1254A1ZS
          </p>
          <p style={{ fontSize: "12px", margin: "5px 0" }}>
            FSSAI NO: 13624010000109
          </p>
        </div>
        <hr />
        <h3 style={{ fontSize: "16px" }}>TAX INVOICE</h3>
        <p>
          <strong>Order ID:</strong> {selectedOrder?.orderId}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(selectedOrder?.createdAt).toLocaleDateString()} (
          {new Date(selectedOrder?.createdAt).toLocaleTimeString()})
        </p>
        <p>
          <strong>Slot Time:</strong> {selectedOrder?.deliverySlot?.startTime} To{" "}
          {selectedOrder?.deliverySlot?.endTime}
        </p>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            margin: "10px 0",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px dashed #000" }}>ITEM NAME</th>
              <th style={{ borderBottom: "1px dashed #000" }}>QTY</th>
              <th style={{ borderBottom: "1px dashed #000" }}>RATE</th>
              <th style={{ borderBottom: "1px dashed #000" }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {selectedOrder?.items.map((item, index) => (
              <tr key={index}>
                <td style={{ borderBottom: "1px dashed #000" }}>
                  {item.productName}
                </td>
                <td style={{ borderBottom: "1px dashed #000" }}>
                  {item.quantity} {item.unit}
                </td>
                <td style={{ borderBottom: "1px dashed #000" }}>
                  {item.price.toFixed(2)}
                </td>
                <td style={{ borderBottom: "1px dashed #000" }}>
                  {item.subtotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ textAlign: "right", marginRight: "20px" }}>
          <strong>Items:</strong> {selectedOrder?.items.length}
        </p>
        <p style={{ textAlign: "right", marginRight: "20px" }}>
          <strong>Sub Total:</strong> Rs. {selectedOrder?.subTotal}
        </p>
        <p style={{ textAlign: "right", marginRight: "20px" }}>
          <strong>Shipping Charges:</strong> Rs. {selectedOrder?.deliveryCharges}
        </p>
        <p style={{ textAlign: "right", marginRight: "20px" }}>
          <strong>Discount Amount:</strong> (-) Rs. {selectedOrder?.discount}
        </p>
        <hr />
        <h3 style={{ textAlign: "right", marginRight: "20px" }}>
          <strong>Grand Total:</strong> Rs. {selectedOrder?.totalPrice}
        </h3>
        <hr />
        <p style={{ fontSize: "14px", marginTop: "10px" }}>
          <strong>Thank You</strong>
        </p>
      </div>


    </ContentLayout>
  );
};

export default Orders;

