import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  Header,
  Pagination,
  BreadcrumbGroup,
  StatusIndicator,
  Box,
  SpaceBetween,
  Grid,
  Flashbar,
  TextFilter
} from "@cloudscape-design/components";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRunsheet } from 'Redux-Store/Runsheet/RunsheetThunk'; // Adjust the import path as needed

const Runsheet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch(); // Initialize useDispatch
  const { runsheetData, loading, error } = useSelector((state) => state.runsheet); // Access runsheet data from Redux state
  const [successMessage, setSuccessMessage] = useState(null);
  const [pageKey, setPageKey] = useState('');
  const [filteringText, setFilteringText] = useState("");

  const handleCreateRunSheet = () => {
    navigate('/app/Logistics/runsheet/CreateRunSheet');
  };

  // Function to fetch runsheet data
  const fetchData = () => {
    dispatch(fetchRunsheet({ search: filteringText || "", pageKey }));
  };

  // Fetch data initially when the component mounts
  useEffect(() => {
    fetchData(); // Fetch runsheet data initially
  }, [filteringText, pageKey]); // Dependencies: filteringText and pageKey

  // Handle success message and trigger data re-fetch
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      fetchData(); // Fetch updated data after setting success message

      // Clear the success message after 3 seconds
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer); // Clear the timeout if component unmounts
    }
  }, [location.state]); // Re-run when location state changes

  // Handle search filter change
  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
  };

  // Add sno to the runsheet data
  const runsheetDataWithSno = runsheetData.map((item, index) => ({
    ...item,
    sno: index + 1, // Assign sequential sno based on index
  }));

  // Table column definitions
  const columns = [
    {
      id: "sno",
      header: "Sno.",
      cell: (item) => item.sno, // Display the sno we added above
    },
    {
      id: "status",
      header: "Status",
      cell: (item) => (
        <StatusIndicator
          type={item.status === "Active" ? "success" : "pending"}
        >
          {item.status}
        </StatusIndicator>
      ),
    },
    {
      id: "createdAt",
      header: "Date",
      cell: (item) => 
      
        item.createdAt.slice(0, 10)
      
      
    },
    {
      id: "runsheetId",
      header: "Runsheet ID",
      cell: (item) => item.id, // Assuming the runsheet ID is the same as item.id
    },
    { id: "name", header: "Rider Name", cell: (item) => item.name }, // Adjust according to your API response
    { id: "contactNo", header: "Contact No", cell: (item) => item.contact }, // Placeholder for contact number
    {
      id: "action",
      header: "Action",
      cell: (item) => <Link to={`/app/Logistics/runsheet/ViewRunSheet/${item.id}`}>View Details</Link>,
    },
  ];

  return (
    <Box>
      <SpaceBetween direction="vertical" size="m">
        {/* Display success message using Flashbar */}
        {successMessage && (
          <Flashbar
            items={[{
              type: "success",
              content: successMessage,
              dismissible: true,
              onDismiss: () => setSuccessMessage(null),
            }]}
          />
        )}
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Logistics", href: "/app/dashboard" },
            { text: "Runsheet", href: "#" },
          ]}
        />

        <Header variant="h1">Runsheet</Header>

        <Grid
          gridDefinition={[
            { colspan: { default: 12, xxs: 6 } },
            { colspan: { default: 12, xxs: 6 } },
          ]}
        >
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Search Runsheet, agent"
            filteringAriaLabel="Filter instances"
            onChange={handleSearchChange}
          />
          <Button variant="primary" iconName="add-plus" onClick={handleCreateRunSheet}>
            Create Runsheet
          </Button>
        </Grid>

        <Table
          variant="borderless"
          columnDefinitions={columns}
          items={runsheetDataWithSno} // Use fetched runsheet data
          pagination={<Pagination currentPageIndex={1} pagesCount={5} />}
        />
      </SpaceBetween>
    </Box>
  );
};

export default Runsheet;
