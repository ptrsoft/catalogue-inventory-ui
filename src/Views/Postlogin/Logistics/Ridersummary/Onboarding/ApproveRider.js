import React, { useState } from 'react'; 
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
import riderimg from "../../../../../assets/images/riderimage.jpeg";

const documents = [
    { id: 1, name: 'Aadhar Card', front: riderimg, back: riderimg, status: 'Pending' },
    { id: 2, name: 'Pan Card', front: riderimg, back: riderimg, status: 'Pending' },
    { id: 3, name: 'Driving License', front: riderimg, back: riderimg, status: 'Pending' },
    { id: 4, name: 'Vehicle Image', front: riderimg, back: riderimg, status: 'Pending' },
    { id: 5, name: 'RC Book', front: riderimg, back: riderimg, status: 'Pending' },
];

const ApproveRider = () => {

  const [selectedDocument, setSelectedDocument] = useState(null);

  const breadcrumbItems = [
    { text: 'Dashboard', href: '#' },
    { text: 'Logistics', href: '#' },
    { text: 'Rider Summary', href: '#' },
    { text: 'Rider Details', href: '#' },
  ];
 
  const [docStatus, setDocStatus] = useState(documents);
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
        <Header variant="h1">Approve Rider Details</Header>
        <Container header={<Header variant="h2">View Details</Header>}>
          <SpaceBetween direction="vertical" size="s">
            <hr />
            <Container>
              <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
                <Box>
                  <img
                    src={riderimg}
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
                        <span className="value">Alfredo Aminoff</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Date of Birth :</span>
                        <span className="value">30/05/1998</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Contact No :</span>
                        <span className="value">9966996516</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Email :</span>
                        <span className="value">alfredoaminoff@gmail.com</span>
                      </div>
                    </div>
                  </Box>
                  <div className="section-header">Address Details</div>
                  <hr />
                  <div className="address-info">
                    <div className="info-item">
                      <span className="label">Address Line 01 :</span>
                      <span className="value">Suncity</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address Line 02 :</span>
                      <span className="value">Suncity</span>
                    </div>
                    <div className="info-item">
                      <span className="label">LandMark :</span>
                      <span className="value">Zeeshan Hotel</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Select State :</span>
                      <span className="value">Telangana</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Select City :</span>
                      <span className="value">Bandlaguda Jagir</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Pin Code :</span>
                      <span className="value">500081</span>
                    </div>
                    <div className="section-header">References Contact</div>
                    <hr />
                    <div className="info-item">
                      <span className="label">Father Name :</span>
                      <span className="value">Alfredo Aminoff</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Contact No :</span>
                      <span className="value">9966996516</span>
                    </div>
                  </div>
                  <div className="section-header">KYC Documents Details ( <i>Uploaded Documents </i> )</div>
                  <hr />
                  <SpaceBetween direction='vertical' size="s">
                    {docStatus.map((doc) => (
                      selectedDocument && selectedDocument.name === doc.name ? (
                        <Container
                          key={doc.name}
                          header={<Header>{selectedDocument.name}</Header>}
                          margin={{ top: 'm' }}
                        >
                          <ColumnLayout columns={2}>
                            <Box>
                              <img src={selectedDocument.front} alt={`${selectedDocument.name} (Front)`} style={{ maxWidth: '100%' }} />
                              <p>{`${selectedDocument.name} (Front)`}</p>
                            </Box>
                            {selectedDocument.back && (
                              <Box>
                                <img src={selectedDocument.back} alt={`${selectedDocument.name} (Back)`} style={{ maxWidth: '100%' }} />
                                <p>{`${selectedDocument.name} (Back)`}</p>
                              </Box>
                            )}
                          </ColumnLayout>
                          <Box float='right'>
                            <div className="button-container">
                              <button className="cancel-btn" onClick={downloadPDF}>Download PDF</button>
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
                      <span className="value">HDFC Bank </span>
                    </div>
                    <div className="info-item">
                      <span className="label" style={{ width: "180px" }}>Account Number:</span>
                      <span className="value">100500459883</span>
                    </div>
                    <div className="info-item">
                      <span className="label" style={{ width: "180px" }}>Re-enter Account Number:</span>
                      <span className="value">100500459883</span>
                    </div>
                    <div className="info-item">
                      <span className="label" style={{ width: "180px" }}>IFC Code:</span>
                      <span className="value">HDFC00003881</span>
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
