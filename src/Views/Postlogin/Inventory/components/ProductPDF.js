import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import promodeicon from "../../../../assets/new Images/image.png";
import { Button } from "@cloudscape-design/components";

const ProductPDF = ({ products }) => {
  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    
    // Function to add watermark
    const addWatermark = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.1 }));
      doc.setFontSize(30);
      doc.setTextColor(0, 95, 65);
      doc.text("PROMODE AGRO FARMS", pageWidth/2, pageHeight/3, { align: "center" });
      doc.restoreGraphicsState();
    };

    // Add logo first
    doc.addImage(promodeicon, "PNG", 57, 5, 10, 10);

    // Add header text after logo
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PROMODE AGRO FARMS", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Deliver Season's Best", 105, 15, { align: "center" });

    // Add horizontal line
    doc.setLineWidth(0.2); // Set line thickness
    doc.setDrawColor(0, 0, 0); // Set line color to black
    doc.line(0, 20, 210, 20); // Draw line from edge to edge

    // Prepare table data
    const tableData = products.map((product, index) => [
      index + 1,
      product.name,
      `${product.totalQuantityInB2c} ${product.totalquantityB2cUnit}`,
      `${product.sellingPrice}`
    ]);

    // Generate table with watermark on each page
    autoTable(doc, {
      head: [["S.No", "Product Name", "Unit", "Price"]],
      body: tableData,
      startY: 25,
      startX: 0,
      margin: { left: 5, right: 5, top: 0, bottom: 0 },
      padding: 0,
      tableWidth: "auto",
      theme: "striped",
      headStyles: {
        fillColor: [255, 255, 255],

        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 12
      },
      styles: {
        fontSize: 12,
        cellPadding: 2,
        textColor: [0, 0, 0]
      },
      columnStyles: {
        0: { cellWidth: 20 }, // S.No
        1: { cellWidth: 100 }, // Product Name
        2: { cellWidth: 40 }, // Unit
        3: { cellWidth: 40 }  // Price
      },
      didDrawPage: function(data) {
        // Add watermark to each page
        addWatermark();
      },
      didDrawCell: function(data) {
        // Ensure watermark stays behind content
        if (data.section === 'head' && data.row.index === 0) {
          addWatermark();
        }
      }
    });

    // Add footer only on the last page
    const pageCount = doc.internal.getNumberOfPages();
    doc.setPage(pageCount);
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("<------------------------------------------------------------ ", doc.internal.pageSize.width / 2 - 15, doc.internal.pageSize.height - 20, { align: "right" });
    doc.setFont(undefined, "bold");
    doc.text("Thank You", doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 20, { align: "center" });
    doc.setFont(undefined, "normal"); 
    doc.text(" ----------------------------------------------------------->", doc.internal.pageSize.width / 2 + 15, doc.internal.pageSize.height - 20, { align: "left" });
    doc.text("www.promodeagro.com", 5, doc.internal.pageSize.height - 10, { align: "left" });
    doc.text("support@promodeagro.com", 205, doc.internal.pageSize.height - 10, { align: "right" });



    doc.save("products.pdf");
  };

  return (
    <Button
      variant="inline-link"
      iconName="download"
      onClick={downloadPDF}
    >
      Download PDF
    </Button>
  );
};

export default ProductPDF;
