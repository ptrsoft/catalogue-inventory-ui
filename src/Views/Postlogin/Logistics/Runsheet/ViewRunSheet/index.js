import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import {
  Box,

  Header,
  SpaceBetween,
  Input,
  BreadcrumbGroup,

} from "@cloudscape-design/components";
import { fetchRunsheetById } from 'Redux-Store/Runsheet/RunsheetThunk'; // Update with the correct path to your thunk

const ViewRunsheet = () => {
  const dispatch = useDispatch();
  const { selectedRunsheet, loading, error } = useSelector(state => state.runsheet); // Get selected runsheet data from the store

  
  const { id: runsheetId } = useParams(); // Use useParams to get the runsheetId from the URL

  useEffect(() => {
    // Fetch runsheet data by ID when the component mounts
    dispatch(fetchRunsheetById(runsheetId));
  }, [dispatch, runsheetId]);

  const orderIds = selectedRunsheet?.orders || []; // Use orders from fetched runsheet data


 

  // Loading and error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.messege}</p>;

  return (
    <Box>
      {/* Breadcrumbs */}
      <SpaceBetween direction="vertical" size="s">
        <BreadcrumbGroup
          items={[
            { text: "Logistics", href: "/app/dashboard" },
            { text: "Runsheet", href: "/app/Logistics/runsheet" },
            { text: "View Runsheet", href: "/runsheet/view" },
          ]}
          ariaLabel="Breadcrumbs"
        />
       
       <SpaceBetween direction="vertical" size="s">
        <div className="runsheet-container">
         
            {/* Runsheet Details */}
            <div className="details">
            <div className="info-row">
                          <span className="label">Date:</span>
                          <span className="value">
                          {selectedRunsheet?.createdAt.slice(0, 10) }
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Runsheet ID:</span>
                          <span className="value">
                          {selectedRunsheet?.id}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Rider Name:</span>
                          <b>
                          {selectedRunsheet?.rider.name}
                          </b>
                        </div>
                        <div className="info-row">
                          <span className="label">Rider ID:</span>
                          <b>
                          {selectedRunsheet?.rider?.id}
                          </b>
                        </div>
                        </div>

           

           
            </div>
            <div className="runsheet-container">

            {/* Line of Orders */}
            <Box fontWeight="bold" variant="h2">
              Line of orders <span style={{ color: "#000716", fontWeight: "700", fontSize: "14px" }}>({orderIds.length} Order)</span>
            </Box>
            <Header variant="h4">Order ID</Header>
            <SpaceBetween direction="vertical">
              {orderIds.map((orderId, index) => (
                <div style={{ width: "280px" }} key={index}>
                  <Input value={orderId} readOnly />
                </div>
              ))}
            </SpaceBetween>
        
        </div>
        </SpaceBetween>
      
      </SpaceBetween>
    </Box>
  );
};

export default ViewRunsheet;
