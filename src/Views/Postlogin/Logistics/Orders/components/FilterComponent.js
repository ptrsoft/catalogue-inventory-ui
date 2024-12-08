import React from "react";
import { Select,Grid } from "@cloudscape-design/components"; // Assuming you're using Cloudscape Design components

const FilterComponent = ({
  statuscategory,
  ageFilter,
  shifts,
  category,
  currentPage,
  pincode,
  onFilterChange,
}) => {
  // Reusable function to notify parent of filter updates
  const updateFilterState = (filterName, value) => {
    console.log(filterName, value, "values from compo");
    onFilterChange({ [filterName]: value });
  };





const statusOptions = [
   
  { label: "Order Placed", value: "order placed" },
  { label: "Cancel Orders", value: "cancelled" },
  { label: "Packed", value: "packed" },
  { label: "Order Processing", value: "order processing" },
  { label: "On The Way", value: "on the way" },
  { label: "Delivered", value: "delivered" },
  { label: "Undelivered", value: "undelivered" },

  // Add other statuses if needed
];
const ageOptions = [
  { label: "7 days old delivered", value: "7" },
  { label: "last 14 days old delivered", value: "14" },
  { label: " last 1 month old delivered", value: "1m" },
  { label: " last 2 months old delivered", value: "2m" },
  { label: "Older", value: "older" },
];



const categoryOptions = [
    { label: "All", value: "" },
    { label: "Cash On Delivery", value: "cash" },
    { label: "Prepaid", value: "online" },
    // Add other statuses if needed
  ];
  //shifts options
  const shiftOptions = [
    { label: "All", value: "" },
    { label: "Morning", value: "morning" },
    { label: "Evening", value: "evening" },
    // Add other statuses if needed
  ];
    //shifts options
    const pincodeOptions = [
      { label: "500064", value: "500064" },
      { label: "500065", value: "500065" },
      { label: "500066", value: "500066" },
      // Add other statuses if needed
    ];


  return (
    <Grid
    gridDefinition={[
    
      { colspan: { default: 12, xxs: 3 } },
      { colspan: { default: 12, xxs: 3 } },
      { colspan: { default: 12, xxs: 2 } },
      { colspan: { default: 12, xxs: 2 } },
      { colspan: { default: 12, xxs: 2 } },
    ]}
  >
      {/* Status Filter */}
      <Select
        selectedOption={statuscategory}
        onChange={({ detail }) =>
          updateFilterState("statuscategory", detail.selectedOption)
        }
        options={statusOptions}
        placeholder="Sort By Status"
        selectedAriaLabel="Selected status"
      />
         {/* Payment Filter */}
         <Select
        selectedOption={category}
        onChange={({ detail }) =>
          updateFilterState("category", detail.selectedOption)
        }
        options={categoryOptions}
        placeholder="Filter By Payment"
        selectedAriaLabel="Selected payment"
      />

      {/* Age Filter */}
         {statuscategory?.value === "delivered" && (
        
      <Select
        selectedOption={ageFilter}
        onChange={({ detail }) =>
          updateFilterState("ageFilter", detail.selectedOption)
        }
        options={ageOptions}
        placeholder="Filter By Date"
        selectedAriaLabel="Selected age"
      />
      )}
          <Select
        selectedOption={pincode}
        onChange={({ detail }) =>
          updateFilterState("pincode", detail.selectedOption)
        }
        options={pincodeOptions}
        placeholder="Select Pincode"
    
        filteringType="auto"
        filteringPlaceholder="Search Pincode" // Placeholder for the search bar

      />

      {/* Shifts Filter */}
      <Select
        selectedOption={shifts}
        onChange={({ detail }) =>
          updateFilterState("shifts", detail.selectedOption)
        }
        options={shiftOptions}
        placeholder="Filter By Shifts"
        selectedAriaLabel="Selected shift"
      />
     

   

   
    </Grid>
  );
};

export default FilterComponent;
