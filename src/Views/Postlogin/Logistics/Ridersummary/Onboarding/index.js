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
  SpaceBetween,Toggle
} from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const [status, setStatus] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  // Function to navigate to rider details page with active tab index
  const riderdetails = (tabIndex = 0) => {
    // navigate('/app/Logistics/RiderSummary/riderDetails', { state: { activeTab: tabIndex } });
  };

  const handleViewDetails = (item) => {
    let tabIndex = 0; // Default to Personal Details tab
    
    if (item.status === 'Rejected') {
      tabIndex = 1; // Professional Details tab for rejected status
      navigate('/app/Logistics/RiderSummary/onboarding/riderDetails', { state: { activeTab: tabIndex } });
    } 
    else   if (item.status === 'Review Pending') {
      tabIndex = 0; // Professional Details tab for rejected status
      navigate('/app/Logistics/RiderSummary/onboarding/riderDetails', { state: { activeTab: tabIndex } });
    }
    else if (item.status === 'Active' || item.status === 'Inactive') {
      // Optional: You can set specific tab index for Active/Inactive status if needed
      navigate('/app/Logistics/RiderSummary/onboarding/ApproveRider');
      // tabIndex = 0;
       // Default to Personal Details tab
    }
    riderdetails(tabIndex);
  }
// Function to handle the toggle change
const handleStatusToggle = (id, isActive) => {
  // Update the status based on the toggle state (isActive)
  console.log(`Rider ID: ${id} status changed to: ${isActive ? 'Active' : 'Inactive'}`);
  // Perform the necessary update logic here (e.g., API call or state update)
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
        action: 'View Details',
      },
      {
        id: 2,
        status: 'Inactive',
        date: '10/10/2024',
        name: 'Jane Doe',
        contact: '123456789',
        action: 'View Details',
      },
      // Add more active data as needed
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

  const columnDefinitions = {
    Pending: [
      { id: 'sno', header: 'Sno.', cell: (item) => item.id },
      {
        id: 'status',
        header: 'Status',
        cell: (item) => (
          <StatusIndicator type="pending">Review Pending</StatusIndicator>
        ),
      },
      { id: 'date', header: 'Date', cell: (item) => item.date },
      { id: 'name', header: 'Rider Name', cell: (item) => item.name },
      { id: 'contact', header: 'Contact No', cell: (item) => item.contact },
      { id: 'action', header: 'Action', cell: (item) => (
        <div style={{ width: '100px', cursor: 'pointer' }} onClick={() => handleViewDetails(item)}>
          {item.action}
        </div>
      ) },
    ],
    Rejected: [
      { id: 'sno', header: 'Sno.', cell: (item) => item.id },
      {
        id: 'status',
        header: 'Status',
        cell: (item) => (
          <StatusIndicator type="error">Rejected</StatusIndicator>
        ),
      },
      { id: 'date', header: 'Date', cell: (item) => item.date },
      { id: 'name', header: 'Rider Name', cell: (item) => item.name },
      { id: 'contact', header: 'Contact No', cell: (item) => item.contact },
      { id: 'issues', header: 'Issues', cell: (item) => item.issues },
      {
        id: 'reupload',
        header: 'Reupload',
        cell: (item) => <div style={{ width: '100px' }}>{item.reupload}</div>,
      },
      { id: 'action', header: 'Action', cell: (item) => (
        <div style={{ width: '100px', cursor: 'pointer' }} onClick={() => handleViewDetails(item)}>
          {item.action}
        </div>
      ) },
    ],
    Active: [
      { id: 'riderId', header: 'Rider ID', cell: (item) => `#${item.id}` },
      { id: 'dateOfJoining', header: 'Date Of Joining', cell: (item) => item.date },
      { id: 'riderName', header: 'Rider Name', cell: (item) => item.name },
      { id: 'contactNo', header: 'Contact No', cell: (item) => item.contact },
      {
        id: 'status',
        header: 'Status',
        cell: (item) => (
          <div style={{ width: '100px' }}>
          <Toggle 
            checked={item.status === 'Active'}
            onChange={(e) => handleStatusToggle(item.id, e.detail.checked)}
          >
            {item.status}
          </Toggle>
        </div>
        ),
      },
      { id: 'action', header: 'Action', cell: (item) => (
        <div style={{ width: '100px', cursor: 'pointer' }} onClick={() => handleViewDetails(item)}>
          {item.action}
        </div>
      ) },
    ],
  };
  

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
          <Box margin={{ top: 'l' }} float="right">
            <Pagination
              currentPageIndex={currentPageIndex}
              pagesCount={Math.ceil(filteredData.length / pageSize)}
              onChange={({ detail }) => setCurrentPageIndex(detail.selectedPageIndex)}
            />
          </Box>
        </Grid>
        <Table
          variant="borderless"
          columnDefinitions={columnDefinitions[status]}
          items={paginatedData}
        />
      </SpaceBetween>
    </Box>
  );
};

export default Onboarding;
