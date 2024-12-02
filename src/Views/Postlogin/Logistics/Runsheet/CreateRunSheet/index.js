import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Container,
  FormField,
  Header,
  Input,
  Select,
  SpaceBetween,
  ColumnLayout,
  BreadcrumbGroup,
  StatusIndicator,
  Grid
} from "@cloudscape-design/components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createRunsheet } from "Redux-Store/Runsheet/RunsheetThunk";
import { fetchRiders } from 'Redux-Store/RiderSummary/RiderSummaryThunk';
const CreateRunsheet = () => {
  const [orderIDs, setOrderIDs] = useState([""]);
  const [riderName, setRiderName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, response, error } = useSelector((state) => state.runsheet);

  const handleOrderIDChange = (index, value) => {
    const newOrderIDs = [...orderIDs];
    newOrderIDs[index] = value;
    setOrderIDs(newOrderIDs);

    // Add new empty input field if the user enters a valid Order ID
    if (value.length > 18 && index === orderIDs.length - 1) {
      setOrderIDs([...newOrderIDs, ""]);
    }
  };

  const handleSubmit = async () => {
    const filteredOrderIDs = orderIDs.filter((id) => id.trim() !== "");
    if (riderName && filteredOrderIDs.length > 0) {
      try {
        console.log(riderName.value, "name details");
  
        // Dispatch the API action and unwrap the result
        const result = await dispatch(
          createRunsheet({ riderId: riderName?.value, orders: filteredOrderIDs })
        ).unwrap();
  
        // If successful, navigate to the desired route
        navigate("/app/Logistics/runsheet", {
          state: { successMessage: "Runsheet created successfully!" },
        });
      } catch (error) {
        // Handle any errors from the API
        alert("Error: " + (error.message || "Unable to create runsheet."));
      }
    } else {
      alert("Please select a rider and add at least one valid Order ID.");
    }
  };
  
  

  // Check for successful response and navigate
  useEffect(() => {}, [response, navigate]);
  const { items } = useSelector((state) => state.riders);

  useEffect(() => {
    // Fetch riders with current status and page index
    dispatch(fetchRiders({ status: 'active' || ""}));

  }, [dispatch,]);
  return (
    <Box>
      <SpaceBetween direction="vertical" size="m">
        <BreadcrumbGroup
          items={[
            { text: "Logistics", href: "/app/dashboard" },
            { text: "Runsheet", href: "/app/Logistics/runsheet" },
            { text: "Create RunSheet", href: "/runsheet/view" },
          ]}
          ariaLabel="Breadcrumbs"
        />
        <Header variant="h1">Create Runsheet</Header>

        <div className="runsheet-container">
          <SpaceBetween size="m">
          <Grid
            gridDefinition={[
              { colspan: { default: 12, xxs: 3 } },
              { colspan: { default: 12, xxs: 4 } },
              { colspan: { default: 12, xxs: 2 } },
              { colspan: { default: 12, xxs: 3 } },
            ]}
          >
              <FormField label="Date. (Generated by default)">
                <Input
                  value={new Date().toISOString().slice(0, 10)}
                  readOnly
                  disabled
                />
              </FormField>
              <FormField label="Runsheet No. (Generated by default)">
                <Input value="" readOnly disabled />
              </FormField>

              <FormField label="Select Rider Name">
                <Select
                  selectedOption={riderName}
                  onChange={({ detail }) => setRiderName(detail.selectedOption)}
                  options={items.map((item) => ({
                    label: item?.personalDetails?.fullName, // Assuming 'name' contains the rider's name
                    value: item.id,   // Assuming 'id' contains the rider's ID
                  }))}
                  placeholder="Select Rider Name"
                />
              </FormField>
              <Box textAlign="center" float="right" margin={{ top: "l" }}>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  Create a Runsheet
                </Button>
              </Box>
            </Grid>
          </SpaceBetween>
        </div>

        <div className="runsheet-container">
          <Header variant="h3">Line of orders</Header>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "70px", textAlign: "start" }}>S.no</th>
                <th style={{ width: "300px", textAlign: "start" }}>Order ID</th>
              </tr>
            </thead>
            <tbody>
              {orderIDs.map((orderID, index) => (
                <tr key={index}>
                  <td>{String(index + 1).padStart(2, "0")}</td>
                  <td>
                    <Input
                      value={orderID}
                      onChange={(e) =>
                        handleOrderIDChange(index, e.detail.value)
                      }
                      placeholder="Enter Order ID"
                      ariaLabel={`Order ID ${index + 1}`}
                      autoFocus={index === orderIDs.length - 1}
                    />
                  </td>
                  <td>
                    {orderID.length > 5 ? (
                      <StatusIndicator type="success" />
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <Box color="text-status-error">{error.message}</Box>}
      </SpaceBetween>
    </Box>
  );
};

export default CreateRunsheet;
