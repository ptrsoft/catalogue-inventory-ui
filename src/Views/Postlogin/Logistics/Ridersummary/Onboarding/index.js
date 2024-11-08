import React, { useState, useEffect } from 'react'; 
import {
  Table,
  Header,
  Button,
  Input,
  Select,
  Box,
  StatusIndicator,
  Pagination,
  Toggle,
  BreadcrumbGroup,
  Grid,
  SpaceBetween
} from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRiders } from 'Redux-Store/RiderSummary/RiderSummaryThunk';
import { updateRiderStatus } from 'Redux-Store/RiderSummary/RiderSummaryThunk';

const Onboarding = () => {

  const dispatch = useDispatch();
  const [RejectedMessage, setRejectedMessage] = useState(null);
  const { items, count, error } = useSelector((state) => state.riders);
  const [status, setStatus] = useState('rejected');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const handleViewDetails = (item) => {
    const tabIndex = item.reviewStatus === 'rejected' ? 1 : 0;
    navigate(`/app/Logistics/RiderSummary/onboarding/riderDetails/${item.id}`, { state: { activeTab: tabIndex } });
  };

  const handleStatusChange = (e) => {
    setStatus(e.detail?.selectedOption.value);  // Use .value here to get the actual value
    setCurrentPageIndex(1);
  };

  useEffect(() => {
    // Fetch riders with current status and page index
    dispatch(fetchRiders({ status: status || "", pageIndex: currentPageIndex, pageSize }));
    console.log(status, "from dispatch status");
  }, [dispatch, status, currentPageIndex]);

  const handleAproveRiderDetails = (item) => {
    // Optional: You can set specific tab index for Active/Inactive status if needed
    navigate(`/app/Logistics/RiderSummary/onboarding/ApproveRider/${item.id}`);
    // tabIndex = 0;
     // Default to Personal Details tab
  }
   // Add sno to the rider data
  const runsheetDataWithSno = items.map((item, index) => ({
    ...item,
    sno: index + 1, // Assign sequential sno based on index
  }));
//active or inactive rider 
const handleStatusToggle = async (item) => {
  try {
    await dispatch(updateRiderStatus({
      id: item.id,
      status: item?.reviewStatus === 'active' ? 'inactive' : 'active'
    })).unwrap();
        // navigate("/app/Logistics/RiderSummary");
  } catch (error) {
    console.error("Failed to update rider status:", error);
    // Handle error (e.g., show error message to the user)
  }
};

  const columnDefinitions = {
    pending: [
      { id: 'sno', header: 'Sno.', cell: (item, index) => item.sno },
      { id: 'status', header: 'Status', cell: (item) => <StatusIndicator type="pending">{item.reviewStatus}</StatusIndicator> },
      { id: 'submittedAt', header: 'Submitted At', cell: (item) => item?.submittedAt?.slice(0,10) },
      { id: 'name', header: 'Rider Name', cell: (item) => item.personalDetails.fullName },
      { id: 'contact', header: 'Contact No', cell: (item) => item.number },
      { id: 'action', header: 'Action', cell: (item) => (
        <div style={{ width: '100px', cursor: 'pointer' }} onClick={() => handleViewDetails(item)}>
          View Details
        </div>
      ) },
    ],
    rejected: [
      { id: 'sno', header: 'Sno.', cell: (item, index) => item.sno },
      { id: 'status', header: 'Status', cell: (item) => <StatusIndicator type="error">{item.reviewStatus}</StatusIndicator> },
      { id: 'submittedAt', header: 'Date', cell: (item) => item.submittedAt?.slice(0,10) },
      { id: 'name', header: 'Rider Name', cell: (item) => item.personalDetails.fullName },
      { id: 'contact', header: 'Contact No', cell: (item) => item.number },
      { id: 'rejectionReason', header: 'Issues', cell: (item) => item.rejectionReason || 'N/A' },
      { id: 'action', header: 'Action', cell: (item) => (
        <div style={{ width: '100px', cursor: 'pointer' }} onClick={() => handleViewDetails(item)}>
          View Details
        </div>
      ) },
    ],
    active: [
      { id: 'id', header: 'Rider ID', cell: (item, index) => item.id },
      { id: 'createdAt', header: 'Date Of Joining', cell: (item) => item.createdAt?.slice(0,10) },
      { id: 'name', header: 'Rider Name', cell: (item) => item.personalDetails.fullName },
      { id: 'contact', header: 'Contact No', cell: (item) => item.number },
      {
        id: 'statusToggle',
        header: 'Status',
        cell: (item) => (
          <Toggle 
            checked={item.reviewStatus === 'active'}
            onChange={(e) => handleStatusToggle(item)}
          >
            {item.reviewStatus === 'active' ? 'Active' : 'Inactive'}
          </Toggle>
        ),
      },
      { id: 'action', header: 'Action', cell: (item) => (
        <div style={{ width: '100px', cursor: 'pointer' }} onClick={() => handleAproveRiderDetails(item)}>
          View Details
        </div>
      ) },
    ],
    inactive: [
      { id: 'id', header: 'Rider ID', cell: (item, index) => item.id },
      { id: 'createdAt', header: 'Date Of Joining', cell: (item) => item.createdAt?.slice(0,10) },
      { id: 'name', header: 'Rider Name', cell: (item) => item.personalDetails.fullName },
      { id: 'contact', header: 'Contact No', cell: (item) => item.number },
      {
        id: 'statusToggle',
        header: 'Status',
        cell: (item) => (
          <Toggle 
            checked={item.reviewStatus === 'active'}
            onChange={(e) => handleStatusToggle(item)}
          >
            {item.reviewStatus === 'active' ? 'Active' : 'Inactive'}
          </Toggle>
        ),
      },
      { id: 'action', header: 'Action', cell: (item) => (
        <div style={{ width: '100px', cursor: 'pointer' }} onClick={() => handleAproveRiderDetails(item)}>
          View Details
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

      {error && <Box color="text-status-error">{error}</Box>}
        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 5 } },
            // { colspan: { default: 12, xxs: 3 } },
            { colspan: { default: 12, xxs: 3 } },
          ]}
        >
      <Input
        placeholder="Search by name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.detail.value)}
      />
      <Select
        selectedOption={{ label: status, value: status }}  // Set selected option properly
        onChange={handleStatusChange}
        options={[
          { label: 'Pending', value: 'pending' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' }
        ]}
      />
      </Grid>
      <Table
        variant='borderless'
        columnDefinitions={columnDefinitions[status] || []}  // Provide fallback in case of undefined
        items={runsheetDataWithSno}  // Directly use items from backend response
    
        pagination={<Pagination currentPageIndex={currentPageIndex} onChange={({ detail }) => setCurrentPageIndex(detail.selectedPageIndex)} />}
      />
      </SpaceBetween>
    </Box>
  );
};

export default Onboarding;
