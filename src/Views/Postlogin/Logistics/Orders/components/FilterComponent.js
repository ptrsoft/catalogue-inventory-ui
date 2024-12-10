import React from "react";
import { useEffect } from "react";
import { Select,Grid } from "@cloudscape-design/components"; // Assuming you're using Cloudscape Design components
import { getPincodes } from "Redux-Store/Pincode/pincodeThunk";
import { useSelector,useDispatch } from "react-redux";
import { Search } from "@mui/icons-material";
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
  const {
    data: pincodes,
    loading,
    error,
  } = useSelector((state) => state.pincode);
  console.log(pincodes,"pincode from filter");
  const dispatch =useDispatch()
// Fetch pincodes on component mount
useEffect(() => {
  // console.log(statusFilter?.value,"status");
  dispatch(getPincodes({search:"",status:"",type:""})); // Fetch pincodes from the API
}, [dispatch]);




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
  { label: "Today's Delivered Orders", value: "today" },
  { label: "Yesterday's Delivered Orders", value: "yesterday" },
  // { label: "7 days old delivered", value: "7" },
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
  
   // Dynamically create pincode options
   const pincodeOptions = pincodes?.items?.map((pincode) => ({
    label: pincode?.pincode,
    value: pincode?.pincode,
  }));


  return (
    <Grid
    gridDefinition={[
    
      { colspan: { default: 12, xxs: 2 } },
      { colspan: { default: 12, xxs: 2 } },
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
        placeholder="Status"
        selectedAriaLabel="Selected status"
      />
   
      {/* Age Filter */}
         {statuscategory?.value === "delivered" && (
        
      <Select
        selectedOption={ageFilter}
        onChange={({ detail }) =>
          updateFilterState("ageFilter", detail.selectedOption)
        }
        options={ageOptions}
        placeholder="Date"
        selectedAriaLabel="Selected age"
      />
      )}
          <Select
        selectedOption={pincode}
        onChange={({ detail }) =>
          updateFilterState("pincode", detail.selectedOption)
        }
        options={pincodeOptions}
        placeholder="Pincode"
    
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
        placeholder="Shifts"
        selectedAriaLabel="Selected shift"
      />
            {/* Payment Filter */}
            <Select
        selectedOption={category}
        onChange={({ detail }) =>
          updateFilterState("category", detail.selectedOption)
        }
        options={categoryOptions}
        placeholder="Payment"
        selectedAriaLabel="Selected payment"
      />

     

   

   
    </Grid>
  );
};

export default FilterComponent;
