// src/components/CashCollectionTable.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TextFilter,
  Select,
  Button,
  Flashbar,
  SpaceBetween,
  Header,
  BreadcrumbGroup,
  Grid,
  StatusIndicator,
  Pagination,
} from '@cloudscape-design/components';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCashCollection } from 'Redux-Store/cashCollection/cashCollectionThunk';
import { useNavigate, useLocation } from 'react-router-dom';

const CashCollectionTable = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const statusOptions = [
    { label: 'Active', value: 'closed' },
    { label: 'Pending', value: 'pending' },
    // Add other statuses if needed
  ];

  const [statusCategory, setStatusCategory] = useState(statusOptions[1]);
  const [filteringText, setFilteringText] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  const { data: tableData, loading, error } = useSelector((state) => state.cashCollection);

  const fetchData = useCallback(() => {
    dispatch(fetchCashCollection({ search: filteringText || '', status: statusCategory?.value || '' }));
  }, [dispatch, filteringText, statusCategory]);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts or when dependencies change
  }, [fetchData]);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      fetchData(); // Fetch updated data after setting success message
  
      // Clear the success message after 3 seconds
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer); // Clear the timeout if component unmounts
    }
  }, [location.state, fetchData]); // Keep fetchData in the dependency array
  

  // Handle search filter change
  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cash Collection Data');
    XLSX.writeFile(workbook, 'CashCollectionData.xlsx');
  };

  const filteredData = tableData.map((item, index) => ({
    ...item,
    sno: index + 1,
    status: item.status === 'pending' ? 'Cash Pending' : 'Cash Received',
    date: new Date(item.createdAt).toLocaleDateString(),
    runsheetId: item.id,
    riderName: item.rider ? item.rider.number : 'Unknown',
    contactNo: item.rider ? item.rider.name : 'Unknown',
    deliveries: item.delivered,
    amount: `Rs. ${item.amountCollectable}`,
  }));

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleViewDetailsClick = (status, runsheetId) => {
    navigate(`/app/Logistics/CashCollection/view-details/${runsheetId}`, { state: { status } });
  };

  const handleStatusChange = ({ detail }) => setStatusCategory(detail.selectedOption);

  return (
    <SpaceBetween direction="vertical" size="s">
      {/* Display success message using Flashbar */}
      {successMessage && (
        <Flashbar
          items={[
            {
              type: 'success',
              content: successMessage,
              dismissible: true,
              onDismiss: () => setSuccessMessage(null),
            },
          ]}
        />
      )}
      <BreadcrumbGroup
        items={[
          { text: 'Dashboard', href: '#' },
          { text: 'Logistics', href: '#' },
          { text: 'Cash Collection', href: '#' },
        ]}
      />

      <Header
        variant="h1"
        actions={
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button iconName="external" onClick={handleExportToExcel}>
              Export
            </Button>
            <Button iconName="calendar">Today</Button>
          </div>
        }
      >
        Cash Collection
      </Header>

      <Grid gridDefinition={[{ colspan: 4 }, { colspan: 3 }, { colspan: 5 }]}>
        <TextFilter
          filteringText={filteringText}
          filteringPlaceholder="Search Runsheet, agent"
          filteringAriaLabel="Filter instances"
          onChange={handleSearchChange}
        />
        <Select
          required
          selectedOption={statusCategory}
          onChange={handleStatusChange}
          options={statusOptions}
          placeholder="Sort By Status"
          selectedAriaLabel="Selected status"
        />
        <Pagination></Pagination>
      </Grid>

      <Table
        variant="borderless"
        columnDefinitions={[
          { id: 'sno', header: 'Sno.', cell: (item) => item.sno },
          {
            id: 'status',
            header: 'Status',
            cell: (item) => (
              <StatusIndicator type={item.status === 'Cash Received' ? 'success' : 'pending'}>
                {item.status}
              </StatusIndicator>
            ),
          },
          { id: 'date', header: 'Date', cell: (item) => item.date },
          { id: 'runsheetId', header: 'Runsheet ID', cell: (item) => item.runsheetId },
          { id: 'riderName', header: 'Rider Name', cell: (item) => item.riderName },
          { id: 'contactNo', header: 'Contact No', cell: (item) => item.contactNo },
          { id: 'deliveries', header: 'Deliveries', cell: (item) => item.deliveries },
          { id: 'amount', header: 'Total Amount', cell: (item) => item.amount },
          {
            id: 'action',
            header: 'Action',
            cell: (item) => (
              <div style={{ width: '90px' }}>
                <Button onClick={() => handleViewDetailsClick(item.status, item.runsheetId)} variant="inline-link">
                  {item.status === 'Cash Pending' ? 'Collect Cash' : 'View Details'}
                </Button>
              </div>
            ),
          },
        ]}
        items={filteredData}
        stickyHeader
      />
    </SpaceBetween>
  );
};

export default CashCollectionTable;
