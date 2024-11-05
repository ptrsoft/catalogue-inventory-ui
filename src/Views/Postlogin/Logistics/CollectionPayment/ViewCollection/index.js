
import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  SpaceBetween,
  BreadcrumbGroup,
  Input,
  Header,
  FormField,
  Modal
} from "@cloudscape-design/components";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation,Navigate, useNavigate } from "react-router-dom";
import { fetchRunsheetById, closeRunsheet } from "Redux-Store/Runsheet/RunsheetThunk";

const ViewDetailsPage = () => {
  const navigate=useNavigate()
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const { id: runsheetId } = useParams();
  const { status } = location.state || {};
  const { selectedRunsheet, loading, error } = useSelector((state) => state.runsheet);
  const orderIds = selectedRunsheet?.orders || []; // Use orders from fetched runsheet data
  useEffect(() => {
    dispatch(fetchRunsheetById(runsheetId));
  }, [dispatch, runsheetId]);

  const handleCloseRunsheet = () => setIsModalOpen(true);

  const handleConfirmCloseRunsheet = (amount) => {
    console.log(amount,"from UI");
    dispatch(closeRunsheet({ id: runsheetId, amount }));
    setIsModalOpen(false);
    navigate("/app/Logistics/CollectionPayment", {
      state: { successMessage: "Runsheet Closed successfully!" },
    });
    setAmount(""); // Reset amount after confirming
  };

  const handleConfirm = () => {
    handleConfirmCloseRunsheet(amount);
  };

  return (
    <Box>
      <SpaceBetween direction="vertical" size="s">
        {/* Breadcrumbs */}
        <BreadcrumbGroup
          items={[
            { text: "Logistics", href: "/app/dashboard" },
            { text: "Runsheet", href: "/app/Logistics/runsheet" },
            { text: "View Runsheet", href: "/runsheet/view" },
          ]}
          ariaLabel="Breadcrumbs"
        />

        <SpaceBetween direction="vertical" size="s">
        <div
            className="runsheet-container"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* Runsheet Details */}
            <div className="details" style={{ width: "40%" }}>
              <div className="info-row">
                <span className="label">Date:</span>
                <span className="value">
                  {selectedRunsheet?.createdAt.slice(0, 10)}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Runsheet ID:</span>
                <span className="value">{selectedRunsheet?.id}</span>
              </div>
              <div className="info-row">
                <span className="label">Rider Name:</span>
                <b>{selectedRunsheet?.rider.name}</b>
              </div>
            </div>
            {status === "Cash Pending" && (
              <div className="status-container" style={{ width: "155px" }}>
                <Button
                  variant="primary"
                  onClick={handleCloseRunsheet}
                >
                  Close Runsheet
                </Button>
              </div>
            )}
              {status === "Cash Received" && (
              <div className="status-container" style={{ width: "300px" }}>
          
      <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
        <div style={{ fontWeight: "bold",width:"280px" }}>Runsheet Total Amount:</div>
        <Input value={selectedRunsheet?.amountCollected} readOnly />
  </div>
  
              </div>
            )}
          </div>
          <div className="runsheet-container">
            {/* Line of Orders */}
            <Box fontWeight="bold" variant="h2">
              Line of orders{" "}
              <span
                style={{
                  color: "#000716",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                ({orderIds.length} Order)
              </span>
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
          {/* /* Close Runsheet Modal */ }
          <Modal
            onDismiss={() => setIsModalOpen(false)}
            visible={isModalOpen}
            closeAriaLabel="Close modal"
            header="Close Runsheet"
            footer={
              <SpaceBetween direction="horizontal" size="s">
                <Button variant="link" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button 
                  variant="primary" 
                  onClick={handleConfirm} 
                  disabled={!amount} // Enable only if amount is entered
                >
                  Confirm
                </Button>
              </SpaceBetween>
            }
          >
            <Box margin={{ bottom: "s" }}>
              Did you collect the total amount of Rs.{selectedRunsheet?.amountCollectable} for Runsheet ID :{selectedRunsheet?.id}?
            </Box>
            <FormField label="Runsheet Total Amount">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.detail.value)}
                placeholder="Enter amount in Rs."
              />
            </FormField>
          </Modal>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
};

export default ViewDetailsPage;
