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
import html2canvas from 'html2canvas';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import { fetchRiderById } from "Redux-Store/RiderSummary/RiderSummaryThunk";
import { useMediaQuery } from 'react-responsive';


// Helper function to get document labels
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
      return "Vehicle Image";
    case "rcFront":
      return "RC Book Front";
    case "rcBack":
      return "RC Book Back";
    default:
      return docName;
  }
};

const ApproveRider = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const { id: riderId } = useParams();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [base64, setBase64] = useState('');
  const riderDetails = useSelector((state) => state.riders.rider);
  const dispatch = useDispatch();

  useEffect(() => {
    if (riderId) {
      dispatch(fetchRiderById(riderId));
    }
  }, [riderId, dispatch]);

  useEffect(() => {
    if (selectedDocument?.image) {
      const imageUrl = selectedDocument.image;

      // Fetch the image as a blob and convert it to base64
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setBase64(reader.result); // Set the base64 result
          };
          reader.readAsDataURL(blob); // Convert blob to base64
        })
        .catch((error) => {
          console.error('Error converting image to base64:', error);
        });
    }
  }, [selectedDocument]);

  // Function to handle document click
  const handleDocClick = (doc) => {
    setSelectedDocument(doc);
  };

  // Function to download PDF
  const downloadPDF = async () => {
 
    if (!selectedDocument || !base64) return;  // Ensure base64 is available

    try {
      const { name } = selectedDocument;
      const tempElement = document.createElement('div');
      tempElement.innerHTML = `
        <h4>${getDocumentLabel(name)}</h4>
        <img src="${base64}" alt="${name}" style="width: 300px; height: 300px; margin= 0 auto;" />
      `;
      document.body.appendChild(tempElement);

      // Use html2canvas to render the content into a canvas
      html2canvas(tempElement, { useCORS: true }).then((canvas) => {
        const pdf = new jsPDF();
        // Add the image to the PDF from the canvas
        pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0);
        pdf.save(`${name}.pdf`);
        document.body.removeChild(tempElement); // Cleanup the temporary element
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    // { text: 'Dashboard', href: '/app/dashboard' },
    // { text: 'Logistics', href: '/app/dashboard' },
    { text: 'Rider Summary', href: '/app/Logistics/RiderSummary/onboarding' },
    { text: 'Rider Details', href: '#' },
  ];
  return (
    <Box>
      <SpaceBetween direction="vertical" size="s">
        <BreadcrumbGroup items={breadcrumbItems} />
        <Header variant="h1">Approved Rider Details</Header>
        <Container header={<Header variant="h2">View Details</Header>}>
          <SpaceBetween direction="vertical" size="s">
            <hr />
            <Container>
              <Grid gridDefinition={[{ colspan: isMobile?12:2 }, { colspan: isMobile?12:10 }]}>
                <Box margin={{left:isMobile?"xxxl":""}}>
                  <img
                  
                    src={riderDetails?.documents[0]?.image}
                    alt="Rider"
                    style={{ width:'140px', height:"140px", borderRadius: "5px" }}
                  />
                </Box>
                <Box>
                  <div className="section-header">Personal Details</div>
                  <hr />
                  <Box>
                    <div className="rider-info">
                      <div className="info-item">
                        <span className="label">Rider Name :</span>
                        <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.fullName || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Date of Birth :</span>
                        <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.dob ? new Date(riderDetails.personalDetails.dob).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Contact No :</span>
                        <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.number || 'N/A'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Email :</span>
                        <span className="value" style={{width:isMobile?'120px':'300px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.email || 'N/A'}</span>
                      </div>
                    </div>
                  </Box>
                  <div className="section-header">Address Details</div>
                  <hr />
                  <div className="address-info">
                    <div className="info-item">
                      <span className="label">Address Line 1 :</span>
                      <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.address?.address1 || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address Line 2 :</span>
                      <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.address?.address2 || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">LandMark :</span>
                      <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.address?.landmark || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Select State :</span>
                      <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.address?.state || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Select City :</span>
                      <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.address?.city || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Pin Code :</span>
                      <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.address?.pincode || 'N/A'}</span>
                    </div>
                    <div className="section-header">References Contact</div>
                    <hr />
                    <div className="info-item">
                      <span className="label">Reference No :</span>
                      <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.reference?.number || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Relation :</span>
                      <span className="value" style={{width:'120px',marginLeft:'-15px'}}>{riderDetails?.personalDetails?.reference?.relation || 'N/A'}</span>
                    </div>   
                  </div>
                  <div className="section-header">KYC Documents Details <br>
                  </br> ( <i>Uploaded Documents </i> )</div>
                  <hr />
                  <SpaceBetween direction='vertical' size="s">
                  {riderDetails?.documents?.slice(1).map((doc) => (
                      selectedDocument && selectedDocument.name === doc.name ? (
                        <Container
                          key={doc.name}
                          header={<Header>{getDocumentLabel(doc?.name)}</Header>}
                          margin={{ top: 'm' }}
                        >
                          <ColumnLayout columns={2}>
                            <Box>
                              <img src={doc.image} alt={getDocumentLabel(doc?.name)} style={{ maxWidth: '100%' }} />
                              {/* <p>{getDocumentLabel(doc?.name)}</p> */}
                            </Box>
                       
                          </ColumnLayout>
                          <Box float='right'>
                            <div className="button-container">
                              <Button className="cancel-btn" onClick={downloadPDF}>Download PDF</Button>
                            </div>
                          </Box>
                        </Container>
                      ) : (
                        <div onClick={() => handleDocClick(doc)} style={{ position: "relative", width: "100%", cursor: "pointer" }}>
                          <div style={{ paddingBottom: "5px" }}>
                            <div key={doc.id} className="info-item">
                              <span className="label" style={{width:'30px',marginRight:'-15px'}}>Document:</span>
                              <span className="value" style={{width:isMobile?'200px':'150px', textAlign:'left',marginLeft:'-15px',marginRight:'-15px'}}>{getDocumentLabel(doc?.name)}</span>
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
                  <div className="address-info" style={{ 
                    maxWidth: isMobile ? '100%' : 'auto',
                    overflowX: isMobile ? 'auto' : 'visible',
                    padding: isMobile ? '10px' : '0',
                    whiteSpace: isMobile ? 'nowrap' : 'normal'
                  }}>
                    <div className="info-item">
                      <span className="label" style={{ width: "140px" }}>Bank Name: </span>
                      <span className="value" style={{width:'120px',marginLeft:isMobile?'-2px':'-25px'}}>{riderDetails?.bankDetails?.bankName || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label" style={{ width: "140px" }}>Account Number: {" "}</span>
                      <span className="value" style={{width:'180px',marginLeft: isMobile?'-2px':'-25px'}}> {" "} {riderDetails?.bankDetails?.acc || 'N/A'}09876543212</span>
                    </div>
                    <div className="info-item">
                      <span className="label" style={{ width: "140px" }}>IFSC Code:</span>
                      <span className="value" style={{width:'120px',marginLeft:isMobile?'-2px':'-25px'}}> {riderDetails?.bankDetails?.ifsc || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label" style={{ width: "140px" }}>Bank Status:</span>
                      <span className="value" style={{width:'120px',marginLeft:isMobile?'-2px':'-25px'}}>{riderDetails?.bankDetails?.status || 'N/A'}</span>
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
