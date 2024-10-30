import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  BreadcrumbGroup,
  Container,
  FormField,
  Header,
  Input,
  SpaceBetween,
  Tabs,
  Grid,
  ColumnLayout,
  StatusIndicator,
  Icon,
} from "@cloudscape-design/components";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector

import { fetchRiderById } from "Redux-Store/RiderSummary/RiderSummaryThunk"; //
import { verifyOrRejectDocument } from "Redux-Store/RiderSummary/RiderSummaryThunk";

const RiderDetails = () => {
  const { id: riderId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const riderDetails = useSelector((state) => state.riders.rider);

  useEffect(() => {
    if (riderId) {
      dispatch(fetchRiderById(riderId));
    }
  }, [riderId, dispatch]);

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

  const handleVerify = () => {
    if (selectedDoc) {
      console.log(selectedDoc.name, "name");
      // Update verification status based on name
      dispatch(
        verifyOrRejectDocument({
          name: selectedDoc.name,
          status: "verified",
          id: riderDetails.id,
        })
      );
      setSelectedDoc(null);
    }
  };

  const handleReject = () => {
    if (selectedDoc) {
      dispatch(
        verifyOrRejectDocument({
          name: selectedDoc.name,
          status: "rejected",
          id: riderDetails.id,
          reason: "not clear",
        })
      );
      setSelectedDoc(null);
    }
  };

  const breadcrumbItems = [
    { text: "Dashboard", href: "#" },
    { text: "Logistics", href: "#" },
    { text: "Rider Summary", href: "#" },
    { text: "Rider Details", href: "#" },
  ];

  return (
    <Box>
      <SpaceBetween direction="vertical" size="s">
        <BreadcrumbGroup items={breadcrumbItems} />
        <Header
          variant="h1"
          actions={
            <div class="button-container">
              <button
                class="cancel-btn"
                style={{ borderRadius: "16px", fontSize: "14px" }}
                // onClick={() => handleOpenModal(selectedOrder?.userInfo?.id)}
              >
                Reject
              </button>

              <Button disabled>Approve</Button>
            </div>
          }
        >
          Rider Details
        </Header>
        <Container header={<Header variant="h2">View Details</Header>}>
          <SpaceBetween direction="vertical" size="s">
            <hr />
            <Container>
              <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
                <Box>
                  <img
                    src={riderDetails?.documents[0].image}
                    alt="Rider"
                    style={{ width: "180px", height: "140px" }}
                  />
                </Box>
                <Box>
                  <Header variant="h3">Personal Details</Header>
                  <hr />
                  <Box>
                    {riderDetails ? (
                      <div className="rider-info">
                        <div className="info-item">
                          <span className="label">Rider Name :</span>
                          <span className="value">
                            {riderDetails.personalDetails.fullName}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Date of Birth :</span>
                          <span className="value">
                            {new Date(
                              riderDetails.personalDetails.dob
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Contact No :</span>
                          <span className="value">{riderDetails.number}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Email :</span>
                          <span className="value">
                            {riderDetails.personalDetails.email}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>Loading...</div>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Container>
            <Tabs
              activeTabId={activeTab}
              onChange={handleTabChange}
              tabs={[
                {
                  label: "Address",
                  id: 0,
                  content: (
                    <Container>
                      {riderDetails ? (
                        <Box>
                          <div className="address-info">
                            <div className="info-item">
                              <span className="label">Address Line 01 :</span>
                              <span className="value">
                                {riderDetails.personalDetails.address.address1}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Address Line 02 :</span>
                              <span className="value">
                                {riderDetails.personalDetails.address.address2}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">LandMark :</span>
                              <span className="value">
                                {riderDetails.personalDetails.address.landmark}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">State :</span>
                              <span className="value">
                                {riderDetails.personalDetails.address.state}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">City :</span>
                              <span className="value">
                                {riderDetails.personalDetails.address.city}
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Pin Code :</span>
                              <span className="value">
                                {riderDetails.personalDetails.address.pincode}
                              </span>
                            </div>
                            <div className="section-header">
                              References Contact
                            </div>
                            <hr />
                            <div className="info-item">
                              <span className="label">Name:</span>
                              <span className="value">
                                {
                                  riderDetails?.personalDetails?.reference
                                    ?.fatherName
                                }
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Relation:</span>
                              <span className="value">
                                {
                                  riderDetails?.personalDetails?.reference
                                    ?.relation
                                }
                              </span>
                            </div>
                            <div className="info-item">
                              <span className="label">Contact No:</span>
                              <span className="value">
                                {
                                  riderDetails?.personalDetails?.reference
                                    ?.number
                                }
                              </span>
                            </div>
                          </div>
                        </Box>
                      ) : (
                        <div>Loading...</div>
                      )}
                    </Container>
                  ),
                },
                {
                  label: "Rider Document",
                  id: 1,
                  content: (
                    <SpaceBetween direction="vertical" size="s">
                      {riderDetails?.documents.map((doc) =>
                        selectedDoc && selectedDoc.name === doc.name ? (
                          <Container
                            key={doc.name}
                            header={<Header>{doc.name}</Header>}
                          >
                            <ColumnLayout columns={2}>
                              <Box>
                                <img
                                  src={doc.image}
                                  alt={`${doc.name} (Front)`}
                                  style={{ maxWidth: "100%" }}
                                />
                                <p>{`${doc.name} (Front)`}</p>
                              </Box>
                            </ColumnLayout>
                            <Box float="right">
                              <div className="button-container">
                                <button
                                  className="cancel-btn"
                                  onClick={handleReject}
                                >
                                  Reject Document
                                </button>
                                <button
                                  className="print-btn"
                                  style={{ backgroundColor: "green" }}
                                  onClick={handleVerify}
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
                              value={doc.name}
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
                        <div className="address-info">
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
                              {riderDetails.bankDetails.acc}
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
                              IFC Code:{" "}
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
                            backgroundColor: "green",
                            display: "flex",
                            gap: "5px",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "11px",
                          }}
                        >
                          <p>Verify Details</p>
                          <Icon name="status-positive" size="small"></Icon>
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
