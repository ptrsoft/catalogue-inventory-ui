import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import promodeicon from "../../../../assets/img/pdflogo.png";
import whatsappIcon from "../../../../assets/img/whatsapp (1).png";
import internetIcon from "../../../../assets/img/world-wide-web.png";
import gmailIcon from "../../../../assets/img/gmail.png";
import { Button, Spinner } from "@cloudscape-design/components";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInventory } from "Redux-Store/Products/ProductThunk";

const ProductPDF = () => {
  const dispatch = useDispatch();
  const { data: products, status } = useSelector((state) => state.products.allInventory);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldDownload, setShouldDownload] = useState(false);

  // Effect to handle PDF generation when data is ready
  useEffect(() => {
    if (shouldDownload && products && (products.length > 0 || (products.categories && products.categories.length > 0))) {
      downloadPDF();
      setShouldDownload(false);
    }
  }, [products, shouldDownload]);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      // Only fetch data if we don't already have it
      if (status !== 'SUCCESS' || !products || products.length === 0) {
        await dispatch(fetchAllInventory()).unwrap();
      }
      // Set flag to trigger PDF generation when data is ready
      setShouldDownload(true);
    } catch (error) {
      console.error("Failed to fetch inventory data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    
    // Function to add watermark
    const addWatermark = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.08 }));
      doc.setFontSize(30);
      doc.setTextColor(0, 95, 65,);
      doc.setFont("helvetica", "bold");
      doc.text("PROMODE AGRO FARMS", pageWidth/2, pageHeight/2, { align: "center" });
      doc.restoreGraphicsState();
    };

    // Function to add header
    const addHeader = () => {
      // Add logo
      doc.addImage(promodeicon, "PNG", 57, 5, 10, 10);

      // Add header text
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("PROMODE AGRO FARMS", 105, 10, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Deliver Season's Best", 105, 15, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("+918897399587", 105, 22, { align: "center" });
      // Add WhatsApp icon
      doc.addImage(whatsappIcon, "PNG", 83, 18, 5, 5);
      // Add horizontal line
      doc.setLineWidth(0.2);
      doc.setDrawColor(0, 0, 0);
      doc.line(0, 25, 210, 25);
    };

    // Function to add footer
    const addFooter = () => {
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text("<------------------------------------------------------------ ", doc.internal.pageSize.width / 2 - 15, pageHeight - 20, { align: "right" });
      doc.setFont(undefined, "bold");
      doc.text("Thank You", doc.internal.pageSize.width / 2, pageHeight - 20, { align: "center" });
      doc.setFont(undefined, "normal"); 
      doc.text(" ----------------------------------------------------------->", doc.internal.pageSize.width / 2 + 15, pageHeight - 20, { align: "left" });
      
      // Add internet icon and website link
      doc.addImage(internetIcon, "PNG", 6, pageHeight - 13.5, 5, 5);
      doc.text("www.promodeagro.com", 12, pageHeight - 10, { align: "left" });
      
      // Add gmail icon and email
      doc.addImage(gmailIcon, "PNG", 147, pageHeight - 14.5, 5, 5);
      doc.text("support@promodeagro.com", 205, pageHeight - 10, { align: "right" });
    };

    // Add header and watermark to the first page
    addHeader();
    addWatermark();

    // Process the nested category structure
    let currentY = 35; // Starting Y position after header
    let pageCount = 1;
    let productCount = 0;

    // Check if products have the category structure
    if (products && products.categories && Array.isArray(products.categories)) {
      // Iterate through each category
      products.categories.forEach((category, categoryIndex) => {
      
        
       

        // Check if category has subCategories
        if (category.subCategories && Array.isArray(category.subCategories)) {
          // Iterate through each subcategory
          category.subCategories.forEach((subcategory, subcategoryIndex) => {
            // For each subcategory, add a new page
            if (subcategoryIndex > 0) {
              doc.addPage();
              pageCount++;
              // Add header, watermark and footer to the new page
              addHeader();
              addWatermark();
              addFooter();
              // Reset Y position for the new page
              currentY = 35;
            }
            
            // Add subcategory header with category name
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);
            const subcategoryText = `Category: ${category.name} (${subcategory.name})`;
            doc.text(subcategoryText, doc.internal.pageSize.getWidth() / 2, currentY, { align: "center" });
            currentY += 8;

            // Check if subcategory has products
            if (subcategory.products && Array.isArray(subcategory.products)) {
              // Prepare table data for products in this subcategory
              const tableData = subcategory.products.map((productItem, index) => {
                productCount++;
                // Extract the actual product object from the nested structure
                const product = productItem.product || {};
                return [
                  productCount,
                  product.name || '',
                  `${product.totalQuantityInB2c || 0} ${product.totalquantityB2cUnit || ''}`,
                  `${product.availability === true ? "In Stock" : product.availability === false ? "Out Of Stock" : ""}`,
                  `${product.sellingPrice || ''}`
                ];
              });

              // Generate table for products in this subcategory
              autoTable(doc, {
                head: [["S.No", "Product Name", "Unit", "Availability", "Price"]],
                body: tableData,
                startY: currentY,
                startX: 0,
                margin: { left: 5, right: 5, top: 30, bottom: 30 },
                padding: 0,
                tableWidth: "auto",
                theme: "striped",
                headStyles: {
                  fillColor: [255, 255, 255],
                  textColor: [0, 0, 0],
                  fontStyle: "bold",
                  fontSize: 14
                },
                styles: {
                  fontSize: 12,
                  cellPadding: 2,
                  textColor: [0, 0, 0]
                },
                columnStyles: {
                  0: { cellWidth: 15 }, // S.No
                  1: { cellWidth: 90 }, // Product Name
                  2: { cellWidth: 30 }, // Unit
                  3: { cellWidth: 35 }, // Availability
                  4: { cellWidth: 30 }  // Price
                },
                didDrawPage: function(data) {
                  // Add header, watermark and footer to each page
                  addHeader();
                  addWatermark();
                  addFooter();
                  
                  // Reset the Y position for the next page to avoid overlapping with header
                  if (data.pageCount > 1) {
                    data.cursor.y = 35; // Set a fixed starting position after header for subsequent pages
                  }
                }
              });

              // Update currentY for the next subcategory
              currentY = doc.lastAutoTable.finalY + 10;
            }
          });
        }
      });
    } else {
      // Fallback to the original flat product list if the category structure is not available
      const tableData = products.map((product, index) => [
        index + 1,
        product.name,
        `${product.totalQuantityInB2c} ${product.totalquantityB2cUnit}`,
        `${product.availability=== true ? "In Stock" : product.availability === false ? "Out Of Stock" : ""}`,
        `${product.sellingPrice}`
      ]);

      // Generate table with header and watermark on each page
      autoTable(doc, {
        head: [["S.No", "Product Name", "Unit", "Availability", "Price"]],
        body: tableData,
        startY: currentY,
        startX: 0,
        margin: { left: 5, right: 5, top: 30, bottom: 30 },
        padding: 0,
        tableWidth: "auto",
        theme: "striped",
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          fontSize: 14
        },
        styles: {
          fontSize: 12,
          cellPadding: 2,
          textColor: [0, 0, 0]
        },
        columnStyles: {
          0: { cellWidth: 15 }, // S.No
          1: { cellWidth: 90 }, // Product Name
          2: { cellWidth: 30 }, // Unit
          3: { cellWidth: 35 }, // Availability
          4: { cellWidth: 30 }  // Price
        },
        didDrawPage: function(data) {
          // Add header, watermark and footer to each page
          addHeader();
          addWatermark();
          addFooter();
          
          // Reset the Y position for the next page to avoid overlapping with header
          if (data.pageCount > 1) {
            data.cursor.y = 35; // Set a fixed starting position after header for subsequent pages
          }
        }
      });
    }

    // Add footer to the last page
    addFooter();

    doc.save("products.pdf");
  };

  return (
    <Button
      variant="inline-link"
      iconName={isLoading ? "status-pending" : "download"}
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? "Downloading" : "Download PDF"}
    </Button>
  );
};

export default ProductPDF;