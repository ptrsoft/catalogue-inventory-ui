import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import promodeicon from "assets/img/pdflogo.png";
import whatsappIcon from "assets/img/whatsapp (1).png";
import internetIcon from "assets/img/globe.png";
import gmailIcon from "assets/img/gmail.png";
import { Button, Spinner } from "@cloudscape-design/components";

const Invoice = ({ orderData, flag }) => {
  const [isLoading, setIsLoading] = useState(false);



  const downloadPDF = () => {
    setIsLoading(true);
    const doc = new jsPDF("p", "mm", "a4");

    const addWatermark = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.saveGraphicsState();
      doc.setGState(new doc.GState({ opacity: 0.08 }));
      doc.setFontSize(36);
      doc.setTextColor(0, 95, 65);
      doc.setFont("helvetica", "bold");
      doc.text("PROMODE AGRO FARMS", pageWidth / 2, pageHeight / 2, {
        align: "center",
      });
      doc.restoreGraphicsState();
    };

    const addHeader = () => {
      doc.addImage(promodeicon, "PNG", 57, 5, 10, 10);

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("PROMODE AGRO FARMS", 105, 10, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Deliver Season's Best", 105, 15, { align: "center" });
      doc.text("+918897399587", 107, 21, { align: "center" });
      doc.addImage(whatsappIcon, "PNG", 86, 17, 5, 5,{align:'center'});
      
      // Draw dashed horizontal line
      doc.setLineWidth(0.1);
      doc.setDrawColor(100, 100, 100); // Darker gray color
      const dashLength = 2;
      const gapLength = 2;
      let x = 0;
      while (x < 210) {
        doc.line(x, 25, x + dashLength, 25);
        x += dashLength + gapLength;
      }
    };

    const addFooter = () => {
      const pageHeight = doc.internal.pageSize.height;
      const width = doc.internal.pageSize.width;

   

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("<------------------------------------------------------------ ", width / 2 - 15, pageHeight - 12, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text("Thank You", width / 2, pageHeight - 12, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text(" ----------------------------------------------------------->", width / 2 + 15, pageHeight - 12, { align: "left" });

      // Add GSTIN and FSSAI numbers
      // doc.setFontSize(10);
      // doc.text("GSTIN NO: 36ABCFP1254A1ZS", width - 10, pageHeight - 20, { align: "right" });
      // doc.text("FSSAI NO: 13624010000109", width - 10, pageHeight - 25, { align: "right" });

      doc.addImage(internetIcon, "PNG", 6, pageHeight -8.3 , 5, 5);
      doc.text("www.promodeagro.com", 12, pageHeight - 5);

      doc.addImage(gmailIcon, "PNG", 147, pageHeight - 8.5, 5, 5);
      doc.text("support@promodeagro.com", 205, pageHeight - 5, { align: "right" });
    };

    const addBody = () => {
      let y = 32;

      doc.setDrawColor(200, 200, 200); // Light gray color
      doc.line(105, 30, 105, 85); 

      doc.setFontSize(14);
      doc.text("Invoice", 5, y+3);

      doc.setFontSize(11);
      y += 12;

      const textPair = (label, value) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 5, y);
        if(label==="Order ID"){
          doc.setFont("helvetica", "bold");
          doc.text(value || "N/A", 40, y);
          y += 6;
        }
        else{
          doc.setFont("helvetica", "normal");
          doc.text(value || "N/A", 40, y);
          y += 6;

        }
     
      };

      textPair("Order ID", orderData?.orderId);
      textPair("Customer", orderData?.userInfo?.name);
      textPair("Phone", orderData?.userInfo?.number);

      const address = `${orderData?.address?.house_number || ""}, ${orderData?.address?.address || ""}, ${orderData?.address?.landmark_area || ""}, ${orderData?.address?.zipCode || ""}`;
      const addressLines = doc.splitTextToSize(address, 60);
      doc.setFont("helvetica", "bold");
      doc.text("Address:", 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(addressLines, 40, y);
      y += addressLines.length * 6;

      const dateTime = orderData?.createdAt
        ? new Date(orderData.createdAt).toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "UTC",
          })
        : "N/A";
      textPair("Date & Time", dateTime);

      // Store the final y position for table start
      const tableStartY = y + 7;

      // Right section with payment method in a box
      doc.setFontSize(14);
      // Draw payment method box
      const paymentMethod = orderData?.paymentDetails?.method || "N/A";
      const paymentBoxWidth = 20;
      const paymentBoxHeight = 8;
      const paymentBoxX = 205 - paymentBoxWidth;
      const paymentBoxY = 28;
      
      // Draw box
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(249, 249, 249);
      doc.roundedRect(paymentBoxX, paymentBoxY, paymentBoxWidth, paymentBoxHeight, 2, 2, 'FD');
      
      // Add payment method text
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const xPosition = paymentMethod?.includes("COD")
  ? 200
  : paymentMethod?.includes("Prepaid")
  ? 203
  : 200; // fallback position


      doc.text(paymentMethod, xPosition, paymentBoxY + 5, { align: "right" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Biller Name: ", 108, 42);
      doc.setFont("helvetica", "normal");
      doc.text("Promode Agro Farm", 144, 42);

      doc.setFont("helvetica", "bold");
      doc.text("Billing Address:", 108, 48);
      doc.setFont("helvetica", "normal");
      const address_shop="Dargah khaleej khan, Kismatpur, Hyderabad, Telangana 500028"
      const AddressLines_Shop=doc.splitTextToSize(address_shop,75)
      doc.text(AddressLines_Shop, 144, 48);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Contact No: ", 108, 60);
      doc.setFont("helvetica", "normal");
      doc.text("9701610033", 144, 60);
      doc.text("Items:", 200, tableStartY-3, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.text(`${orderData?.items?.length != null ? orderData.items.length < 10 ? '0' + orderData.items.length : orderData.items.length : 'N/A'}`, 205, tableStartY - 3, { align: "right" });

      return tableStartY;
    };

    const addPaymentDetails = () => {
      // const summaryY = doc.lastAutoTable.finalY + 10;
      const summaryY = doc.internal.pageSize.height-50;

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 5;
      const valueX = pageWidth - margin;
    
      doc.setFontSize(11);
    
      doc.setFont("helvetica", "bold");
      doc.text('Sub Total:', margin, summaryY);
      doc.setFont("helvetica", "normal");
      doc.text(`${orderData?.subTotal || "0.00"}`, valueX, summaryY, { align: 'right' });
    
      doc.setFont("helvetica", "bold");
      doc.text('Shipping Charges:', margin, summaryY + 6);
      doc.setFont("helvetica", "normal");
      doc.text(`${orderData?.deliveryCharges || "0.00"}`, valueX, summaryY + 6, { align: 'right' });
    
      doc.setLineWidth(0.1);
      doc.setDrawColor(100, 100, 100);
      const dashLength = 2;
      const gapLength = 2;
      let x = margin;
      while (x < pageWidth - margin) {
        doc.line(x, summaryY + 10, x + dashLength, summaryY + 10);
        x += dashLength + gapLength;
      }
    
      doc.setFont("helvetica", "bold");
      doc.text('Grand Total:', margin, summaryY + 16);
      doc.text(`${orderData?.finalTotal || "0.00"}`, valueX, summaryY + 16, { align: 'right' });

      x = margin;
      while (x < pageWidth - margin) {
        doc.line(x, summaryY + 20, x + dashLength, summaryY + 20);
        x += dashLength + gapLength;
      }
    
      doc.setFont("helvetica", "bold");
      doc.text('Received:', margin, summaryY + 26);
      doc.setFont("helvetica", "normal");
      doc.text(`${orderData?.paymentDetails?.method === "Prepaid" ? orderData?.finalTotal : "0.00"}`, valueX, summaryY + 26, { align: 'right' });

      doc.setFont("helvetica", "bold");
      doc.text('Balance:', margin, summaryY + 32);
      doc.setFont("helvetica", "normal");
      doc.text(`${orderData?.paymentDetails?.method === "COD" ? orderData?.finalTotal : "0.00"}`, valueX, summaryY + 32, { align: 'right' });
    };

    const tableData = orderData?.items?.map((product, index) => [
      index + 1,
      product.productName || "N/A",
      `${product.quantityUnits || 0}${product.unit || ""}`,
      `${product.quantity || 0}`,
      `${product.price || "0.00"}`,
      `${product.subtotal || "0.00"}`
    ]);
  
    // Custom pagination logic
    const chunks = [];
    if (tableData && tableData.length > 0) {
      // First page: 13 items
      chunks.push(tableData.slice(0, 14));
      
      // Remaining items
      const remaining = tableData.slice(14);
      
      // Middle pages: 18 items per page
      for (let i = 0; i < remaining.length; i += 19) {
        chunks.push(remaining.slice(i, i + 19));
      }
    }
  
    // Add first page content
    const tableStartY = addBody();
    addWatermark();
    addHeader();
  
    chunks.forEach((chunk, index) => {
      if (index > 0) {
        doc.addPage();
      }
  
      autoTable(doc, {
        head: [["S.No", "Product Name", "Unit", "Quantity", "Rate", "Total Amount"]],
        body: chunk,
        startY: index === 0 ? tableStartY : 30, // Different start position for first page
        margin: { left: 5, right: 5, top: index === 0 ? tableStartY : 30 },
        theme: "striped",
        headStyles: {
          fillColor: [0, 95, 65],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 11,
          cellPadding: 3,
          halign: 'left',
          lineWidth: 0.1,
          lineColor: [0, 95, 65],
          cellWidth: 'auto',
          cellHeight: 8,
        },
        styles: {
          fontSize: 10,
          textColor: [0, 0, 0],
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 85, halign: 'left' },
          2: { cellWidth: 22, halign: 'left' },
          3: { cellWidth: 25, halign: 'center' },
          4: { cellWidth: 18, halign: 'left' },
          5: { cellWidth: 35, halign: 'center' },
        },
        // Keep all table styles unchanged
        didDrawPage: () => {
          addHeader();
          addWatermark();
          addFooter();
        },
      });
    });
  
    // Add payment details only once after last table
    addPaymentDetails();
  
    doc.save(`Invoice_${orderData?.orderId || "N/A"}.pdf`);
    setIsLoading(false);
  };
  return (
    <>
   
        <Button iconName="download" onClick={downloadPDF} loading={isLoading}>
          {isLoading ? <Spinner size="small" /> : "Invoice"}
        </Button>
    
    </>
  );
};

export default Invoice;
