import React from 'react'
import { Container,Grid,Header,Box } from '@cloudscape-design/components'
import { useMediaQuery } from "react-responsive";
const PersonalDetails = ({riderDetails}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <Container>
    <Grid gridDefinition={isMobile ? [{ colspan: 12 }] : [{ colspan: 2 }, { colspan: isMobile ? 12 : 10 }]}>
      <Box >
        <img
          src={riderDetails?.documents[0].image}
          alt="Rider"
          style={{ width: "180px", height: "140px", marginLeft: isMobile ? "30px" : "" }}
        />
      </Box>
      <Box>
        <Header variant="h3">Personal Details</Header>
        {/* <hr /> */}
        <Box>
          {riderDetails ? (
            <div className="rider-info">
              <div className="info-item">
                <span className="label">Rider Name :</span>
                <span className="value" style={{ marginLeft: isMobile ? "-30px" : "" }}>
                  {riderDetails.personalDetails.fullName}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Date of Birth :</span>
                <span className="value" style={{ marginLeft: isMobile ? "-30px" : "" }}>
                  {new Date(
                    riderDetails.personalDetails.dob
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Contact No :</span>
                <span className="value" style={{ marginLeft: isMobile ? "-30px" : "" }}>{riderDetails.number}</span>
              </div>
              <div className="info-item">
                <span className="label">Email :</span>
                <span className="value" style={{ marginLeft: isMobile ? "-30px" : "", width: isMobile ? "160px" : "" }}>
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
  )
}

export default PersonalDetails