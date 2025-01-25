import React, { useEffect, useState } from "react";

import logo from "../../../../../assets/img/Favicon Icon Promode (1).svg";
import Barcode from "./BarCode";
import { useDispatch } from "react-redux";
import {
  fetchOrderById,
} from "Redux-Store/Orders/OrdersThunk";
const Invoice = ({ selectedOrder, printRef }) => {
  console.log(selectedOrder,"order from invoice");
  const dispatch = useDispatch();
  const [fetchedOrders, setFetchedOrders] = useState([]);


  useEffect(() => {
    if (selectedOrder && selectedOrder.length > 0) {
      const orderIds = selectedOrder.map((order) => order.id); // Extract order IDs
      console.log("Order IDs:", orderIds);

      // Fetch all orders simultaneously
      Promise.all(orderIds.map((id) => dispatch(fetchOrderById(id))))
        .then((responses) => {
          setFetchedOrders(responses.map((res) => res.payload)); // Assuming payload contains order data
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [selectedOrder, dispatch]);
  console.log(fetchedOrders,"order by idss data");
  return (
    <>
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
        width: "100mm",
        margin: "0 auto",
        padding: "10px",
        border: "0.1px dotted black",
        borderRadius: "10px",
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
        <div style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0", fontSize: "20px", fontWeight: "700px" }}>
            PROMODE AGRO FARMS
          </h3>
          <h4 style={{ margin: "0", fontSize: "14px", fontWeight: "400px" }}>
            Deliver Season’s Best
          </h4>
        </div>
      </div>
      <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />
      <div style={{ textAlign: "center" }}>
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
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", margin: "5px 0", textAlign: "center" }}>
          GSTIN NO: 36ABCFP1254A1ZS
        </p>
        <p style={{ fontSize: "12px", margin: "5px 0", textAlign: "center" }}>
          FSSAI NO: 13624010000109
        </p>
      </div>

      <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />

      {/* Invoice Details */}

      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          
          }}
        >
          <span style={{ fontSize: "14px", margin: "0", fontWeight: "normal" }}>
            TAX INVOICE
          </span>
          <span
            style={{
              padding: "5px",
              border: "0.1px solid",
              borderRadius: "5px",
              textAlign: "center",

              fontFamily: "'Arial', sans-serif",
              backgroundColor: "#fff",
            }}
          >
            {" "}
            {selectedOrder?.paymentDetails?.method 
             }
          </span>
        </div>

        <strong>Order ID:{selectedOrder?.orderId}</strong>

        
          <Barcode style={{ marginLeft: "-5px" }} orderId={selectedOrder?.orderId} />
        
        <p>Name:{selectedOrder?.userInfo?.name}</p>

        <p>
          Address:
          {selectedOrder?.shippingDetails?.address},
          {selectedOrder?.shippingDetails?.zipcode}
        </p>

        <p>
          Contact Number:
          {selectedOrder?.userInfo?.number}
        </p>

        <p>
          Date: {new Date(selectedOrder?.createdAt).toLocaleDateString()} (
          {new Date(selectedOrder?.createdAt).toLocaleTimeString()})
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>
            Slot Time:{selectedOrder?.deliverySlot?.startTime} To{" "}
            {selectedOrder?.deliverySlot?.endTime}
          </p>
          <p>Items:{selectedOrder?.items?.length}</p>
        </div>
      </>
      

      <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} />

      {/* Table Section */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: "10px 0",
          padding: "10px",
          fontSize: "12px",
          textAlign: "center",
          //  borderBottom: "1px dashed #000", paddingBottom:"2px"
        }}
      >
        <thead style={{ borderBottom: "1px dashed #000", padding: "10px" }}>
          <tr style={{ padding: "5px", margin: "5px" }}>
            <th
              style={{
                marginBottom: "5px",
                padding: "5px",
                margin: "5px",
                textAlign: "left",
              }}
            >
              ITEM NAME
            </th>
            <th style={{ marginBottom: "5px", padding: "5px", margin: "5px" }}>
              QTY
            </th>
            <th style={{ marginBottom: "5px", padding: "5px", margin: "5px" }}>
              RATE
            </th>
            <th style={{ marginBottom: "5px", padding: "5px", margin: "5px" }}>
              AMOUNT
            </th>
          </tr>
        </thead>

        {/* <hr style={{ flex: 1, border: "none", borderTop: "1px dashed #000" }} /> */}
        <tbody style={{ padding: "10px", margin: "10px" }}>
          {selectedOrder?.items?.map((item, index) => (
            <tr style={{ padding: "10px", margin: "10px" }} key={index}>
              <td
                style={{
                  textAlign: "left",
                }}
              >
                {item.productName}
              </td>
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
        <p></p>
        <div>
          <p>Sub Total:Rs. {selectedOrder?.subTotal}</p>
          <p>Shipping Charges: Rs. {selectedOrder?.deliveryCharges}</p>
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
    ))}
    </>
  );
};

export default Invoice;
