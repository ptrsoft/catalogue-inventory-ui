import React from "react";

import logo from "../../../../../assets/images/image.png";
import Barcode from "./BarCode";

const Invoice = ({ selectedOrder, printRef }) => {
  
  return (

    <div
      ref={printRef}
      style={{
        width: "90mm",
        margin: "0 auto",
        padding: "20px",
        border: "0.1px dotted black",
        borderRadius:"10px",
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#fff",
     
      }}
      className="print-content"
    >
      {/* Header Section */}

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "45px",
            height: "45px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        />
        <div style={{textAlign:"center"}}>
          <h3 style={{ margin: "0", fontSize: "20px",fontWeight:'700px' }}>PROMODE AGRO FARMS</h3>
          <h4 style={{ margin: "0", fontSize: "14px",fontWeight:'400px' }}>
            Deliver Season’s Best
          </h4>
        </div>
      </div>
      <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />
      <div style={{textAlign:"center"}}>
        <p style={{ margin: "5px 0" }}>Dargah Khaleej Khan</p>
        <p style={{ margin: "5px 0" }}>
          Kismatpur, Hyderabad, Telangana, 500028
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "5px 0",
          }}
        >
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px solid #000" }}
          />
          <p style={{ margin: 0, fontWeight: "bold" }}>Phone: 9701610033</p>
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px solid #000" }}
          />
        </div>
      </div>
      <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />
     <div style={{textAlign:'center'}}>
      <p style={{ fontSize: "12px", margin: "5px 0", textAlign:"center" }}>
        GSTIN NO: 36ABCFP1254A1ZS
      </p>
      <p style={{ fontSize: "12px", margin: "5px 0",textAlign:"center" }}>
        FSSAI NO: 13624010000109
      </p>
      </div>

      <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />

      {/* Invoice Details */}
  
   
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              // alignItems: "center",
            }}
          >
            
          <div>
          <h4 style={{ fontSize: "14px", margin: "0",fontWeight:'normal' }}>TAX INVOICE</h4>
          <p>
            <strong>Name:</strong> {selectedOrder?.userInfo?.name}
          </p>

          {/* <p>
            <strong>Order ID:</strong> {selectedOrder?.orderId}
          </p> */}
      
          <p>
          Date:{" "}
            {new Date(selectedOrder?.createdAt).toLocaleDateString()} (
            {new Date(selectedOrder?.createdAt).toLocaleTimeString()})
          </p>
          <p>
            Slot Time:{selectedOrder?.deliverySlot?.startTime}{" "}
            To {selectedOrder?.deliverySlot?.endTime}
          </p>
          </div>
          <div>
           <div>
            <div style={{
               padding: "2px",
               border: "0.1px solid",
               borderRadius:"5px",
               textAlign:'center',
               width:'95px',
               fontFamily: "'Arial', sans-serif",
               backgroundColor: "#fff",
             
            }}> {selectedOrder?.paymentDetails?.method === "cash"
              ? "COD"
              : "Prepaid"}</div>
                  <Barcode orderId={selectedOrder?.orderId}/>
                  </div>
            
          
          </div>
     </div>
      
      <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />

      {/* Table Section */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          // margin: "10px 0",
          fontSize: "12px",
          textAlign:"center",
        //  borderBottom: "1px dashed #000", paddingBottom:"2px"
        }}
      >
        <thead style={{ borderBottom: "1px dashed #000", padding:"10px" }}>
          <tr  >
            <th>ITEM NAME</th>
            <th>QTY</th>
            <th>RATE</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        
        
        {/* <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} /> */}
        <tbody style={{padding:'10px'}}>
          {selectedOrder?.items.map((item, index) => (
            <tr key={index}>
              <td>{item.productName}</td>
              <td>
                {item.quantity} {item.unit}
              </td>
              <td>{item.price.toFixed(2)}</td>
              <td>{item.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      
        {/* <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} /> */}
      </table>
      <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />

      {/* Summary Section */}
      
      <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              // alignItems: "center",
            }}
          >
        <p>
          Items:{selectedOrder?.items.length}
        </p>
        <div>
        <p>
          Sub Total:Rs. {selectedOrder?.subTotal}
        </p>
        <p>
          Shipping Charges: Rs.{" "}
          {selectedOrder?.deliveryCharges}
        </p>
        <p>
          Discount Amount: (-) Rs. {selectedOrder?.discount}
        </p>
        </div>
        </div>
   

      <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />

      <h3 style={{ textAlign: "right" }}>
        <strong>Grand Total:</strong> Rs. {selectedOrder?.totalPrice}
      </h3>



      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
       <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />
        <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
          Thank You
        </p>
        <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />
      </div>
    </div>
  );
};

export default Invoice;
