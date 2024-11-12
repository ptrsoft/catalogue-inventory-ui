
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
  Box,
  Popover, // Import Popover
  Calendar, // Import Calendar
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
  ];

  const [statusCategory, setStatusCategory] = useState(statusOptions[1]);
  const [filteringText, setFilteringText] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility
  const [selectedDate, setSelectedDate] = useState(''); // Initialize selectedDate as an empty string
  const { data: tableData, loading, error } = useSelector((state) => state.cashCollection);

  const fetchData = useCallback(() => {
    dispatch(fetchCashCollection({
      search: filteringText || '',
      status: statusCategory?.value || '',
      date: selectedDate || '', // pass the selected date as a parameter
    }));
  }, [dispatch, filteringText, statusCategory, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      fetchData();
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state, fetchData]);

  const handleSearchChange = ({ detail }) => setFilteringText(detail.filteringText);

  const handleExportToExcel = () => {
    const formattedData = tableData.map((item, index) => ({
      'S.No': index + 1,
      'Status': item.status,
      'Date': new Date(item.createdAt).toLocaleDateString(),
      'Runsheet ID': item.id,
      'Rider Name': item.rider ? item.rider.name : 'Unknown',
      'Contact No': item.rider ? item.rider.number : 'Unknown',
      'Deliveries': item.delivered,
      'Total Amount': `Rs. ${item.amountCollectable}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
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
    riderName: item.rider ? item.rider.name : 'Unknown',
    contactNo: item.rider ? item.rider.number : 'Unknown',
    deliveries: item.delivered,
    amount: `Rs. ${item.amountCollectable}`,
  }));

  const handleViewDetailsClick = (status, runsheetId) => {
    navigate(`/app/Logistics/CashCollection/view-details/${runsheetId}`, { state: { status } });
  };

  const handleDateSelect = ({ detail }) => {
    setSelectedDate(detail.value); // Update selectedDate with the chosen date
    setShowCalendar(false); // Hide Calendar after selection
  };

  const handleStatusChange = ({ detail }) => setStatusCategory(detail.selectedOption);

  return (
    <SpaceBetween direction="vertical" size="s">
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
          { text: 'Dashboard', href: '/app/dashboard' },
          { text: 'Logistics', href: '/app/dashboard' },
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
            <Popover
              wrapTriggerText={false}
              triggerType='custom'
            
              content={
                <Calendar
                  onChange={handleDateSelect} // Set selected date on change
                  selectedDate={selectedDate} // Display the selected date in the calendar
                />
              }
              onOpen={() => setShowCalendar(true)}
              // onClose={() => setShowCalendar(false)}
              // dismissButton={true}
              isOpen={showCalendar} // Control visibility with showCalendar
            >
<Button iconName="calendar">{selectedDate || 'Sort by Date'}</Button>
</Popover>
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
        <Box float='right' margin={{top:"xl"}}> 
         <Pagination
            // currentPageIndex={currentPage}
            // onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
            pagesCount={2} // Adjust according to the data size
          /></Box>
      
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
        empty={
          <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
            <SpaceBetween size="m">
              <b>{loading ? "Loading..." : error ? `Error: ${error}` : "No data available"}</b>
            </SpaceBetween>
          </Box>
        }
      />
    </SpaceBetween>
  );
};

export default CashCollectionTable;
