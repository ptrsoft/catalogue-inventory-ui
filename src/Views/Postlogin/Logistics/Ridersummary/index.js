import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  SpaceBetween,
  Spinner
} from '@cloudscape-design/components';
import { useMediaQuery } from 'react-responsive';
import { fetchRiderSummary } from 'Redux-Store/RiderSummary/RiderSummaryThunk';

import { useNavigate } from 'react-router-dom';

const RiderSummary = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Get rider summary data from Redux store
  const { summaryItems, summaryStatus, summaryError } = useSelector((state) => state.riders);

  // Fetch rider summary data on component mount and when search changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchRiderSummary({ search: searchQuery }));
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timeoutId);
  }, [dispatch, searchQuery]);

  // Filter riders based on search query (if needed for client-side filtering)
  const filteredRiders = summaryItems.filter(
    (rider) =>
      rider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
          actions={
            <div>
            {isMobile ? (
              <Button variant="primary" iconName='envelope' onClick={onboardrider} >Onbaord</Button>
            ) : (
              <Button variant="primary" iconName='envelope' onClick={onboardrider}>Onboarding Entries</Button>
            )}

          
       </div>
          }
        
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
        placeholder="Search riders by name or email"
      />
      <Box>

    <Box float='right' margin={{top:"xl"}}> 
         <Pagination
            currentPageIndex={currentPage}
            onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
            pagesCount={2} // Adjust according to the data size
          /></Box>
          </Box>
    </Grid>
      {summaryStatus === 'loading' ? (
        <Box textAlign="center" padding="xl">
          <Spinner size="large" />
        </Box>
      ) : summaryStatus === 'failed' ? (
        <Box textAlign="center" padding="xl" color="error">
          Error: {summaryError}
        </Box>
      ) : filteredRiders.length === 0 ? (
        <Box textAlign="center" padding="xl">
          No riders found
        </Box>
      ) : (
        <Table
          variant='borderless'
          items={filteredRiders}
          columnDefinitions={[
            { id: 'id', header: 'Rider ID', cell: (item) => item.id || item.riderId || 'N/A' },
            { id: 'name', header: 'Riders Name', cell: (item) => item.name || item.riderName || 'N/A' },
            { id: 'email', header: 'Email', cell: (item) => item.email || 'N/A' },
            { id: 'phone', header: 'Rider No', cell: (item) => item.number || item.phoneNumber || 'N/A' },
            { id: 'runsheets', header: 'Open Runsheets', cell: (item) => item.runsheets || item.openRunsheets || '0' },
            { id: 'orders', header: 'OFD Orders', cell: (item) => item.orders || item.ofdOrders || '0' },
            { id: 'deliveries', header: 'Deliveries', cell: (item) => item.deliveries || item.deliveryCount || '0/0' },
            {
              id: 'conversion',
              header: 'Conversion Ratio',
              cell: (item) => {
                const conversion = item.conversion || item.conversionRatio || 0;
                return (
                  <div
                    style={{
                      backgroundColor:
                        conversion >= 90 ? '#2EE700' :
                        conversion >= 40 ? '#FFE14C' : '#E40C0C',
                      color: 'black',
                      padding: '4px 8px',
                      textAlign: "center",
                      margin: '1px'
                    }}
                  >
                    {conversion}
                  </div>
                );
              },
            },
          ]}
        />
      )}
      </SpaceBetween>
  </Box>
  );
};

export default RiderSummary;
