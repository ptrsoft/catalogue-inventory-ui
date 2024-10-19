import React, { useState } from 'react';
import {
  Table,
  Header,
  Button,
  Input,
  Select,
  Box,
  BreadcrumbGroup,
  Pagination,
  StatusIndicator,
  Grid,
  SpaceBetween
} from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

const RiderSummary = () => {
  const [status, setStatus] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const riderdetails= () => {
    navigate('/app/Logistics/RiderSummary/Onboarding/riderDetails');
  };

  const riderData = {
    Pending: Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      status: 'Review Pending',
      date: '10/10/2024',
      name: `Rider ${i + 1}`,
      contact: '123456789',
      action: 'View Details',
    })),
    Rejected: [
      {
        id: 1,
        status: 'Rejected',
        date: '10/10/2024',
        name: 'William Taylor',
        contact: '123456789',
        issues: 'Pan Card Mismatch Documents',
        reupload: 'Reupload Request Sent',
        action: 'View Details',
      },
      {
        id: 2,
        status: 'Rejected',
        date: '10/10/2024',
        name: 'Jane Doe',
        contact: '123456789',
        issues: 'Reupload All Documents',
        reupload: 'Reupload Request Sent',
        action: 'View Details',
      },
      // Add more rejected data as needed
    ],
    Active: [
      {
        id: 1,
        status: 'Active',
        date: '10/10/2024',
        name: 'William Taylor',
        contact: '123456789',
        issues: 'Pan Card Mismatch Documents',
        reupload: 'Reupload Request Sent',
        action: 'View Details',
      },
      {
        id: 2,
        status: 'Inactive',
        date: '10/10/2024',
        name: 'Jane Doe',
        contact: '123456789',
        issues: 'Reupload All Documents',
        reupload: 'Reupload Request Sent',
        action: 'View Details',
      },
      // Add more rejected data as needed
    ],
  };

  const handleStatusChange = (e) => {
    setStatus(e.detail.selectedOption.value);
    setCurrentPageIndex(1); // Reset to the first page when status changes
  };

  const filteredData = riderData[status].filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize
  );

  return (
    <Box>
        <SpaceBetween direction="vertical" size="m">
      <BreadcrumbGroup
        items={[
          { text: 'Dashboard', href: '#' },
          { text: 'Logistics', href: '#' },
          { text: 'Rider Summary', href: '#' },
        ]}
      />
      <Header variant="h1">Rider Summary</Header>
      <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 6 } },
            { colspan: { default: 12, xxs: 3 } },
            { colspan: { default: 12, xxs: 3 } },
          ]}
        >
        <Input
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.detail.value)}
        />
        <Select
          selectedOption={{ label: status, value: status }}
          onChange={handleStatusChange}
          options={[
            { label: 'Pending', value: 'Pending' },
            { label: 'Rejected', value: 'Rejected' },
            { label: 'Active', value: 'Active' },
          ]}
        />
        <Box margin={{top:'l'}} float='right'>
          <Pagination
        currentPageIndex={currentPageIndex}
        pagesCount={Math.ceil(filteredData.length / pageSize)}
        onChange={({ detail }) => setCurrentPageIndex(detail.selectedPageIndex)}
      />
      </Box>
       
      </Grid>
      <Table
  
      variant='borderless'
        columnDefinitions={[
          { id: 'sno', header: 'Sno.', cell: (item) => item.id },
          {
            id: 'status',
            header: 'Status',
            cell: (item) =>
              item.status === 'Rejected' ? (
                <StatusIndicator type="error">Rejected</StatusIndicator>
              ) : (
                <StatusIndicator type="pending">Review Pending</StatusIndicator>
              ),
          },
          { id: 'date', header: 'Date', cell: (item) => item.date },
          { id: 'name', header: 'Rider Name', cell: (item) => item.name },
          { id: 'contact', header: 'Contact No', cell: (item) => item.contact },
          status === 'Rejected'
            ? { id: 'issues', header: 'Issues', cell: (item) => item.issues }
            : null,
          status === 'Rejected'
            ? {
                id: 'reupload',
                header: 'Reupload',
                cell: (item) => (
                  <div style={{width:"100px"}}>{item.reupload}</div>
                ),
                
              }
            : null,
          { id: 'action', header: 'Action', cell: (item) => (
            <div style={{width:"100px",cursor:"pointer"}} onClick={riderdetails} >{item.action}</div>
          ),},
        ].filter(Boolean)}
        items={paginatedData}
      />
   </SpaceBetween>
    </Box>
  );
};

export default RiderSummary;
