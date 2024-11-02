import React from 'react'
import { Container,Grid,Header,Box } from '@cloudscape-design/components'

const PersonalDetails = ({riderDetails}) => {
  return (
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
  )
}

export default PersonalDetails