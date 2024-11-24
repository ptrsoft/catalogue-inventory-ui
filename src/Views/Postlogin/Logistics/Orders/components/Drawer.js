import React from 'react'
import { Container,Box,Flashbar,Header,Button,Table,SpaceBetween } from '@cloudscape-design/components'

const Drawer = ({isDrawerOpen,selectedProduct,handleCloseDrawer,selectedOrder,handleOpenModal,handlePrint,error,flashMessages}) => {
  return (
    <div>
     {isDrawerOpen && selectedProduct && (
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              width: "380px",
              backgroundColor: "white",
              boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              overflowY: "auto",
              color: "red",
            }}
          >
            {" "}
            {flashMessages.length > 0 && <Flashbar items={flashMessages} />}
            <Box padding="l">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Header variant="h3">Orders Details</Header>

                <Button
                  iconName="close"
                  variant="icon"
                  onClick={handleCloseDrawer}
                />
              </div>
              <hr></hr>
              {/* Order and Customer Info */}
              <div className="items-container">
                <div style={{ marginBottom: "10px" }}>
                  <Container>
                    <div className="product-card">
                      <div className="details">
                        <div className="info-row">
                          <b>Order ID:</b>
                          <span className="value">
                            {selectedOrder?.userInfo?.id}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Customer Name:</span>
                          <span className="value">
                            {selectedOrder?.userInfo?.name}
                            <span
                              style={{
                                backgroundColor: "#4B5563",
                                color: "#FFF",
                                padding: "2px 8px",
                                borderRadius: "5px",
                                fontSize: "12px",
                                marginLeft: "5px",
                              }}
                            >
                              {selectedOrder?.paymentDetails?.method === "cash"
                                ? "COD"
                                : "Prepaid"}
                            </span>
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Address:</span>
                          <span className="value">
                            {selectedOrder?.shippingDetails?.address}{" "}
                            {selectedOrder?.shippingDetails?.zipcode}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Contact No:</span>
                          <span className="value">
                            {selectedOrder?.userInfo?.number}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Payment:</span>
                          <span className="value">
                            {selectedOrder?.paymentDetails?.method}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Total Items:</span>
                          <span className="value">
                            {selectedOrder?.items.length}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">Order Status:</span>
                          <span className="value">{selectedOrder?.status}</span>
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
              </div>

              {/* Action Buttons */}

              {/* Items List */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box variant="h4">Items List </Box>
                <div class="button-container">
                  <button
                    class="cancel-btn"
                    onClick={() => handleOpenModal(selectedOrder?.userInfo?.id)}
                  >
                    Cancel Order
                  </button>

                  <button onClick={handlePrint} class="print-btn">
                    Print Bill
                  </button>
                </div>
              </div>

              <Table
                empty={
                  <Box
                    margin={{ vertical: "xs" }}
                    textAlign="center"
                    color="inherit"
                  >
                    <SpaceBetween size="m">
                      {error ? (
                        <b>{error} No orders</b>
                      ) : (
                        <>
                          <b>No Orders available</b>{" "}
                          {/* Show no data message */}
                        </>
                      )}
                    </SpaceBetween>
                  </Box>
                }
                columnDefinitions={[
                  {
                    header: "Product Name",
                    cell: (item) => (
                      <Box display="flex" alignItems="center">
                        <span style={{ fontSize: "20px", marginRight: "8px" }}>
                          {item.productImage}
                        </span>
                        {item.productName}
                      </Box>
                    ),
                  },
                  { header: "Quantity", cell: (item) => item.quantity },
                  { header: "Price", cell: (item) => item.price },
                ]}
                items={selectedOrder?.items}
                variant="embedded"
                stickyHeader
              />
            </Box>
          </div>
        )}
    </div>
  )
}

export default Drawer