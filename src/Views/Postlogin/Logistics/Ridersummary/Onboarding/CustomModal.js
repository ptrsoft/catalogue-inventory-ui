import React from 'react';
import { Box, Button } from '@cloudscape-design/components';
// import './CustomModal.css';
 // Import your custom styles

const CustomModal = ({ isOpen, onDismiss, document, onDownload }) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <header className="custom-modal-header">
          <h2>{`View ${document ? document.name : ''}`}</h2>
          <button className="close-button" onClick={onDismiss}>
            &times;
          </button>
        </header>
        <div className="custom-modal-body">
          {document && (
            <Box className="image-container">
              <img
                src={document.front}
                alt="Document Front"
                className="document-image"
              />
              {document.back && (
                <img
                  src={document.back}
                  alt="Document Back"
                  className="document-image"
                />
              )}
            </Box>
          )}
        </div>
        <Box float='right'>
          <Button onClick={onDownload} variant="primary">Download PDF</Button>
          
        </Box>
      </div>
    </div>
  );
};

export default CustomModal;
