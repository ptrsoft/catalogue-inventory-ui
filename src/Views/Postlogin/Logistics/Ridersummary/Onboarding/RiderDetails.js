import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  BreadcrumbGroup,
  Container,
  Modal,
  Textarea,
  Header,
  Input,
  SpaceBetween,
  Tabs,
  StatusIndicator,
  Icon,
} from "@cloudscape-design/components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector

import { fetchRiderById } from "Redux-Store/RiderSummary/RiderSummaryThunk"; //
import {
  verifyOrRejectDocument,
  updateRiderStatus,
} from "Redux-Store/RiderSummary/RiderSummaryThunk";
//importing  Custom Components
import AddressTab from "./RiderDetailsComponents/AddressTab";
import PersonalDetails from "./RiderDetailsComponents/PersonalDetails.js";
import { useMediaQuery } from "react-responsive";
const RiderDetails = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const { id: riderId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const riderDetails = useSelector((state) => state.riders.rider);
//fetching particular rider details
  useEffect(() => {
    if (riderId) {
      dispatch(fetchRiderById(riderId));
    }
  }, [riderId, dispatch]);
// when rejected rider details fetched active tab  changing
  useEffect(() => {
    if (location.state && location.state.activeTab !== undefined) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleTabChange = (event) => {
    setActiveTab(event.detail.activeTabId);
  };

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
  };
  const handleVerifybank = () => {
    // Update verification status based on name
    dispatch(
      verifyOrRejectDocument({
        document: "bankDetails",
        status: "verified",
        id: riderDetails.id,
      })
    );
  };

  const handleVerify = () => {
    if (selectedDoc) {
      console.log(selectedDoc.name, "name");
      // Update verification status based on name
      dispatch(
        verifyOrRejectDocument({
          document: selectedDoc.name,
          status: "verified",
          id: riderDetails.id,
        })
        
      );
      setSelectedDoc(null);
    }
  };
  const [isRejectModalVisible, setRejectModalVisible] = useState(false);
  const [isRejecDirectlyModalVisible, setRejectDirectlyModalVisible] =
    useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [DirectrejectReason, setDirectRejectReason] = useState("");
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.address1}, ${address.address2}, ${address.landmark}, ${address.city}, ${address.state} ${address.pincode}`;
  };
  const HandleDirectlyReject = () => {
    setRejectDirectlyModalVisible(true);
  };
  const handleRejectClick = () => {
    setRejectModalVisible(true);
  };
  const handleRejectConfirm = () => {
    if (selectedDoc) {
      dispatch(
        verifyOrRejectDocument({
          id: riderDetails.id,
          document: selectedDoc.name,
          reason: rejectReason,
          status: "rejected",
        })
      );
      setRejectModalVisible(false);
      setRejectReason("");
      setSelectedDoc(null);
    }
  };
  const navigate = useNavigate();
  const handleApprove = async () => {
    try {
      await dispatch(
        updateRiderStatus({ id: riderId, status: "active" })
      ).unwrap();
      navigate("/app/Logistics/RiderSummary", {
        state: { successMessage: `Rider ID ${riderId}.${riderDetails?.PersonalDetails?.fullName}rider account Created Successfully.`  },
      });
    } catch (error) {
      console.error("Failed to update rider status:", error);
      // Handle error (e.g., show error message to the user)
    }
  };
  const handleDirectRejectionConfirm = async () => {
    try {
     await dispatch(
      updateRiderStatus({
        id: riderId,
        reason: DirectrejectReason,
        status: "rejected", // Pass rejected status here
      })
    ).unwrap();
    navigate("/app/Logistics/RiderSummary/Onboarding",{
      state: { RejectedMessege: `Rider ID ${riderId}.${riderDetails?.PersonalDetails?.fullName} Rejected` },
    });
  } catch (error) {
    console.error("Failed to update rider status:", error);
    // Handle error (e.g., show error message to the user)
  };
    setRejectDirectlyModalVisible(false);
    setDirectRejectReason("");
  };
  // Function to check if all documents are verified
  const areAllDocumentsVerified = () => {
    return riderDetails?.documents?.every((doc) => doc.verified === "verified");
  };
  const getDocumentLabel = (docName) => {
    switch (docName) {
      case "userPhoto":
        return "Rider Photo";
      case "aadharFront":
        return "Aadhar Card Front";
      case "aadharback":
        return "Aadhar Card Back";
      case "drivingFront":
        return "Driving License Front";
        case "drivingBack":
          return "Driving License Back";
      case "pan":
        return "Pan Card";
      case "VehicleImage":
        return "Vehicle  Image";
      case "rcFront":
        return "RC Book Front";
        case "rcBack":
        return "RC Book Back";
      // Add more cases as needed
      default:
        return docName;
    }
  };

  const breadcrumbItems = [
    // { text: "Dashboard", href: "/app/dashboard" },
    // { text: "Logistics", href: "/app/dashboard" },
    { text: "Rider Summary", href: "/app/Logistics/RiderSummary/onboarding" },
    { text: "Rider Details", href: "#" },
  ];
  console.log(riderDetails?.reviewStatus);

  return (
    <Box>
      <SpaceBetween direction="vertical" size="s">
        <BreadcrumbGroup items={breadcrumbItems} />
        <Header
          variant={isMobile ? "h3" : "h1"}
          actions={
            <div class="button-container" >
              <button
                className="cancel-btn"
                style={{
                  borderRadius: "16px",
                  fontSize: "14px",
                  marginRight: isMobile ? "-10px" : "0px",
                  border: `2px solid ${
                    riderDetails?.reviewStatus === "rejected"
                      ? "#5F6B7A"
                      : "red"
                  }`,
                  backgroundColor:
                    riderDetails?.reviewStatus === "rejected"
                      ? "white"
                      : "initial",
                  color:
                    riderDetails?.reviewStatus === "rejected"
                      ? "#5F6B7A"
                      : "red",
                  cursor:
                    riderDetails?.reviewStatus === "rejected"
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={HandleDirectlyReject}
                disabled={riderDetails?.reviewStatus === "rejected"}
              >
                Reject
              </button>
              {isRejecDirectlyModalVisible && (
                <Modal
                  onDismiss={() => setRejectDirectlyModalVisible(false)}
                  visible={isRejecDirectlyModalVisible}
                  header="Rider Document Rejected"
                  footer={
                    <Box float="right">
                      <Button
                        variant="primary"
                        onClick={handleDirectRejectionConfirm}
                      >
                        Confirm Rejection
                      </Button>
                    </Box>
                  }
                >
                  <SpaceBetween direction="vertical" size="s">
                    <hr></hr>
                    <Box fontWeight="heavy" variant="h2">
                      {riderDetails?.personalDetails?.fullName}
                    </Box>
                    <Box>{riderDetails?.personalDetails?.dob.slice(0, 10)}</Box>
                    <Box>{riderDetails.number}</Box>
                    <Box>{riderDetails?.personalDetails?.email}</Box>
                    <Box>
                      {formatAddress(riderDetails?.personalDetails?.address)}
                    </Box>
                    <hr></hr>
                    <Box>
                      <Header variant="h5">Reason</Header>
                      <Textarea
                        value={DirectrejectReason}
                        onChange={(e) => setDirectRejectReason(e.detail.value)}
                        placeholder="Enter rejection reason"
                      />
                    </Box>
                  </SpaceBetween>
                </Modal>
              )}

              <Button
                variant="primary"
                // disabled={
                //   (!areAllDocumentsVerified() && riderDetails?.bankDetails?.status) || 
                //   riderDetails?.reviewStatus === "rejected"
                // }
                
                
                onClick={handleApprove}
              >
                Approve
              </Button>
            </div>
          }
        >
          Rider Details
        </Header>
        <Container header={<Header variant="h2">View Details</Header>}>
          <SpaceBetween direction="vertical" size="s">
            <hr />
            <PersonalDetails riderDetails={riderDetails} />
            <Tabs
              activeTabId={activeTab}
              onChange={handleTabChange}
              tabs={[
                {
                  label: "Address",
                  id: 0,
                  content: <AddressTab riderDetails={riderDetails} />,
                },
                {
                  label: "Rider Document",
                  id: 1,
                  content: (
                    <SpaceBetween direction="vertical" size="xs">
                      {riderDetails?.documents?.slice(1).map((doc) => 
                      
                        selectedDoc && selectedDoc.name === doc.name ? (
                          <Container
                            key={doc.name}
                            header={
                              <Header>{getDocumentLabel(doc?.name)}</Header>
                            }
                          >
                          
                              <Box>
                                <img
                                  src={doc.image}
                                  alt={getDocumentLabel(doc?.name)}
                                  style={{ width: "300px",height:"300px" }}
                                />
                                {/* <p>{getDocumentLabel(doc?.name)}</p> */}
                              </Box>
                          
                            <Box float="right">
                              <div className="button-container">
                                <button
                                  className="cancel-btn"
                                  onClick={handleRejectClick}
                                  disabled={doc.verified === "verified"}
                                  style={{
                                    border: `2px solid ${
                                      doc.verified === "verified"
                                        ? "#5F6B7A"
                                        : "red"
                                    }`,
                                    cursor:
                                      doc.verified === "verified"
                                        ? "not-allowed"
                                        : "pointer",
                                    color:
                                      doc.verified === "verified"
                                        ? "#5F6B7A"
                                        : "red",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      doc.verified === "verified"
                                        ? "#C0C0C0"
                                        : "#FFB3B3";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      doc.verified === "verified"
                                        ? "#F5F5F5"
                                        : "#FFCCCC";
                                  }}
                                >
                                  Cancel
                                </button>
                                {isRejectModalVisible && (
                                  <Modal
                                    onDismiss={() =>
                                      setRejectModalVisible(false)
                                    }
                                    visible={isRejectModalVisible}
                                    header="Rider Document Rejected"
                                    footer={
                                      <Box float="right">
                                        <Button
                                          onClick={handleRejectConfirm}
                                          variant="primary"
                                        >
                                          Confirm
                                        </Button>
                                      </Box>
                                    }
                                  >
                                    <SpaceBetween direction="vertical" size="s">
                                      <hr></hr>
                                      <Box fontWeight="heavy" variant="h2">
                                        {
                                          riderDetails?.personalDetails
                                            ?.fullName
                                        }
                                      </Box>
                                      <Box>
                                        {riderDetails?.personalDetails?.dob.slice(
                                          0,
                                          10
                                        )}
                                      </Box>
                                      <Box>{riderDetails.number}</Box>
                                      <Box>
                                        {riderDetails?.personalDetails?.email}
                                      </Box>
                                      <Box>
                                        {formatAddress(
                                          riderDetails?.personalDetails?.address
                                        )}
                                      </Box>
                                      <hr></hr>
                                      <Box>
                                        <Header variant="h5">Reason</Header>
                                        <Textarea
                                          value={rejectReason}
                                          onChange={(e) =>
                                            setRejectReason(e.detail.value)
                                          }
                                          placeholder="Enter rejection reason"
                                        />
                                      </Box>
                                    </SpaceBetween>
                                  </Modal>
                                )}

                                <button
                                  className="print-btn"
                                  onClick={handleVerify}
                                  disabled={doc.verified === "verified"}
                                  style={{
                                    backgroundColor:
                                      doc.verified === "verified"
                                        ? "#E9EBED"
                                        : "green",
                                    cursor:
                                      doc.verified === "verified"
                                        ? "not-allowed"
                                        : "pointer",
                                    color:
                                      doc.verified === "verified"
                                        ? "#7D8998"
                                        : "white",
                                  }}
                                >
                                  Verify Document
                                </button>
                              </div>
                            </Box>
                          </Container>
                        ) : (
                          <div
                            key={doc.name}
                            onClick={() => handleDocClick(doc)}
                            style={{
                              position: "relative",
                              width: "72vw",
                              cursor: "pointer",
                            }}
                          >
                            <Input
                              readOnly
                              value={getDocumentLabel(doc?.name)}
                              ariaLabel={doc.name}
                              className="document-input"
                            />
                            <div
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#8c8c8c",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <span style={{ fontSize: "13px" }}>
                                {doc.verified}
                              </span>
                              <StatusIndicator
                                type={
                                  doc.verified === "verified"
                                    ? "success"
                                    : doc.verified === "rejected"
                                    ? "error"
                                    : "pending"
                                }
                              />
                            </div>
                          </div>
                        )
                      )}
                    </SpaceBetween>
                  ),
                },
                {
                  label: "Rider Bank Details",
                  id: 2,
                  content: (
                    <Container>
                      {riderDetails ? (
                        <div className="address-info" style={{
                          // maxWidth: isMobile ? '100%' : 'auto',
                          overflowX: isMobile ? 'auto' : 'visible',
                          // padding: isMobile ? '10px' : '0',
                          whiteSpace: isMobile ? 'nowrap' : 'normal'
                        }}>
                          <div className="info-item">
                            <span className="label" style={{ width: "180px" }}>
                              Bank Name:{" "}
                            </span>
                            <span className="value">
                              {riderDetails.bankDetails.bankName}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label" style={{ width: "180px" }}>
                              Account Number:{" "}
                            </span>
                            <span className="value">
                              {riderDetails.bankDetails.acc}iuugfugfugyfuigdyfu
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label" style={{ width: "180px" }}>
                              Re-enter Account Number:{" "}
                            </span>
                            <span className="value">
                              {riderDetails.bankDetails.acc}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="label" style={{ width: "180px" }}>
                              IFSC Code:{" "}
                            </span>
                            <span className="value">
                              {riderDetails.bankDetails.ifsc}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>Loading...</div>
                      )}
                      <Box float="right">
                        <button
                          className="print-btn"
                          style={{
                            backgroundColor:
                              riderDetails?.bankDetails?.status === "verified"
                                ? "#5F6B7A"
                                : riderDetails?.bankDetails?.status ===
                                  "rejected"
                                ? "red"
                                : riderDetails?.bankDetails?.status ===
                                  "pending"
                                ? "#037F0C"
                                : "#037F0C", // Background color when disabled
                            display: "flex",
                            gap: "5px",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "11px",
                            color: "white",
                          }}
                          disabled={
                            riderDetails?.bankDetails?.status === "verified"
                          }
                          onClick={handleVerifybank}
                        >
                          <p>Verify Details</p>

                          {riderDetails?.bankDetails?.status === "rejected" ? (
                            <Icon name="status-negative" size="small" />
                          ) : (
                            <Icon name="status-positive" size="small" />
                          )}
                        </button>
                      </Box>
                    </Container>
                  ),
                },
              ]}
            />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>
  );
};

export default RiderDetails;
