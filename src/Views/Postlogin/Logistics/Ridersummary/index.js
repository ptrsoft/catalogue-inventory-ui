import React, { useState } from 'react';
import {
  BreadcrumbGroup,
  Button,
  Container,
  Header,
  Input,
  Pagination,
  Table,
  TextFilter,
  Box,
  Grid,
  SpaceBetween
} from '@cloudscape-design/components';

import { useNavigate } from 'react-router-dom';

const RiderSummary = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate=useNavigate()
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  

  // Sample data for riders
  const riderData = [
    { id: '#5389', name: 'Umesh', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 45, deliveries: '09/45', conversion: 95 },
    { id: '#5389', name: 'Suraj', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 12, deliveries: '10/12', conversion: 95 },
    { id: '#5389', name: 'Asim', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 15, deliveries: '05/15', conversion: 95 },
    { id: '#5389', name: 'Jyothi', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 93, deliveries: '46/93', conversion: 95 },
    { id: '#5389', name: 'Sohail', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 25, deliveries: '25/12', conversion: 52 },
    { id: '#5389', name: 'Salman', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 44, deliveries: '25/12', conversion: 52 },
    { id: '#5389', name: 'Akash', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 12, deliveries: '02/12', conversion: 52 },
    { id: '#5389', name: 'Summit', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 10, deliveries: '05/25', conversion: 75 },
    { id: '#5389', name: 'Vikram', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 25, deliveries: '25/25', conversion: 75 },
    { id: '#5389', name: 'Suhag', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 29, deliveries: '09/25', conversion: 75 },
    { id: '#5389', name: 'Summit', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 112, deliveries: '50/112', conversion: 75 },
    { id: '#5389', name: 'Summit', email: 'Umesh1215@gmail.com', phone: '+91 1234567890', runsheets: '01', orders: 52, deliveries: '34/52', conversion: 75 },
  ];
  

  const filteredRiders = riderData.filter(
    (rider) =>
      rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const onboardrider = () => {
    navigate('/app/Logistics/RiderSummary/Onboarding');
  };

  return (
    <Box>
        <SpaceBetween direction='vertical' size='s'>
        <BreadcrumbGroup items={[
            { text: 'Dashboard', href: '/app/dashboard' },
            // { text: 'Logistics', href: '/app/dashboard' },
            { text: 'Rider Summary', href: '/logistics/rider-summary' },
          ]} />
            <Header
          variant="h2"
       
        
        >
          Rider Summary
        </Header>
        <Grid
           
           gridDefinition={[
             { colspan: { default: 12, xxs: 7} },
             { colspan: { default: 12, xxs: 5 } },
          
           ]}
         >
    
      <TextFilter
        filteringText={searchQuery}
        onChange={({ detail }) => setSearchQuery(detail.filteringText)}
        placeholder="Search"
      />
      <Box>

    <Button variant="primary" iconName='envelope' onClick={onboardrider}>Onboarding Entries</Button>
    <Box float='right' margin={{top:"xl"}}> 
         <Pagination
            currentPageIndex={currentPage}
            onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
            pagesCount={2} // Adjust according to the data size
          /></Box>
          </Box>
    </Grid>
      <Table
       variant='borderless'
    
        items={filteredRiders}
        columnDefinitions={[
          { id: 'id', header: 'Rider ID', cell: (item) => item.id },
          { id: 'name', header: 'Riders Name', cell: (item) => item.name },
          { id: 'email', header: 'Email', cell: (item) => item.email },
          { id: 'phone', header: 'Rider No', cell: (item) => item.phone },
          { id: 'runsheets', header: 'Open Runsheets', cell: (item) => item.runsheets },
          { id: 'orders', header: 'OFD Orders', cell: (item) => item.orders },
          { id: 'deliveries', header: 'Deliveries', cell: (item) => item.deliveries },
          {
            id: 'conversion',
            header: 'Conversion Ratio',
            cell: (item) => (
              <div
                style={{
                  backgroundColor:
                    item.conversion >= 90 ? '#2EE700' :
                    item.conversion >= 75 ? '#FFE14C' : '#E40C0C',
                  color: 'black',
                  padding: '4px 8px',
                  textAlign:"center",
                  margin:'1px'
                //   borderRadius: '4px',
                }}
              >
                {item.conversion}%
              </div>
            ),
          },
        ]}
        // pagination={
        //   <Pagination
        //     currentPageIndex={currentPage}
        //     onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
        //     pagesCount={5} // Adjust according to the data size
        //   />
        // }
      />
      </SpaceBetween>
  </Box>
  );
};

export default RiderSummary;
