import React from "react";
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
} from "@cloudscape-design/components";
import { useNavigate } from 'react-router-dom';

// Sample data
const data = [
  {
    sno: 1,
    status: "Pending",
    runsheetId: "1224544555",
    riderName: "Maruti S",
    contactNo: "123456789",
  },
  {
    sno: 2,
    status: "Pending",
    runsheetId: "1224544555",
    riderName: "Jane Doe",
    contactNo: "123456789",
  },
  {
    sno: 3,
    status: "Pending",
    runsheetId: "1224544555",
    riderName: "Michael Johnson",
    contactNo: "123456789",
  },
  {
    sno: 4,
    status: "Active",
    runsheetId: "1224544555",
    riderName: "Emily Davis",
    contactNo: "123456789",
  },
  {
    sno: 5,
    status: "Active",
    runsheetId: "1224544555",
    riderName: "Robert Brown",
    contactNo: "123456789",
  },
  // Add more entries as needed
];

const Runsheet = () => {
    const navigate = useNavigate();

    const handleViewDetailsClick = () => {
      navigate('/app/orders/runsheet/ViewRunSheet');
    };
    const handlecreateRunSheet = () => {
        navigate('/app/orders/runsheet/CreateRunSheet');
      };
  const columns = [
    { id: "sno", header: "Sno.", cell: (item) => item.sno },
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
      id: "runsheetId",
      header: "Runsheet ID",
      cell: (item) => item.runsheetId,
    },
    { id: "riderName", header: "Rider Name", cell: (item) => item.riderName },
    { id: "contactNo", header: "Contact No", cell: (item) => item.contactNo },
    {
      id: "action",
      header: "Action",
      cell: () => <Button variant="inline-link" onClick={handleViewDetailsClick}>View Details</Button>,
    },
  ];


  return (
    <Box>
          <SpaceBetween direction="vertical" size="m">
      <BreadcrumbGroup
        items={[
          { text: "Dashboard", href: "#" },
          { text: "Logistics", href: "#" },
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
          <Input placeholder="Search Runsheet, agent" />
    
          <Button variant="primary" iconName="add-plus" onClick={handlecreateRunSheet}>Create Runsheet</Button>
      
        </Grid>

        <Table
          variant="borderless"
          columnDefinitions={columns}
          items={data}
         
          pagination={<Pagination currentPageIndex={1} pagesCount={5} />}
          //   stickyHeader
        />
      </SpaceBetween>
    </Box>
  );
};

export default Runsheet;
