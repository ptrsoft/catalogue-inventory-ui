import React, { useState } from "react";
import {
  ColumnLayout,
  Box,
  Button,
  Header,
  Container,
  SpaceBetween,
  Tabs,
  StatusIndicator,
} from "@cloudscape-design/components";
import { useMediaQuery } from "react-responsive";
import BarChart from "@cloudscape-design/components/bar-chart";

const Overview = ({ selectedProduct }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [activeVariantTab, setActiveVariantTab] = useState(0);

  if (!selectedProduct) {
    return <div>No product selected</div>;
  }

  // Variants array fallback
  const variants = selectedProduct.variations || [];
  const activeVariant = variants[activeVariantTab] || {};

  return (
    <div>
      {/* Top Bar: Name, Stock, Status, Action/Edit/Active */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ color: "#0972D3", margin: 0 }}>{selectedProduct.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 18 }}>
              Stock : {selectedProduct.stockQuantity} {selectedProduct.units}
            </span>
            {selectedProduct.stockAlert && (
              <span style={{ fontSize: 14, marginLeft: 8 }}>
                {selectedProduct.stockAlert === "Low Stock" ? (
                  <StatusIndicator type="warning" size="small">
                    {selectedProduct.stockAlert}
                  </StatusIndicator>
                ) : (
                  <span style={{ color: "#0972D3" }}>{selectedProduct.stockAlert}</span>
                )}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary">Action</Button>
          <Button variant="normal">Edit</Button>
          <Button variant={selectedProduct.active ? "primary" : "normal"}>
            {selectedProduct.active ? "Active" : "Inactive"}
          </Button>
        </div>
      </div>

      {/* Variant Tabs */}
      {variants.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {variants.map((variant, idx) => (
              <Button
                key={idx}
                variant={activeVariantTab === idx ? "primary" : "normal"}
                onClick={() => setActiveVariantTab(idx)}
                style={{ borderRadius: 20 }}
              >
                {variant.name || `Variant ${idx + 1}`}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="overview" style={{ display: isMobile ? "block" : "flex" }}>
        {/* Image Section */}
        <div
          style={{
            borderRadius: "10px",
            backgroundColor: "#E9EBED",
            padding: "15px",
            marginBottom: isMobile ? "30px" : 0,
            marginRight: isMobile ? 0 : "30px",
            width: isMobile ? "100%" : 250,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            style={{
              border: "1px solid #D9D9D9",
              width: 200,
              height: 200,
              objectFit: 'cover',
              borderRadius: 10,
            }}
            src={selectedProduct.image}
            alt="product"
          />
          <Button iconName="add-plus" variant="icon" style={{ marginTop: 10 }} />
        </div>

        {/* Info Section */}
        <div style={{ width: isMobile ? "100%" : "38vw" }}>
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
                  <Header variant={isMobile ? "h3" : "h2"}>Item Information</Header>
                  <ColumnLayout columns={2} minColumnWidth={isMobile ? 120 : 170}>
                    <p>Category :</p>
                    <p>{selectedProduct.category}</p>
                    <p>Item Code :</p>
                    <p>#{selectedProduct.itemCode}</p>
                    <p>Units :</p>
                    <p>{selectedProduct.units}</p>
                    <p>Created Source :</p>
                    <p>{selectedProduct.createdSource || "Admin"}</p>
                    <p>Description :</p>
                    <p>{selectedProduct.description || "-"}</p>
                  </ColumnLayout>
                </SpaceBetween>
              </Container>

              {/* Purchase and Sales Information */}
              <Container>
                <SpaceBetween size="s">
                  <Header variant={isMobile ? "h3" : "h2"}>Purchase and Sales Information</Header>
                  <ColumnLayout columns={2} minColumnWidth={isMobile ? 120 : 170}>
                    <p>Purchasing Price :</p>
                    <p>Rs. {activeVariant.purchasingPrice || selectedProduct.purchasingPrice}</p>
                    <p style={{ width: isMobile ? "155px" : "100%" }}>Minimum Selling Price :</p>
                    <p>Rs. {activeVariant.sellingPrice || selectedProduct.msp}</p>
                  </ColumnLayout>
                </SpaceBetween>
              </Container>

              {/* Quantity on Hand */}
              <Container>
                <SpaceBetween size="s">
                  <Header variant={isMobile ? "h3" : "h2"}>Quantity on Hand</Header>
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
                    {activeVariant.stockQuantity || selectedProduct.stockQuantity}
                    {selectedProduct.units}
                  </h1>
                  <ColumnLayout columns={2} minColumnWidth={isMobile ? 120 : 170}>
                    <p>
                      <b>Main Warehouse :</b>
                    </p>
                    <p>{activeVariant.stockQuantity || selectedProduct.stockQuantity}{selectedProduct.units}</p>
                    <p>Girdhari Store :</p>
                    <p>{activeVariant.stockQuantity || selectedProduct.stockQuantity}{selectedProduct.units}</p>
                  </ColumnLayout>
                </SpaceBetween>
              </Container>
            </div>
          </ColumnLayout>
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
