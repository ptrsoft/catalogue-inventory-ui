import React, { useState, useEffect } from "react";
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
  Modal
} from "@cloudscape-design/components";

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
} from "Redux-Store/Orders/OrdersThunk";
const Orders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCancelOrder = () => {
    // Logic for canceling the order can go here
    console.log('Order Canceled');
    handleCloseModal();
  };
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(50); // Number of rows per page

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  // Get loading, error, and selectedOrder from the Redux store
  const dispatch = useDispatch();
  const { selectedOrder } = useSelector((state) => state.orderInventory);
  const { orders, loading, error, count } = useSelector(
    (state) => state.orderInventory
  );
  // const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [pageKey, setPageKey] = useState('');
  const [filteringText, setFilteringText] = React.useState("");


  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
    // setCurrentPage(1); // Reset page to 1 when filters change

  };
  console.log(filteringText,"search");
  useEffect(() => {
    dispatch(fetchOrderInventory({ search:filteringText ||"",type: category?.value||"", pageKey }));
  }, [dispatch, filteringText, category, pageKey]);


  useEffect(() => {
    if (selectedProduct) {
      dispatch(fetchOrderById(selectedProduct)); // Dispatch the thunk to fetch order details
    }
  }, [dispatch, selectedProduct]);



  if (error) {
    return <div>Error: {error}</div>; // Error state
  }
  const handleOrderClick = (orderId) => {
    setSelectedProduct(orderId);

    setIsDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };



  if (error) {
    return <div>Error: {error}</div>;
  }

  const statusOptions = [
    { label: "All", value: "" },
    { label: "Order Confirmed", value: "confirmed" },
    { label: "Packed", value: "packed" },
    { label: "On The Way", value: "ontheway" },
    { label: "Delivered", value: "delivered" },

    // Add other statuses if needed
  ];
  
  const paymentOptions= [
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
    { header: "Order Date", cell: (item) => item.orderDate },

    { header: "Customer Name", cell: (item) => item.customerName },
    { header: "Items", cell: (item) => item.items },
   
    {
      header: "Payment Type",
      cell: (item) => <strong>{item.paymentType}</strong>,
    },
    { header: "Order Status", cell: (item) => item.Status },

    { header: "Total Amount", cell: (item) => item.totalAmount },
    { header: "Deliver Area", cell: (item) => item.area },
  ];

  const handlePageChange = ({ detail }) =>
    setCurrentPageIndex(detail.currentPageIndex);

  const handleSortChange = ({ detail }) =>
    setCategory(detail.selectedOption);


 

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
      header={<Header variant="h1">Orders</Header>}
    >
      <SpaceBetween direction="vertical" size="xl">
        <Stats />
        {isModalOpen && (
  <Modal size="medium" visible={isModalOpen} onDismiss={handleCloseModal} closeAriaLabel="Close"
  header={<Header>Order Cancel Reason</Header>}>
  <hr />

  <div> 
    {/* Adjusted line-height here */}
    <SpaceBetween direction="vertical" size="s">
    <p style={{  color: "#1D4ED8",}}><strong>Order ID:</strong> <b>54764</b></p>
    <p><strong>Abram Botosh</strong>    <span
                              style={{
                                backgroundColor: "#4B5563",
                                color: "#FFF",
                                padding: "2px 8px",
                                borderRadius: "5px",
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              {selectedOrder?.paymentDetails?.method}
                            </span></p>
    <p>13-54-854/4A/B1, B-Block Jains Bandlaguda, Prestige High Fields, Madhapur, Telangana 500038</p>
    <p>+91 1234567890</p>
    <hr />
    
    {/* Payment and Items on the same line */}
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <p><strong>Payment:</strong> <b style={{  color: "#1D4ED8",}}><i>₹ 2980</i></b></p>
      <p><strong>16 Items</strong></p>
    </div>

    {/* Reason Textarea */}
    <b>Reason</b>
    <textarea id="reason" rows="4" style={{ width: '100%', marginBottom: '1rem' }}></textarea>

    {/* Cancel Order Button */}
    <button className="cancel-btn" style={{float:"right"}} onClick={handleCancelOrder}>Cancel Order</button>
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
              { colspan: { default: 12, xxs: 4 } },
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
              onChange={handleSortChange}
              options={paymentOptions}
              placeholder="Sort By Payment Type"
              selectedAriaLabel="Selected status"
            />
             <Select
             required
              selectedOption={category}
              onChange={handleSortChange}
              options={statusOptions}
              placeholder="Sort By Status"
              selectedAriaLabel="Selected status"
            />
            <Box float="right">
              <Pagination
                currentPageIndex={currentPageIndex}
                onChange={handlePageChange}
                pagesCount={Math.ceil(orders.length / pageSize)}
                ariaLabels={{
                  nextPageLabel: "Next page",
                  previousPageLabel: "Previous page",
                  pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
                }}
              />
            </Box>
          </Grid>

          {/* Orders table */}
          <div
            className={`orders-container ${
              isDrawerOpen ? "blur-background" : ""
            }`}
          >
            <Table
              variant="borderless"
              columnDefinitions={columns}
              items={orders}
              // pagination={

              // }
              // resizableColumns
              // stickyHeader
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
          >
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
                          <span className="label">Name:</span>
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
                              {selectedOrder?.paymentDetails?.method}
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
                  <button class="cancel-btn" onClick={handleOpenModal}>Cancel Order</button>
                  <button class="print-btn">Print Bill</button>
                </div>
              </div>

              <Table
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
    </ContentLayout>
  );
};

export default Orders;
