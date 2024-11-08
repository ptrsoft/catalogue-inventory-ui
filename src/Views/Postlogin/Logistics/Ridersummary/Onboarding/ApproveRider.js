import React, { useState, useEffect } from 'react'; 
import {
  Box,  
  Button,
  BreadcrumbGroup,
  Container,
  Header,
  SpaceBetween,
  Grid,
  ColumnLayout
} from '@cloudscape-design/components';
import jsPDF from 'jspdf';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import riderimg from "../../../../../assets/images/riderimage.jpeg";
import { fetchRiderById } from "Redux-Store/RiderSummary/RiderSummaryThunk"; 

const ApproveRider = () => {
  const { id: riderId } = useParams();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const riderDetails = useSelector((state) => state.riders.rider);
  const dispatch = useDispatch();

  useEffect(() => {
    if (riderId) {
      dispatch(fetchRiderById(riderId));
    }
  }, [riderId, dispatch]);

  const breadcrumbItems = [
    { text: 'Dashboard', href: '#' },
    { text: 'Logistics', href: '#' },
    { text: 'Rider Summary', href: '#' },
    { text: 'Rider Details', href: '#' },
  ];
 
  const handleDocClick = (doc) => {
    setSelectedDocument(doc);
  };

  const downloadPDF = () => {
    if (!selectedDocument) return;

    const pdf = new jsPDF();
    const { name, front, back } = selectedDocument;

    pdf.addImage(front, 'PNG', 10, 10, 180, 160);
    pdf.addPage(); 

    if (back) {
      pdf.addImage(back, 'PNG', 10, 10, 180, 160);
    }

    pdf.save(`${name}.pdf`);
  };

  return (
    <Box>
      <SpaceBetween direction="vertical" size="s">
        <BreadcrumbGroup items={breadcrumbItems} />
        <Header variant="h1">Approved Rider Details</Header>
        <Container header={<Header variant="h2">View Details</Header>}>
          <SpaceBetween direction="vertical" size="s">
            <hr />
            <Container>
              <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
                <Box>
                  <img
                  
                    src={riderDetails?.documents[0]?.image}
                    alt="Rider"
                    style={{ width: '180px', height: "140px", borderRadius: "5px" }}
                  />
                </Box>
                <Box>
                  <div className="section-header">Personal Details</div>
                  <hr />
                  <Box>
                    <div className="rider-info">
                      <div className="info-item">
                        <span className="label">Rider Name :</span>
                        <span className="value">{riderDetails?.personalDetails?.fullName || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Date of Birth :</span>
                        <span className="value">{riderDetails?.personalDetails?.dob ? new Date(riderDetails.personalDetails.dob).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Contact No :</span>
                        <span className="value">{riderDetails?.number || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Email :</span>
                        <span className="value">{riderDetails?.personalDetails?.email || 'N/A'}</span>
                      </div>
                    </div>
                  </Box>
                  <div className="section-header">Address Details</div>
                  <hr />
                  <div className="address-info">
                    <div className="info-item">
                      <span className="label">Address Line 01 :</span>
                      <span className="value">{riderDetails?.personalDetails?.address?.address1 || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address Line 02 :</span>
                      <span className="value">{riderDetails?.personalDetails?.address?.address2 || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">LandMark :</span>
                      <span className="value">{riderDetails?.personalDetails?.address?.landmark || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Select State :</span>
                      <span className="value">{riderDetails?.personalDetails?.address?.state || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Select City :</span>
                      <span className="value">{riderDetails?.personalDetails?.address?.city || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Pin Code :</span>
                      <span className="value">{riderDetails?.personalDetails?.address?.pincode || 'N/A'}</span>
                    </div>
                    <div className="section-header">References Contact</div>
                    <hr />
                    <div className="info-item">
                      <span className="label">Reference Name :</span>
                      <span className="value">{riderDetails?.personalDetails?.reference?.number || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Relation :</span>
                      <span className="value">{riderDetails?.personalDetails?.reference?.relation || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="section-header">KYC Documents Details ( <i>Uploaded Documents </i> )</div>
                  <hr />
                  <SpaceBetween direction='vertical' size="s">
                    {riderDetails?.documents?.map((doc) => (
                      selectedDocument && selectedDocument.name === doc.name ? (
                        <Container
                          key={doc.name}
                          header={<Header>{selectedDocument.name}</Header>}
                          margin={{ top: 'm' }}
                        >
                          <ColumnLayout columns={2}>
                            <Box>
                              <img src={doc.image} alt={`${doc.name} (Front)`} style={{ maxWidth: '100%' }} />
                              <p>{`${doc.name} (Front)`}</p>
                            </Box>
                            <Box>
                              <img src={doc.image} alt={`${doc.name} (Back)`} style={{ maxWidth: '100%' }} />
                              <p>{`${doc.name} (Back)`}</p>
                            </Box>
                          </ColumnLayout>
                          <Box float='right'>
                            <div className="button-container">
                              <Button className="cancel-btn" onClick={downloadPDF}>Download PDF</Button>
                            </div>
                          </Box>
                        </Container>
                      ) : (
                        <div onClick={() => handleDocClick(doc)} style={{ position: "relative", width: "72vw", cursor: "pointer" }}>
                          <div style={{ paddingBottom: "5px" }}>
                            <div key={doc.id} className="info-item">
                              <span className="label">Document Name :</span>
                              <span className="value">{doc.name}</span>
                            </div>
                            <span>
                              <Button variant='inline-link' onClick={() => handleDocClick(doc)}>Download Or View</Button>
                            </span>
                          </div>
                        </div>
                      )
                    ))}
                  </SpaceBetween>

                  <div className="section-header">Bank Details</div>
                  <hr />
                  <div className="address-info">
                    <div className="info-item">
                      <span className="label" style={{ width: "180px" }}>Bank Name: </span>
                      <span className="value">{riderDetails?.bankDetails?.bankName || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label" style={{ width: "180px" }}>Account Number:</span>
                      <span className="value">{riderDetails?.bankDetails?.acc || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label" style={{ width: "180px" }}>IFSC Code:</span>
                      <span className="value">{riderDetails?.bankDetails?.ifsc || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label" style={{ width: "180px" }}>Bank Status:</span>
                      <span className="value">{riderDetails?.bankDetails?.status || 'N/A'}</span>
                    </div>
                  </div>
                </Box>
              </Grid>
            </Container>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>
  );
};

export default ApproveRider;
