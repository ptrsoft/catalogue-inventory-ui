import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import promodeicon from "assets/img/Favicon Icon Promode (1).svg";
import { useMediaQuery } from 'react-responsive';
import { Button } from "@cloudscape-design/components";


const Invoice2 = ({ orderData, flag }) => {
  console.log(orderData, "order from invoice");
  const items = orderData?.items || [];
  const [showInvoice, setShowInvoice] = useState(false);

  console.log(orderData, "invoice");
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const downloadPDF = () => {
    const invoiceElement = document.getElementById("invoice-content");
  
    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
  
      const ratio = imgWidth / pdfWidth;
      const scaledHeight = imgHeight / ratio; // Scale the height to fit the width
      let yPosition = 0;
  
      // Add pages dynamically if content exceeds one page
      while (yPosition < scaledHeight) {
        pdf.addImage(
          imgData,
          "PNG",
          0,
          -yPosition,
          pdfWidth,
          scaledHeight
        );
        
        yPosition += pdfHeight; // Move to the next page height
        if (yPosition < scaledHeight) {
          pdf.addPage(); // Add new page if content still exists
        }
      }
  
      pdf.save("invoice.pdf");
    });
  };
  
  return (
    <>
   
        <Button
          variant="normal"
          iconName="download"
        
          onClick={downloadPDF}
        //   sx={{ textTransform: "none", marginTop: "8px" }}
        >
          Invoice
        </Button>
    

      <style>
        {`
.payment-details-box {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  display: inline-block;
  margin-bottom: 8px;
}
.payment-method {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 0;
}


.grid-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.invoice-title {
  font-size: 16px;
  margin-bottom: 0;
}

.payment-details-box {
  padding: 8px 16px; /* Padding inside the box */
  border: 1px solid #ccc; /* Border around the box */
  border-radius: 4px; /* Rounded corners */
  background-color: #f9f9f9; /* Light background color */
  display: inline-block; /* Adjust box width */
  margin-bottom: 8px; /* Spacing below the box */
}

.payment-method {
  font-size: 16px;
  font-weight: 500; /* Semi-bold text */
  margin-bottom: 0;
}
.invoice-content {
  position: absolute;
  top: -9999px; 
  left: -9999px; 
  width: 960px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
}


.watermark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.1;
  font-size: 54px;
  font-style: italic;
  font-weight: 700;
  color: rgba(0, 95, 65, 0.6);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
}

.header1 {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.header1 img {
  width: 40px;
  height: 40px;
}

.header1 h1 {
  margin: 0;
  font-weight: bold;
}

.header1 p {
  margin: 0;
  font-size: 14px;
}

.divider {
  border-bottom: 1.5px dashed black;
  margin: 8px 0;
}

.details-invoice {
  display: flex;
  justify-content: space-between;
}

.details-invoice .left,
.details-invoice .right {
  width: 47%;
}


.details-invoice .left strong,
.details-invoice .right strong {
  display: inline-block;
  width: 40%;
}

.details-invoice p {
  margin: 5px 0;
}

.items {
  margin-top: 20px;
  width:100%
}

.items table {
  width: 100%;
  border-collapse: collapse;
  
}
/* styles.css */

.logo-container {
  position: relative;
  z-index: 1;
}

.logo-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px; /* Space between the logo and the text */
}

.logo-img {
  width: 40px; /* Adjust size as needed */
  height: 40px; /* Keep aspect ratio */
}

.text-box {
  text-align: center; /* Centers the text within its own box */
}

.main-title {
  font-weight: bold;
  margin: 0; /* Remove margin to help with alignment */
  line-height: 1.5; /* Adjust line height for tighter spacing */
}

.subtitle {
  margin: 0; /* Remove margin for subtitle */
  line-height: 1; /* Adjust line height for tighter spacing */
}
.items td {
  padding: 10px;

}


.items tr {
  padding: 40px;
  text-align: center;
}
/* Apply gray background to even rows */
.items tr:nth-child(even) {
background-color: #f3f3f3; /* Light gray */
}

/* Optional: Reset the background for odd rows */
.items tr:nth-child(odd) {
background-color: #ffffff; /* White */
}

.items th {
  padding: 10px;
  text-align: center;
  background-color: #f5f5f5;
}

.summary {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.summary p {
  margin: 5px 0;
}


.footer-container {
    display: flex;
    justify-content: center;
    align-items: center;
   
}

.footer-left,
.footer-right {
    display: inline-block;
}

.footer-content {
    display: inline-flex;
    align-items: center;
    width: 100%;
    justify-content: center;
}

.dashed-line {
    flex: 1;
    border-bottom: 1.5px dashed black;
}

.text-spacing {
    margin: 0 8px;
}

.footer-links {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}

footer p {
    text-align: center;
    margin: 10px 0;
}`}
      </style>

      <div
        id="invoice-content"
        style={{
          position: showInvoice ? "relative" : "absolute",
          top: showInvoice ? "20px" : "-9999px",
          left: showInvoice ? "20px" : "-9999px",
          backgroundColor: "#fff",
          padding: "20px",
          width: "950px",
        }}
      >
        <div class="logo-container">
          <div class="logo-box">
            <img src={promodeicon} alt="Logo" class="logo-img"></img>
            <div class="text-box">
              <h2 class="main-title">PROMODE AGRO FARMS</h2>
              <p class="subtitle">Deliver Season's Best</p>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="divider"></div>
          <div class="grid-container">
            <div class="invoice-title">Invoice</div>
            <div class="payment-details-box">
              <div class="payment-method">
                {orderData?.paymentDetails?.method || "N/A"}
              </div>
            </div>
          </div>
          <div class="details-invoice">
            <div class="left">
              <div style={{ display: "flex" }}>
                <strong>Order ID:</strong>
                <strong style={{ width: "200px" }}>
                  {orderData?.orderId || "N/A"}
                </strong>
              </div>

              <p>
                <strong>Customer Name:</strong>
                {orderData?.userInfo.name || "N/A"}
              </p>
              <p>
                <strong>Phone Number:</strong>
                {orderData?.userInfo?.number || "N/A"}
              </p>
              <div style={{ display: "flex" }}>
                <strong>
                
                  Address:
                </strong>
                <span
                  className="value-address"
                  style={{ width: "200px", wordBreak: "break-word" }}
                >
                  {orderData?.address?.house_number},{" "}
                  {orderData?.address?.address},{" "}
                  {orderData?.address?.landmark_area},{" "}
                  {orderData?.address?.zipCode}
                </span>
              </div>
              <p>
                <strong>Date & Time:</strong>
                {orderData?.createdAt
                  ? new Date(orderData.createdAt).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                      timeZone: "UTC", // Ensures UTC time is used
                    })
                  : "N/A"}
              </p>
            </div>
            {/* <Divider
              orientation="vertical"
              variant="middle"
              flexItem
              sx={{ marginTop: "15px" }}
            /> */}
            <hr></hr>

            <div class="right">
              <div style={{ display: "flex" }}>
                <strong style={{ width: "165px" }}>Biller Name:</strong>
                <div>Promode Agro Farm</div>
              </div>
              <div style={{ display: "flex" }}>
                <strong style={{ width: "315px" }}>Billing Address:</strong>
                <div>
                  Dargah khaleej khan, Kismatpur, Hyderabad, Telangana 500028,
                  9701610033
                </div>
              </div>
            </div>
          </div>
          <div class="items">
            <div class="watermark">PROMODE AGRO FARMS</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span>
                Items: {items.length || 0}
              </span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th style={{ textAlign: "left" }}>Product Name</th>
                  <th style={{ textAlign: "left" }}>Unit</th>

                  <th style={{ textAlign: "center" }}>Quantity</th>
                  <th>Rate</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td > {index + 1}</td>
                    <td style={{ textAlign: "left" }}>
                      {" "}
                      {item.productName}

                    </td>
                    <td style={{ textAlign: "left" }}>
                      {item.quantityUnits}{item.unit}
                    </td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td> ₹{item.price}</td>
                    <td> ₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="summary"></div>{" "}
          <div class="footer-links">
            <span>Sub Total</span>
            <span> ₹{orderData?.subTotal || "0.00"}</span>
          </div>
          <div class="footer-links">
            <span>Shipping Charges</span>
            <span> ₹{orderData?.deliveryCharges || "0.00"}</span>
          </div>
          <div class="divider"></div>
          <div class="footer-links">
            <span>Grand Total</span>
            <span> ₹{orderData?.finalTotal || "0.00"}</span>
          </div>
          <div class="divider"></div>
          <div className="footer-links">
            <span>Received</span>
            <span>
              ₹
              {orderData?.paymentDetails?.method === "Prepaid"
                ? orderData?.finalTotal // Display total price if online
                : "0.00"}
            </span>
          </div>
          <div className="footer-links">
            <span>Balanced</span>
            <span>
              ₹
              {orderData?.paymentDetails?.method === "COD"
                ? orderData?.finalTotal // Display total price if cash
                : "0.00"}
            </span>
          </div>
          {/* <div style={{ textAlign: "center", marginBottom: "5px" }}>
            <span>** You Saved ₹{orderData?.totalSavings || "0.00"} **</span>
          </div> */}
          <footer>
            <div class="footer-container">
              <span class="footer-left">&lt;</span>

              <div class="footer-content">
                <div class="dashed-line"></div>

                <h3 class="text-spacing">Thank You</h3>

                <div class="dashed-line"></div>
              </div>

              <span class="footer-right">&gt;</span>
            </div>

            <div class="footer-links">
              <span>www.promodeagro.com</span>
              <span>FSSAI NO: 13624010000109</span>
            </div>

            <div class="footer-links">
              <span>support@promodeagro.com</span>
              <span>GSTIN NO: 36ABCFP1254A1ZS</span>
            </div>
          </footer>
        </div>
      </div>

      {showInvoice && flag && !isMobile && (
        <Button
          onClick={downloadPDF}
          iconName="download"
        >
          Download PDF
        </Button>
      )}
    </>
  );
};

export default Invoice2;
