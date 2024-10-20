import React, { useState } from 'react'; 
import {
  Box,  
  Button,
  BreadcrumbGroup,
  Container,
  Header,
  SpaceBetween,
  Grid
} from '@cloudscape-design/components';
import jsPDF from 'jspdf';
import riderimg from "../../../../../assets/images/riderimage.jpeg";
import CustomModal from './CustomModal'; // Import the custom modal

const documents = [
    { id: 1, name: 'Aadhar Card', front: riderimg, back: riderimg, status: 'Pending' },
    { id: 2, name: 'Pan Card', front: riderimg, back: riderimg, status: 'Pending' },
    { id: 3, name: 'Driving License', front: riderimg, back: riderimg, status: 'Pending' },
    { id: 4, name: 'Vehicle Image', front: riderimg, back: riderimg, status: 'Pending' },
    { id: 5, name: 'RC Book', front: riderimg, back: riderimg, status: 'Pending' },
];

const ApproveRider = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const breadcrumbItems = [
    { text: 'Dashboard', href: '#' },
    { text: 'Logistics', href: '#' },
    { text: 'Rider Summary', href: '#' },
    { text: 'Rider Details', href: '#' },
  ];

  const openModal = (document) => {
    setSelectedDocument(document);  
    setIsModalOpen(true);           
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null); 
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
      <CustomModal 
        isOpen={isModalOpen} 
        onDismiss={closeModal} 
        document={selectedDocument} 
        onDownload={downloadPDF} 
      />

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
                  {documents.map((doc) => (
                    <div  style={{paddingBottom:"5px"}}>
                    <div key={doc.id} className="info-item">
                         <span className="label">Document Name :</span>
                      <span className="value">{doc.name}</span>
                   
                      </div>
                         <span>
                         <Button variant='inline-link' onClick={() => openModal(doc)}>Download Or View</Button>
                      </span>
                    </div>
                  ))}
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
