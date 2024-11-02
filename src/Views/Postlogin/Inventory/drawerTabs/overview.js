import React from "react";
import {
  ColumnLayout,
  Box,
  Button,
  Header,
  Container,
  SpaceBetween,
} from "@cloudscape-design/components";
import BarChart from "@cloudscape-design/components/bar-chart";

const Overview = ({ selectedProduct }) => {
  if (!selectedProduct) {
    return <div>No product selected</div>;
  }

  return (
    <div>
      <div className="overview">
        <div style={{ width: "38vw" }}>
          <ColumnLayout columns={1}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                fontSize: "14px",
              }}
            >
              {/* Item Information */}
              <Container>
                <SpaceBetween size="s">
                  <Header>Item Information</Header>
                  <ColumnLayout columns={2} minColumnWidth={170}>
                    <p>Category :</p>
                    <p>{selectedProduct.category}</p>
                    <p>Item Code :</p>
                    <p>#{selectedProduct.itemCode}</p>
                    <p>Units :</p>
                    <p>{selectedProduct.units}</p>
                    <p>Created Source :</p>
                    <p>Admin</p>
                  </ColumnLayout>
                </SpaceBetween>
              </Container>

              {/* Purchase and Sales Information */}
              <Container>
                <SpaceBetween size="s">
                  <Header>Purchase and Sales Information</Header>
                  <ColumnLayout columns={2} minColumnWidth={170}>
                    <p>Purchasing Price :</p>
                    <p>Rs. {selectedProduct.purchasingPrice}</p>
                    <p>Minimum Selling Price :</p>
                    <p>Rs. {selectedProduct.msp}</p>
                  </ColumnLayout>
                </SpaceBetween>
              </Container>

              {/* Quantity on Hand */}
              <Container>
                <SpaceBetween size="s">
                  <Header>Quantity on Hand</Header>
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
                      {selectedProduct.stockQuantity}
                      {selectedProduct.units}
                    </h1>
                  <ColumnLayout columns={2} minColumnWidth={170}>
                   
                    
                      <p>
                        <b>Main Warehouse :</b> 
                      </p>
                      <p>{selectedProduct.stockQuantity}{selectedProduct.units}
                      </p>
                      <p>
                        Girdhari Store :
                      </p>
                      <p> {selectedProduct.stockQuantity}
                      {selectedProduct.units}</p>
                  </ColumnLayout>
                </SpaceBetween>
              </Container>
            </div>
          </ColumnLayout>
        </div>

        {/* Product Image */}
        <div
          style={{
            borderRadius: "10px",
            backgroundColor: "#E9EBED",
            height: "47vh",
            padding: "15px",
            marginTop: "5px",
            marginBottom: "10px",
          }}
        >
          <div>
            <img
              style={{
                border: "1px solid #D9D9D9",
                width: "228px",
                height: "250px",
              }}
              src={selectedProduct.image}
              alt="product"
            />
          </div>

          {/* Optional Additional Images */}
          <div style={{ display: "flex", gap: "15px", paddingTop: "7px" }}>
            {/* {selectedProduct.images && selectedProduct.images[1] && (
              <div
                style={{
                  border: "1px solid #D9D9D9",
                  borderRadius: "10px",
                  height: "37px",
                  width: "50px",
                }}
              >
                <img
                  style={{
                    borderRadius: "10px",
                    height: "37px",
                    width: "50px",
                  }}
                  src={selectedProduct.images[1]}
                  alt="additional product"
                />
              </div>
            )} */}

            {/* {selectedProduct.images && selectedProduct.images[2] && (
              // <div
              //   style={{
              //     border: "1px solid #D9D9D9",
              //     borderRadius: "10px",
              //     height: "37px",
              //     width: "50px",
              //   }}
              // >
              //   <img
              //     style={{
              //       borderRadius: "10px",
              //       height: "37px",
              //       width: "50px",
              //     }}
              //     src={selectedProduct.images[2]}
              //     alt="additional product"
              //   />
              // </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Sales Order Summary with Bar Chart */}
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
            yTickFormatter: (e) => {
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
