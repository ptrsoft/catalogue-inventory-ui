import React, { useEffect } from "react";
import JsBarcode from "jsbarcode";

const Barcode = ({ orderId }) => {
  useEffect(() => {
    // Ensure orderId is passed and generate barcode
    if (orderId) {
      JsBarcode("#barcode", orderId, {
        format: "CODE128", // Barcode format
        lineColor: "#000", // Barcode line color
        width: 1,          // Width of barcode lines
        height: 30,        // Height of barcode
        // displayValue: true,
         // Display the value (order ID) below the barcode
      });
    }
  }, [orderId]); // Re-run when the orderId changes

  return <svg id="barcode"></svg>; // This is where the barcode will be rendered
};

export default Barcode;
