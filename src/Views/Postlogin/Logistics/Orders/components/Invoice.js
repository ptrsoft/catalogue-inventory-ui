import React from 'react'
import { useRef } from 'react';
import logo from "../../../../../assets/images/image.png"
const Invoice = ({selectedOrder,printRef}) => {
 
  return (
    <div
    ref={printRef}
    style={{
      maxWidth: "400px",
      margin: "0 auto",
      padding: "20px",
      border: "1px dashed #000",
      fontFamily: "'Arial', sans-serif",
    }}
    className="print-content"
  >
    <div>
      <img
        src={logo}
        alt="Logo"
        style={{ width: "100px", height: "100px", marginBottom: "10px" }}
      />
      <h2 style={{ margin: "0", fontSize: "20px" }}>PROMODE AGRO FARMS</h2>
      <p style={{ margin: "0", fontSize: "14px" }}>Deliver Season’s Best</p>
      <p style={{ fontSize: "12px", margin: "5px 0" }}>
        Dargah Khaleej Khan
        <br />
        Kismatpur, Hyderabad, Telangana, 500028
        <br />
        Phone: 9701610033
      </p>
      <p style={{ fontSize: "12px", margin: "5px 0" }}>
        GSTIN NO: 36ABCFP1254A1ZS
      </p>
      <p style={{ fontSize: "12px", margin: "5px 0" }}>
        FSSAI NO: 13624010000109
      </p>
    </div>
    <hr />
    <h3 style={{ fontSize: "16px" }}>TAX INVOICE</h3>
    <p>
      <strong>Order ID:</strong> {selectedOrder?.orderId}
    </p>
    <p>
      <strong>Date:</strong>{" "}
      {new Date(selectedOrder?.createdAt).toLocaleDateString()} (
      {new Date(selectedOrder?.createdAt).toLocaleTimeString()})
    </p>
    <p>
      <strong>Slot Time:</strong> {selectedOrder?.deliverySlot?.startTime}{" "}
      To {selectedOrder?.deliverySlot?.endTime}
    </p>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        margin: "10px 0",
        fontSize: "12px",
      }}
    >
      <thead>
        <tr>
          <th style={{ borderBottom: "1px dashed #000" }}>ITEM NAME</th>
          <th style={{ borderBottom: "1px dashed #000" }}>QTY</th>
          <th style={{ borderBottom: "1px dashed #000" }}>RATE</th>
          <th style={{ borderBottom: "1px dashed #000" }}>AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        {selectedOrder?.items.map((item, index) => (
          <tr key={index}>
            <td style={{ borderBottom: "1px dashed #000" }}>
              {item.productName}
            </td>
            <td style={{ borderBottom: "1px dashed #000" }}>
              {item.quantity} {item.unit}
            </td>
            <td style={{ borderBottom: "1px dashed #000" }}>
              {item.price.toFixed(2)}
            </td>
            <td style={{ borderBottom: "1px dashed #000" }}>
              {item.subtotal.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <p style={{ textAlign: "right", marginRight: "20px" }}>
      <strong>Items:</strong> {selectedOrder?.items.length}
    </p>
    <p style={{ textAlign: "right", marginRight: "20px" }}>
      <strong>Sub Total:</strong> Rs. {selectedOrder?.subTotal}
    </p>
    <p style={{ textAlign: "right", marginRight: "20px" }}>
      <strong>Shipping Charges:</strong> Rs.{" "}
      {selectedOrder?.deliveryCharges}
    </p>
    <p style={{ textAlign: "right", marginRight: "20px" }}>
      <strong>Discount Amount:</strong> (-) Rs. {selectedOrder?.discount}
    </p>
    <hr />
    <h3 style={{ textAlign: "right", marginRight: "20px" }}>
      <strong>Grand Total:</strong> Rs. {selectedOrder?.totalPrice}
    </h3>
    <hr />
    <p style={{ fontSize: "14px", marginTop: "10px" }}>
      <strong>Thank You</strong>
    </p>
  </div>

  
  )
}

export default Invoice