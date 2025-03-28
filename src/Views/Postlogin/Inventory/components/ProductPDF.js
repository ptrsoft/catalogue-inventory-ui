import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import promodeicon from "../../../../assets/img/pdflogo.png";
import whatsappIcon from "../../../../assets/img/whatsapp (1).png";
import internetIcon from "../../../../assets/img/internet.png";
import gmailIcon from "../../../../assets/img/gmail.png";
import { Button } from "@cloudscape-design/components";

const ProductPDF = ({ products }) => {
  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    
       // Function to add watermark
       const addWatermark = () => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.08 }));
        doc.setFontSize(35);
        doc.setTextColor(0, 95, 65,);
        doc.setFont("helvetica", "bold");
        doc.text("PROMODE AGRO FARMS", pageWidth/2, pageHeight/2, { align: "center" });
        doc.restoreGraphicsState();
      };
      // Set opacity to 0.15 (15%) for better visibility


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
      //    doc.setFontSize(12);
      // doc.setFont("helvetica", "normal");
      // doc.text("Menu", 110, 25, { align: "center" });

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

    // Prepare table data
    const tableData = products.map((product, index) => [
      index + 1,
      product.name,
      `${product.totalQuantityInB2c} ${product.totalquantityB2cUnit}`,
      `${product.active === true ? "In Stock" : product.active === false ? "Out Of Stock" : ""}`,
      `${product.sellingPrice}`
    ]);

    // Generate table with header and watermark on each page
    autoTable(doc, {
      head: [["S.No", "Product Name", "Unit","Availablity", "Price"]],
      body: tableData,
      startY: 25,
      startX: 0,
      margin: { left: 5, right: 5, top: 25, bottom: 30 }, // Added bottom margin for footer
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
        0: { cellWidth: 15 }, // S.No
        1: { cellWidth: 90 }, // Product Name
        2: { cellWidth: 30 }, // Unit
        3: { cellWidth: 35 }, // Unit

        4: { cellWidth: 30 }  // Price
      },
      didDrawPage: function(data) {
        // Add header, watermark and footer to each page
        addHeader();
        addWatermark();
        addFooter();
      }
    });

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