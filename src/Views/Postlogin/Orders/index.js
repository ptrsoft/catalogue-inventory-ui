import React, { useState } from 'react';
import { Table,Button,Box, Input,Grid, Pagination, Select, Header, Container } from '@cloudscape-design/components';

import { ContentLayout,BreadcrumbGroup,SpaceBetween } from '@cloudscape-design/components';
import Stats from './components/Stats';

const Orders = () => {
    const orderData = {
        orderId: '54764',
        customerName: 'Maruti S',
        address: '13-54-854/4A/B1, B-Block Jains Bandlaguda, Prestige High Fields, Madhapur, Telangana 500038',
        contactNo: '123456789',
        payment: '₹ 2980.00',
        totalItems: '16 Items',
        paymentType: 'COD',
      };
    
      const itemsList = [
        { productImage: '🥔', productName: 'Potato', quantity: '10 Kgs', price: 'Rs. 250' },
        { productImage: '🍅', productName: 'Tomato', quantity: '05 Pcs', price: 'Rs. 250' },
        { productImage: '🥕', productName: 'Carrot', quantity: '250 Grm', price: 'Rs. 250' },
        { productImage: '🥒', productName: 'Cucumber', quantity: '10 Kgs', price: 'Rs. 250' },
        { productImage: '🥔', productName: 'Potato', quantity: '10 Kgs', price: 'Rs. 250' },
        { productImage: '🍅', productName: 'Tomato', quantity: '10 Kgs', price: 'Rs. 250' },
        { productImage: '🥕', productName: 'Carrot', quantity: '10 Kgs', price: 'Rs. 250' },
      ];
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(7); // Number of rows per page
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const handleOrderClick = (product) => {
        setSelectedProduct(product);
        setIsDrawerOpen(true);
      };
      const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedProduct(null);
      };
    const data = [
      // Example data array
      { orderId: '#10011', date: '26-07-2024', customerName: 'John Smith', items: '05 Items', paymentType: 'COD', status: 'Order Confirmed', amount: 'Rs. 85', area: 'PBEI' },
      { orderId: '#69312', date: '26-07-2024', customerName: 'Jane Doe', items: '02 Items', paymentType: 'Prepaid', status: 'Order Confirmed', amount: 'Rs. 28', area: 'Vasati' },
      { orderId: '#10011', date: '26-07-2024', customerName: 'John Smith', items: '05 Items', paymentType: 'COD', status: 'Order Confirmed', amount: 'Rs. 85', area: 'PBEI' },
      { orderId: '#69312', date: '26-07-2024', customerName: 'Jane Doe', items: '02 Items', paymentType: 'Prepaid', status: 'Order Confirmed', amount: 'Rs. 28', area: 'Vasati' },
      { orderId: '#10011', date: '26-07-2024', customerName: 'John Smith', items: '05 Items', paymentType: 'COD', status: 'Order Confirmed', amount: 'Rs. 85', area: 'PBEI' },
      { orderId: '#69312', date: '26-07-2024', customerName: 'Jane Doe', items: '02 Items', paymentType: 'Prepaid', status: 'Order Confirmed', amount: 'Rs. 28', area: 'Vasati' },
      { orderId: '#10011', date: '26-07-2024', customerName: 'John Smith', items: '05 Items', paymentType: 'COD', status: 'Order Confirmed', amount: 'Rs. 85', area: 'PBEI' },
      { orderId: '#69312', date: '26-07-2024', customerName: 'Jane Doe', items: '02 Items', paymentType: 'Prepaid', status: 'Order Confirmed', amount: 'Rs. 28', area: 'Vasati' },
      { orderId: '#10011', date: '26-07-2024', customerName: 'John Smith', items: '05 Items', paymentType: 'COD', status: 'Order Confirmed', amount: 'Rs. 85', area: 'PBEI' },
      { orderId: '#69312', date: '26-07-2024', customerName: 'Jane Doe', items: '02 Items', paymentType: 'Prepaid', status: 'Order Confirmed', amount: 'Rs. 28', area: 'Vasati' },
      { orderId: '#10011', date: '26-07-2024', customerName: 'John Smith', items: '05 Items', paymentType: 'COD', status: 'Order Confirmed', amount: 'Rs. 85', area: 'PBEI' },
      { orderId: '#69312', date: '26-07-2024', customerName: 'Jane Doe', items: '02 Items', paymentType: 'Prepaid', status: 'Order Confirmed', amount: 'Rs. 28', area: 'Vasati' },
      // Add all other rows here
    ];
  
    const statusOptions = [
      { label: 'All', value: '' },
      { label: 'Order Confirmed', value: 'Order Confirmed' },
      { label: 'Pending', value: 'Pending' },
      // Add other statuses if needed
    ];
  
    const columns = [
      { header: 'Order ID',   cell: (item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleOrderClick(item)}
        >
     
          {item.orderId}
        </div>
      ),
      width: 250,
      minWidth: 180, },
      { header: 'Order Date', cell: item => item.date },
      { header: 'Customer Name', cell: item => item.customerName },
      { header: 'Items', cell: item => item.items },
      { header: 'Payment Type', cell: item => <strong>{item.paymentType}</strong> },
      { header: 'Order Status', cell: item => item.status },
      { header: 'Total Amount', cell: item => item.amount },
      { header: 'Deliver Area', cell: item => item.area },
    ];
  
    const handlePageChange = ({ detail }) => setCurrentPageIndex(detail.currentPageIndex);
    const handleSortChange = ({ detail }) => setSelectedStatus(detail.selectedOption.value);
  
    const filteredData = selectedStatus
      ? data.filter(item => item.status === selectedStatus)
      : data;
  

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
 
        <Stats/>

    <div>
    <Grid
           
              gridDefinition={[
                { colspan: { default: 12, xxs: 4 } },
                { colspan: { default: 12, xxs: 2 } },
                { colspan: { default: 12, xxs: 6 } },
              ]}
            >
      {/* Search bar */}
      <Input
        type="search"
        placeholder="Search"
        ariaLabel="Search orders"
        value=""
        onChange={() => {}}
      />
      
      {/* Sort dropdown */}
      <Select
        selectedOption={statusOptions.find(option => option.value === selectedStatus)}
        onChange={handleSortChange}
        options={statusOptions}
        placeholder="Sort By Status"
        selectedAriaLabel="Selected status"
      />
      <Box float='right'>
         <Pagination
            currentPageIndex={currentPageIndex}
            onChange={handlePageChange}
            pagesCount={Math.ceil(filteredData.length / pageSize)}
            ariaLabels={{
              nextPageLabel: "Next page",
              previousPageLabel: "Previous page",
              pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
            }}
          />
          </Box>
      </Grid>
      
      {/* Orders table */}
      <div className={`orders-container ${isDrawerOpen ? 'blur-background' : ''}`}>
      <Table
       variant='borderless'
    
        columnDefinitions={columns}
        items={filteredData.slice((currentPageIndex - 1) * pageSize, currentPageIndex * pageSize)}
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
            width: "30%",
            backgroundColor: "white",
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            overflowY: "auto",
            color: "red",
          }}
        >
    <Box padding="l">
    <div style={{ display: "flex", justifyContent:"space-between"}}>
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
      
          <div style={{marginBottom:"10px"}}>
          <Container>
          <div className="product-card">
      
            <div className="details">
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">{orderData.customerName}
                <span style={{
            backgroundColor: '#4B5563',
            color: '#FFF',
            padding: '2px 8px',
            borderRadius: '5px',
            fontSize: '12px',
            marginLeft: '5px'
          }}>
            {orderData.paymentType}
          </span>
                </span>
                
              </div>
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{orderData.address}</span>
              </div>
              <div className="info-row">
                <span className="label">Contact No:</span>
                <span className="value">{orderData.contactNo}</span>
              </div>
              <div className="info-row">
                <span className="label">Payment:</span>
                <span className="value">{orderData.payment}</span>
              </div>
              <div className="info-row">
                <span className="label">Total Items:</span>
                <span className="value">{orderData.totalItems}</span>
              </div>
            </div>
            </div>
            </Container>
            </div>
  
      </div>


      {/* Action Buttons */}
  

      {/* Items List */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <Box variant="h4">Items List  </Box>
      <div class="button-container">
    <button class="cancel-btn">Cancel Order</button>
    <button class="print-btn">Print Bill</button>
  </div>
      </div>
    
      <Table
        columnDefinitions={[
          { header: 'Product Name', cell: item => (
            <Box display="flex" alignItems="center">
              <span style={{ fontSize: '20px', marginRight: '8px' }}>{item.productImage}</span>
              {item.productName}
            </Box>
          )},
          { header: 'Quantity', cell: item => item.quantity },
          { header: 'Price', cell: item => item.price },
        ]}
        items={itemsList}
        variant="embedded"
        stickyHeader
      />
    </Box>
          

        </div>
      )}


    </SpaceBetween>

    </ContentLayout>


  )
}

export default Orders