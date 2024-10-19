import React, { useState } from 'react';
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
  TextContent,
  StatusIndicator,
  Icon,
  
} from '@cloudscape-design/components';
import riderimg from "../../../../../assets/images/riderimage.jpeg"
const documents = [
  { id: 1, name: 'Aadhar Card', front: '/path/to/front-image.png', back: '/path/to/back-image.png', status: 'Pending' },
  { id: 2, name: 'Pan Card', front: '/path/to/pan-front.png', back: '/path/to/pan-back.png', status: 'Pending' },
  { id: 3, name: 'Driving License', front: '/path/to/dl-front.png', back: '/path/to/dl-back.png', status: 'Pending' },
  { id: 4, name: 'Vehicle Image', front: '/path/to/vehicle.png', back: '', status: 'Pending' },
  { id: 5, name: 'RC Book', front: '/path/to/rc-front.png', back: '/path/to/rc-back.png', status: 'Pending' },
];
const RiderDetails = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docStatus, setDocStatus] = useState(documents);

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
  };

  const handleVerify = () => {
    setDocStatus((prevStatus) =>
      prevStatus.map((doc) =>
        doc.id === selectedDoc.id ? { ...doc, status: 'Success' } : doc
      )
    );
    setSelectedDoc(null); // Close details after verification
  };
  const [selectedTab, setSelectedTab] = useState('Address');

  const breadcrumbItems = [
    { text: 'Dashboard', href: '#' },
    { text: 'Logistics', href: '#' },
    { text: 'Rider Summary', href: '#' },
    { text: 'Rider Details', href: '#' }
  ];

  return (
    <Box>
           <SpaceBetween direction="vertical" size="s">
      <BreadcrumbGroup items={breadcrumbItems} />
      <Header variant="h1" actions={
        <SpaceBetween direction="horizontal" size="s">
          <Button variant="normal" disabled>Approve</Button>
          <Button variant="primary" className="decline-button">Decline</Button>
        </SpaceBetween>
      }>
        Rider Details
      </Header>
      <Container header={<Header variant="h2">View Details</Header>}>
      <SpaceBetween direction="vertical" size="s">
      <hr></hr>
      <Container>
        <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
          <Box>
            <img
              src={riderimg} // Replace with your image path or use dynamic image data
              alt="Rider"
              style={{ width: '180px',height:"140px" }}
            />
          </Box>
          <Box>
          <Header variant="h3">Personal Details</Header>
          <hr></hr>
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
        
          </Box>
        </Grid>
      
      </Container>

      <Tabs
        activeTabId={selectedTab}
        onChange={({ detail }) => setSelectedTab(detail.activeTabId)}
        tabs={[
          {
            label: 'Address',
            id: 'Address',
            content: (
              <Container>
               <Box>
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
          <hr/>

          <div className="info-item">
            <span className="label">Father Name :</span>
            <span className="value">Alfredo Aminoff</span>
          </div>
          <div className="info-item">
            <span className="label">Contact No :</span>
            <span className="value">9966996516</span>
          </div>
        </div>
      </Box>

              </Container>
            )
          },
          {
            label: 'Rider Document',
            id: 'RiderDocument',
            content: (
              <SpaceBetween direction='vertical' size="s">
              {docStatus.map((doc) => (
                selectedDoc && selectedDoc.name === doc.name ? (
                  // Show images container for the selected document
                  <Container
                    key={doc.name}
                    header={<Header>{selectedDoc.name}</Header>}
                    margin={{ top: 'm' }}
                  >
                    <ColumnLayout columns={2}>
                      <Box>
                        <img src={selectedDoc.front} alt={`${selectedDoc.name} (Front)`} style={{ maxWidth: '100%' }} />
                        <p>{`${selectedDoc.name} (Front)`}</p>
                      </Box>
                      {selectedDoc.back && (
                        <Box>
                          <img src={selectedDoc.back} alt={`${selectedDoc.name} (Back)`} style={{ maxWidth: '100%' }} />
                          <p>{`${selectedDoc.name} (Back)`}</p>
                        </Box>
                      )}
                    </ColumnLayout>
                    <Box float='right'>
                    <div class="button-container">
                  <button class="cancel-btn" onClick={() =>setSelectedDoc(null)}>Cancel</button>
                  <button class="print-btn"  style={{backgroundColor:"green"}} onClick={handleVerify}>verify Document</button>
                </div>
                  
                 
                    </Box>
                  </Container>
                ) : (
                  // Show FormField for documents not selected
                  // <FormField key={doc.name}>
                    <div onClick={() => handleDocClick(doc)} style={{ position: "relative", width: "72vw", cursor: "pointer" }}>
                      <Input
                        readOnly
                        value={doc.name}
                        ariaLabel={doc.name}
                        placeholder=""
                        className="document-input"
                      />
                      {/* <Container> {doc.name}</Container> */}
                      <div
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          // cursor: "pointer",
                          color: "#8B8D97", // Adjust color as needed
                        }}
                      >
                        <StatusIndicator type={doc.status === 'Success' ? 'success' : 'pending'}>
                          {/* {doc.status} */}
                        </StatusIndicator>
                      </div>
                    </div>
                  // </FormField>
                )
              ))}
            </SpaceBetween>
     
            )
          },
          {
            label: 'Rider Bank Details',
            id: 'RiderBankDetails',
            content: (
              <Container>
                  <div className="address-info">
                 <div className="info-item">
            <span className="label" style={{width:"180px"}}>Bank Name: </span>
            <span className="value">HDFC Bank </span>
          </div>
          <div className="info-item">
            <span className="label" style={{width:"180px"}}>Account Number:</span>
            <span className="value">100500459883</span>
          </div>
          <div className="info-item">
            <span className="label" style={{width:"180px"}}>Re-enter Account Number:</span>
            <span className="value">100500459883</span>
          </div>
          <div className="info-item">
            <span className="label" style={{width:"180px"}}>IFC Code:</span>
            <span className="value">HDFC00003881</span>
          </div>
          </div>
          <Box float='right'><button class="print-btn"  style={{backgroundColor:"green",display:"flex",gap:"5px", justifyContent:"center",alignItems:"center",fontSize:"11px"}} ><p>Verify Details</p>
             <Icon name='status-positive' size='small'></Icon></button></Box>
              </Container>
            )
          }
        ]}
      />
        </SpaceBetween>
      </Container>
      </SpaceBetween>
    </Box>
  );
};

export default RiderDetails;
