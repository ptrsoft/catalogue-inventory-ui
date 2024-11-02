import React from 'react'
import { Container,Box } from '@cloudscape-design/components'

const AddressTab = ({riderDetails}) => {
  return (
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
  )
}

export default AddressTab