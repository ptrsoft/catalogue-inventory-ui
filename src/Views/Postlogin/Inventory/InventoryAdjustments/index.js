import React, { useEffect, useState } from 'react';
import {
  BreadcrumbGroup,
  Table,
  Box,
  SpaceBetween,
  Button,
  TextFilter,
  Header,
  Pagination
} from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { fetchAdjustments } from 'Redux-Store/InventoryAdjustments/InventoryAdjustmentsThunk';
import { format } from 'date-fns'; // Import date-fns format function
import { useMediaQuery } from 'react-responsive';

const InventoryAdjustments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filteringText, setFilteringText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  // Fetch adjustments data from Redux store
  const { data = [], status } = useSelector((state) => state.InvertorAdjustments.adjustments);

  useEffect(() => {
    dispatch(fetchAdjustments());
  }, [dispatch]);

  // Handle loading and error states
  if (status === "LOADING") {
    return (
      <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
        <Header>Loading...</Header>
      </Box>
    );
  }

  if (status === "ERROR") {
    return (
      <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
        <Header>Error fetching data</Header>
      </Box>
    );
  }

  // Ensure data.items exists and is an array
  const items = Array.isArray(data.items) ? data.items : [];

  // Apply filtering
  const filteredItems = items.filter(item =>
    [item.adjustmentNumber, item.reason, item.description, item.date, item.adjustBy]
      .some(field => field?.toLowerCase().includes(filteringText.toLowerCase()))
  );

  const itemsPerPage = 13;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPageIndex - 1) * itemsPerPage,
    currentPageIndex * itemsPerPage
  );

  const handleNavigate = () => {
    navigate("/app/inventory/create-adjustment");
  };

  return (
    <>
      <BreadcrumbGroup
        items={[
          { text: "Dashboard", href: "/app/dashboard" },
          { text: "Inventory Adjustments", href: "#components" }
        ]}
        ariaLabel="Breadcrumbs"
      />
      <div style={{ marginTop: 10 }}>
        <Table

        
          variant='borderless'
          renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
          }


          
          columnDefinitions={[
            {
              id: "adjustmentNumber",
              header: "Adjustment No.",
              cell: e => <span style={{ color: "#192534", fontWeight: "700" }}>
                SA-{e.id}
              </span>,
              isRowHeader: true,
            },
            {
              id: "reason",
              header: "Reason",
              cell: e => e.reason,
            },
            {
              id: "description",
              sortingField: "description",
              header: "Description",
              cell: e => e.description
            },
            {
              id: "date",
              sortingField: "date",
              header: "Date",
              cell: e => format(new Date(e.date), 'yyyy-MM-dd') // Format the date without time
            },
            {
              id: "adjustBy",
              sortingField: "adjustBy",
              header: "Adjust By",
              cell: e => e.adjustBy || "Yahiya Aly Khan"
            }
          ]}
          items={paginatedItems}
          loadingText="Loading resources"
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No adjustments found</b>
                <Button onClick={handleNavigate}>Create adjustment</Button>
              </SpaceBetween>
            </Box>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Search"
              filteringText={filteringText}
              onChange={e => setFilteringText(e.detail.filteringText)}
            />
          }
          header={
            <Header
              variant='h2'
              actions={
                <Button onClick={handleNavigate} variant='primary' iconName='add-plus'>
                  {!isMobile && "New Adjustment"}
                </Button>
              }
            >
              Inventory Adjustments
            </Header>
          }
          pagination={
            <Pagination
              currentPageIndex={currentPageIndex}
              pagesCount={totalPages}
              onChange={e => setCurrentPageIndex(e.detail.currentPageIndex)}
            />
          }
        />
      </div>
    </>
  );
};

export default InventoryAdjustments;

