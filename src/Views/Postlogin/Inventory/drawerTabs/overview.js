import React from "react";
import {
  ColumnLayout,
  Box,
  Button,
  Header,
} from "@cloudscape-design/components";
import BarChart from "@cloudscape-design/components/bar-chart";

const Overview = ({ selectedProduct }) => {
  if (!selectedProduct) {
    return <div>No product selected</div>;
  }

  return (
    <div>
      <div style={{ display:"flex",gap:"65px" }}>
       <div style={{width:"38vw"}}>
        <ColumnLayout columns={1}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                fontSize: "14px",
                border: "1px solid #D9D9D9",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h2>
                <b>Item Information</b>
              </h2>
              <p>
                Category
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;
                {selectedProduct.category}
              </p>
              <p>
                Item
                Code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;
                {selectedProduct.itemCode}
              </p>
              <p>
                Units&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;kg
              </p>
              <p>
                Created Source&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;Admin
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                border: "1px solid #D9D9D9",
                fontSize: "14px",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h3>
                <b>Purchase and Sales Information</b>
              </h3>
              <p>
                Purchasing
                Price&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {selectedProduct.purchasingPrice}
              </p>
              <p>
                Minimum Selling Price&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                {selectedProduct.msp}
              </p>
            </div>
            <div
              style={{
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #D9D9D9",
              }}
            >
              <h3>
                <b>Quantity On Hand</b>
              </h3>
              <h1
                style={{
                  backgroundColor: "#E9EBED",
                  padding: "15px",
                  fontSize: "20px",
                  fontWeight: "700",
                  borderRadius: "10px",
                  display: "inline-block",
                  color: "#354150",
                }}
              >
                {selectedProduct.stockQuantity}KG
              </h1>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  fontSize: "14px",
                }}
              >
                <p>
                  <b>Main Warehouse</b>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;
                  {selectedProduct.stockQuantity}kg
                </p>
                <p>
                  Girdhari
                  Store&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;
                  {selectedProduct.quantityOnHand}kg
                </p>
              </div>
            </div>
          </div>
        </ColumnLayout>
        </div>
        <div style={{borderRadius:"10px",backgroundColor:"#E9EBED",height:"45vh",padding:"15px"}}>
        <div style={{ width: "228px", height: "250px" }}>
            <div> 
              <img
                style={{border: "1px solid #D9D9D9" }}
                src={selectedProduct.images[0]}
                alt="product"
                height="full"
                width="full"
              ></img>
            </div>
            <div style={{ display: "flex", gap: "15px", paddingTop: "7px" }}>
              <div style={{ border: "1px solid #D9D9D9", borderRadius: "10px",height: "42px", width: "48px" }}>
                <img
                  style={{ borderRadius: "10px",  }}
                  src={selectedProduct.imageUrl}
                  alt="product"
                  height="full"
                  width="full"
                ></img>
              </div>
              <div style={{marginTop:"8px"}}>
              <Button iconName="add-plus" variant="primary">
      
    </Button>
              </div>
            </div>
        </div>
        </div>
      </div>
      <div
        style={{
          border: "1px solid #D9D9D9",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "30px",
        }}
      >
        <Header variant="h3" description="">
          Sales Order Summary
        </Header>
        <BarChart
          series={[
            {
              title: "Site 1",
              type: "bar",
              data: [
                { x: new Date(2023, 0), y: 34503 },
                { x: new Date(2023, 1), y: 25832 },
                { x: new Date(2023, 2), y: 4012 },
                { x: new Date(2023, 3), y: 5602 },
                { x: new Date(2023, 4), y: 17839 },
                { x: new Date(2023, 5), y: 22000 },
                { x: new Date(2023, 6), y: 30000 },
                { x: new Date(2023, 7), y: 15000 },
                { x: new Date(2023, 8), y: 27000 },
                { x: new Date(2023, 9), y: 23000 },
                { x: new Date(2023, 10), y: 18000 },
                { x: new Date(2023, 11), y: 29000 },
              ],
              valueFormatter: (e) =>
                "$" +
                e.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
            },
            {
              title: "Average revenue",
              y: 19104,
              valueFormatter: (e) =>
                "$" +
                e.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }),
            },
          ]}
          xDomain={[
            new Date(2023, 0),
            new Date(2023, 1),
            new Date(2023, 2),
            new Date(2023, 3),
            new Date(2023, 4),
            new Date(2023, 5),
            new Date(2023, 6),
            new Date(2023, 7),
            new Date(2023, 8),
            new Date(2023, 9),
            new Date(2023, 10),
            new Date(2023, 11),
          ]}
          yDomain={[-10000, 40000]}
          i18nStrings={{
            xTickFormatter: (e) =>
              e.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              }),
            yTickFormatter: function o(e) {
              return Math.abs(e) >= 1e9
                ? (e / 1e9).toFixed(1).replace(/\.0$/, "") + "G"
                : Math.abs(e) >= 1e6
                ? (e / 1e6).toFixed(1).replace(/\.0$/, "") + "M"
                : Math.abs(e) >= 1e3
                ? (e / 1e3).toFixed(1).replace(/\.0$/, "") + "K"
                : e.toFixed(2);
            },
          }}
          ariaLabel="Single data series line chart"
          height={150}
          hideLegend
          xTitle="Month"
          yTitle="Revenue (USD)"
          empty={
            <Box textAlign="center" color="inherit">
              <b>No data available</b>
              <Box variant="p" color="inherit">
                There is no data available
              </Box>
            </Box>
          }
          noMatch={
            <Box textAlign="center" color="inherit">
              <b>No matching data</b>
              <Box variant="p" color="inherit">
                There is no matching data to display
              </Box>
              <Button>Clear filter</Button>
            </Box>
          }
        />
      </div>
    </div>
  );
};

export default Overview;
