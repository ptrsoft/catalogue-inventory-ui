import React, { useEffect, useState, useRef } from "react";
import logo from "../../../../../assets/image.png";
import Barcode from "./BarCode";
import { useDispatch } from "react-redux";
import { Button } from "@cloudscape-design/components";
import { fetchOrderById } from "Redux-Store/Orders/OrdersThunk";

const Invoice = ({ selectedOrder, flag }) => {
  // For printing bill

  const printRef = useRef([]);
  const [fetchedOrders, setFetchedOrders] = useState([]);
  const dispatch = useDispatch();

  const handlePrint = () => {
    if (Array.isArray(printRef.current)) {
      // Combine all the refs' content into one printable layout
      const printableContent = printRef.current
        .filter((el) => el) // Ensure refs are not null
        .map((el) => el.outerHTML) // Extract HTML of each ref
        .join(""); // Join all the content
      triggerPrint(printableContent);
    } else if (printRef.current) {
      // Handle single ref
      const printableContent = printRef.current.outerHTML;
      triggerPrint(printableContent);
    } else {
      console.error("No content to print!");
    }
  };

  // Helper function to trigger print
  const triggerPrint = (printableContent) => {
    if (printableContent) {
      setTimeout(() => {
        const WinPrint = window.open("", "", "width=900,height=650"); // Set size close to receipt width
        WinPrint.document.write(`
          <html>
            <head>
              <title>Invoice</title>
              <style>
                .invoice {
                  width: 100%;
                  text-align: left;
                }
              </style>
            </head>
            <body>
              <div class="invoice">
                ${printableContent}
              </div>
            </body>
          </html>
        `);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
      }, 1000); // Delay to ensure content is fully rendered
    } else {
      console.error("Printable content is empty!");
    }
  };

  useEffect(() => {
    if (Array.isArray(selectedOrder) && selectedOrder.length > 0) {
      const orderIds = selectedOrder.map((order) => order.id); // Extract order IDs

      // Fetch all orders simultaneously
      Promise.all(orderIds.map((id) => dispatch(fetchOrderById(id))))
        .then((responses) => {
          setFetchedOrders(responses.map((res) => res.payload)); // Assuming payload contains order data
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    } else {
      // If selectedOrder is not an array, store it in fetchedOrders directly
      setFetchedOrders([selectedOrder]);
    }
  }, [selectedOrder, dispatch]);

  // Preload the logo image for better visibility during printing
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = logo; // The image URL
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link); // Cleanup on unmount
    };
  }, [logo]);

  // Print on Ctrl+P key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "p") {
        event.preventDefault(); // Prevent the default print action
        handlePrint();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {flag === "multiple" ? (
        <Button
          variant="primary"
          onClick={handlePrint}
          disabled={selectedOrder?.length === 0} // Disable when no items are selected
        >
          Multiple Print Bill
        </Button>
      ) : (
        <button onClick={handlePrint} className="print-btn">
          Print Bill
        </button>
      )}

      {fetchedOrders.map((selectedOrder, index) => (
        <div
          key={selectedOrder?.id || index}
          ref={(el) => {
            if (printRef?.current) {
              // Dynamically assign ref if needed for printing
              printRef.current[index] = el;
            }
          }}
          style={{
            // marginBottom:'20px',
            width: "95mm",
            margin: "20px auto",
            padding: "15px",
            border: "0.1px dotted black",
            borderRadius: "10px",
            fontFamily: "'Arial', sans-serif",
            backgroundColor: "#fff",
          }}
          className="print-content"
        >
          {/* Header Section */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
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
            <div style={{ textAlign: "center" }}>
              <h3
                style={{ margin: "0", fontSize: "20px", fontWeight: "700px" }}
              >
                PROMODE AGRO FARMS
              </h3>
              <h4
                style={{ margin: "0", fontSize: "14px", fontWeight: "400px" }}
              >
                Deliver Season’s Best
              </h4>
            </div>
          </div>
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }}
          />
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "5px 0", fontWeight: "bold" }}>
              6-100,Dargah Khaleej Khan
            </p>
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
              <p style={{ margin: 0 }}>Phone : 9701610033</p>
              <hr
                style={{ flex: 1, border: "none", borderTop: "1px solid #000" }}
              />
            </div>
          </div>
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }}
          />
          <div style={{ textAlign: "center" }}>
            <p
              style={{ fontSize: "12px", margin: "5px 0", textAlign: "center" }}
            >
              GSTIN NO : 36ABCFP1254A1ZS
            </p>
            <p
              style={{ fontSize: "12px", margin: "5px 0", textAlign: "center" }}
            >
              FSSAI NO : 13624010000109
            </p>
          </div>

          <hr
            style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }}
          />

          {/* Invoice Details */}

          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{ fontSize: "14px", margin: "0", fontWeight: "normal" }}
              >
                TAX INVOICE
              </span>
              <span
                style={{
                  padding: "7px",
                  border: "0.1px solid",
                  borderRadius: "5px",
                  textAlign: "center",

                  fontFamily: "'Arial', sans-serif",
                  backgroundColor: "#fff",
                }}
              >
                {" "}
                {selectedOrder?.paymentDetails?.method}
              </span>
            </div>

            <strong>Order ID : {selectedOrder?.orderId}</strong>
            <div style={{ marginLeft: "-10px" }}>
              <Barcode
                // style={{ marginLeft: "-10px" }}
                orderId={selectedOrder?.orderId}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "7px" }}
            >
              <span style={{ fontWeight: "600" }}>
                Name : {selectedOrder?.userInfo?.name}
              </span>

              <div className="info-row" style={{ display: "flex" }}>
                <span
                  className="label"
                  style={{ fontWeight: "bold", marginRight: "8px" }}
                >
                  Address:
                </span>
                <span
                  className="value"
                  style={{ width: "400px", wordBreak: "break-word" }}
                >
                  {selectedOrder?.address?.house_number},
                  {selectedOrder?.address?.address},
                  {selectedOrder?.address?.landmark_area},
                  {selectedOrder?.address?.zipCode}
                </span>
              </div>

              <span>Contact Number :{selectedOrder?.userInfo?.number}</span>

              <span>
                Date : { selectedOrder?.createdAt
  ? new Date(selectedOrder?.createdAt).toLocaleString("en-GB", {
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
              </span>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  Slot Time : {selectedOrder?.deliverySlot?.startTime}
                  {selectedOrder?.deliverySlot?.startAmPm} To{" "}
                  {selectedOrder?.deliverySlot?.endTime}
                  {selectedOrder?.deliverySlot?.endAmPm}
                </span>
                <span>Items : {selectedOrder?.items?.length}</span>
              </div>
            </div>
          </>

          <hr
            style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }}
          />

          {/* Table Section */}
          <table
            style={{
              width: "100%",

              fontSize: "12px",
              textAlign: "center",
            }}
          >
            <thead style={{ borderBottom: "1px dashed #000", padding: "10px" }}>
              <tr>
                <th
                  style={{
                    margin: "7px",
                    textAlign: "left",
                  }}
                >
                  ITEM NAME
                </th>
                <th style={{ margin: "7px", textAlign: "left" }}>UNIT</th>
                <th style={{ margin: "7px" }}>QTY</th>
                <th style={{ margin: "7px" }}>RATE</th>
                <th style={{ margin: "7px" }}>AMOUNT</th>
              </tr>
              <tr>
                <td colSpan="5">
                  <hr
                    style={{
                      flex: 1,
                      border: "none",
                      borderBottom: "1px dashed #000",
                    }}
                  />
                </td>
              </tr>
            </thead>

            <tbody style={{ padding: "10px", margin: "10px" }}>
              {selectedOrder?.items?.map((item, index) => (
                <tr style={{ padding: "10px", margin: "10px" }} key={index}>
               <td style={{ textAlign: "left", width: "140px" }}>
  {(() => {
    const parts = item.productName.split("-");
    return parts.length > 2 ? parts.slice(0, -1).join("-") : parts[0];
  })()}
</td>

<td style={{ textAlign: "left" }}>
  {item.productName.includes("-") 
    ? (item.productName.includes("pieces") 
        ? item.productName.replace("pieces", "pcs").split("-").pop()
        : item.productName.split("-").pop()
      )
    : "no unit"}
</td>


                  <td>
                    {item.quantity}

                    {/* {item.unit === "pieces" ? "pcs" : item.unit} */}
                  </td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr
            style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }}
          />

          {/* Summary Section */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              // alignItems: "center",
            }}
          >
            <p></p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
                widt: "250px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <span>Sub Total : </span>{" "}
                <span style={{ width: "80px" }}>
                  Rs.{selectedOrder?.subTotal}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <span>Shipping Charges :</span>{" "}
                <span style={{ width: "80px" }}>
                  Rs.{selectedOrder?.deliveryCharges}
                </span>
              </div>
            </div>
          </div>

          <hr
            style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }}
          />

          <h3 style={{ textAlign: "right" }}>
            <strong>Grand Total : </strong> Rs. {selectedOrder?.finalTotal}
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
            <hr
              style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }}
            />
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
              Thank You
            </p>
            <hr
              style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default Invoice;
