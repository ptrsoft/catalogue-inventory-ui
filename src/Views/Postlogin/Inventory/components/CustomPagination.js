import React from 'react';
import { Button, SpaceBetween } from '@cloudscape-design/components';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages are less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = 4;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('..');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('..');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <SpaceBetween direction="horizontal" size="xs">
      <Button
        iconName="angle-left"
        variant="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      
      {getPageNumbers().map((page, index) => (
        <button
        style={{marginTop:'7px', border:"none",backgroundColor:'white',
          color:page === currentPage ?"blue":"black",
          fontWeight:'bold',
          cursor:'pointer'
        }}
        
          key={index}
          // variant={page === currentPage ? "inline-link" : "inline-link"}
          disabled={page === '...'}
          onClick={() => typeof page === 'number' && onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <Button
        iconName="angle-right"
        variant="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </SpaceBetween>
  );
};

export default CustomPagination; 