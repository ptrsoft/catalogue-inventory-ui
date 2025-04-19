import React from "react";
import { Container } from "@cloudscape-design/components";

const OrderDetails = ({ selectedOrder, usersbyid }) => {
  return (
    <div>
      {/* Order and Customer Info */}
      <div className="items-container"  >
        <div style={{ marginBottom: "10px" }} >
          <Container >
            <div className="product-card">
              <div className="details">
                <div className="info-row">
                  <b>Order ID:</b>
                  <span className="value">{selectedOrder?.userInfo?.id}</span>
                </div>
                <div className="info-row">
                  <span className="label">Date:</span>

                  <span className="value">
                    {selectedOrder?.createdAt
                      ? new Date(selectedOrder?.createdAt).toLocaleString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                            timeZone: "UTC", // Ensures UTC time is used
                          }
                        )
                      : "N/A"}
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
                      {selectedOrder?.paymentDetails?.method}
                    </span>
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Address:</span>
                  <span className="value">
                    {selectedOrder?.address?.house_number},{" "}
                    {selectedOrder?.address?.address},{" "}
                    {selectedOrder?.address?.landmark_area},{" "}
                    {selectedOrder?.address?.zipCode}
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
                  <span className="value">{selectedOrder?.items.length}</span>
                </div>
                <div className="info-row">
                  <span className="label">Order Status:</span>
                  <span className="value">{selectedOrder?.status}</span>
                </div>
                <div className="info-row">
                  <span className="label">Total Price:</span>
                  <span className="value">{selectedOrder?.finalTotal}</span>
                </div>

                {usersbyid.map((user) => (
                  <div className="info-row" key={user.id}>
                    <span className="label">
                      {user.role === "rider"
                        ? "Rider Name:"
                        : user.role === "packer"
                        ? "Packer Name:"
                        : ""}
                    </span>
                    <span className="value">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
