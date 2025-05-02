import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  SpaceBetween,
  BreadcrumbGroup,
  Input,
  Header,
  ColumnLayout,
  Modal,
} from "@cloudscape-design/components";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  fetchRunsheetById,
  closeRunsheet,
} from "Redux-Store/Runsheet/RunsheetThunk";
import PackIcon from "../../../../../assets/img/image.png";
import { useMediaQuery } from 'react-responsive';


const ViewDetailsPage = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const { id: runsheetId } = useParams();
  const { status } = location.state || {};
  const { selectedRunsheet, loading, error } = useSelector(
    (state) => state.runsheet
  );
  const orderIds = selectedRunsheet?.orders || []; // Use orders from fetched runsheet data
  console.log(orderIds, "id");
  useEffect(() => {
    dispatch(fetchRunsheetById(runsheetId));
  }, [dispatch, runsheetId]);

  const handleCloseRunsheet = () => setIsModalOpen(true);

  const handleConfirmCloseRunsheet = (amount) => {
    console.log(amount, "from UI");
    dispatch(closeRunsheet({ id: runsheetId, amount }));
    setIsModalOpen(false);
    navigate("/app/Logistics/CollectionPayment", {
      state: { successMessage: "Runsheet Closed successfully!" },
    });
    setAmount(""); // Reset amount after confirming
  };

  const handleConfirm = () => {
    handleConfirmCloseRunsheet(amount);
  };
  const totalAmount =
    selectedRunsheet?.orders?.reduce(
      (total, order) => total + parseFloat(order?.price || 0),
      0
    ) -
    selectedRunsheet?.orders
      ?.filter((order) => order?.deliveryStatus === "undelivered")
      ?.reduce((total, order) => total + parseFloat(order?.price || 0), 0);

  return (
    <Box>
      <SpaceBetween direction="vertical" size="s">
        {/* Breadcrumbs */}
        <BreadcrumbGroup
          items={[
            // { text: "Logistics", href: "/app/dashboard" },
            { text: "Runsheet", href: "/app/Logistics/runsheet" },
            { text: "View Runsheet", href: "/runsheet/view" },
          ]}
          ariaLabel="Breadcrumbs"
        />
  {status === "Cash Pending" && (
              <div className="status-container" style={{ width:"100%", display:'flex',justifyContent:'end' }}>
                <Button variant="primary" onClick={handleCloseRunsheet}>
                  Close Runsheet
                </Button>
              </div>
            )}
        <SpaceBetween direction="vertical" size="s">
          <div
            className="runsheet-container"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* Runsheet Details */}
            <div className="details" style={{ width: "40%" }}>
              <div className="info-row">
                <span className="label">Date:</span>
                <span className="value" style={{width:'190px',marginLeft:'-25px'}}>
                  {selectedRunsheet?.createdAt.slice(0, 10)}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Runsheet ID:</span>
                <span className="value" style={{width:'190px',marginLeft:'-25px'}}>{selectedRunsheet?.id}</span>
              </div>
              <div className="info-row">
                <span className="label">Rider Name:</span>
                <b style={{width:'190px',marginLeft:'-25px'}}>{selectedRunsheet?.rider.name}</b>
              </div>
              <div className="info-row">
                <span className="label">Rider ID:</span>
                <b style={{width:'190px',marginLeft:'-25px'}}>{selectedRunsheet?.rider?.id}</b>
              </div>
            </div>
          
            {status === "Cash Received" && (
              <div className="status-container" style={{ width: "300px" }}>
                <div
                  style={{ display: "flex", gap: "5px", alignItems: "center" }}
                >
                  <div style={{ fontWeight: "bold", width: "280px" }}>
                    Runsheet Total Amount:
                  </div>
                  <Input value={selectedRunsheet?.amountCollectable} readOnly />
                </div>
              </div>
            )}
          </div>
          <div className="runsheet-container">
            {/* Line of Orders */}
            <Box fontWeight="bold" variant="h2">
              Line of orders{" "}
              <span
                style={{
                  color: "#000716",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                ({orderIds.length} Order)
              </span>
            </Box>
            <Header variant="h4">Order ID</Header>
            <SpaceBetween direction="vertical">
              {orderIds.map((orderId, index) => (
                <div style={{ width: "280px" }} key={index}>
                  <Input value={orderId?.id} readOnly />
                </div>
              ))}
            </SpaceBetween>
          </div>
          {/* <Box margin={{ bottom: "s" }}>
              Did you collect the total amount of Rs.{selectedRunsheet?.amountCollectable} for Runsheet ID :{selectedRunsheet?.id}?
            </Box>
            <FormField label="Runsheet Total Amount">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.detail.value)}
                placeholder="Enter amount in Rs."
              />
            </FormField> */}
          {/* /* Close Runsheet Modal */}
          <Modal
            onDismiss={() => setIsModalOpen(false)}
            visible={isModalOpen}
            closeAriaLabel="Close modal"
            header="Close Runsheet"
            footer={
              <Box float="right">
                <SpaceBetween direction="horizontal" size="s">
                  <Button variant="link" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={!amount} // Enable only if amount is entered
                  >
                    Confirm
                  </Button>
                </SpaceBetween>
              </Box>
            }
          >
            <hr />
            {/* Rider Details */}
            <Box margin={{ bottom: "s" }}>
              Rider ID & Name: ( {`${selectedRunsheet?.rider?.id || "N/A"}`})
              <strong> {`${selectedRunsheet?.rider?.name || "N/A"}`}</strong>
            </Box>
            <Box margin={{ bottom: "s" }} color="text-status-info">
              <strong>Run Sheet ID:</strong>
              <strong style={{ color: "black" }}>
                {" "}
                {`${selectedRunsheet?.id || "N/A"}`}
              </strong>
            </Box>

            <SpaceBetween direction="vertical" size="l">
              {/* Orders Section */}

              <SpaceBetween
                direction="horizontal"
                size="xs"
                alignItems="center"
              >
                <img src={PackIcon} alt="" width={20} height={20} />
                <Box color="text-status-success" variant="h5">
                  {`${selectedRunsheet?.orders?.length || 0} ${
                    selectedRunsheet?.orders?.length === 1 ? "Order" : "Orders"
                  }`}
                </Box>
              </SpaceBetween>

              <ColumnLayout minColumnWidth={20} columns={3} variant="default">
                <div>
                  <strong>Delivered Orders</strong>
                </div>
                <div>
                  {selectedRunsheet?.orders?.filter(
                    (order) => order?.status === "delivered"
                  ).length || 0}
                </div>
                <div>
                  ₹
                  {selectedRunsheet?.orders
                    ?.filter((order) => order?.status === "delivered")
                    ?.reduce(
                      (total, order) =>
                        total + parseFloat(order?.totalPrice || 0),
                      0
                    ) || 0}
                </div>

                <div>
                  <strong>Undelivered Orders</strong>
                </div>
                <div>
                  {selectedRunsheet?.orders?.filter(
                    (order) => order?.status === "undelivered"
                  ).length || 0}
                </div>
                <div>
                  ₹
                  {selectedRunsheet?.orders
                    ?.filter((order) => order?.status === "undelivered")
                    ?.reduce(
                      (total, order) =>
                        total + parseFloat(order?.totalPrice || 0),
                      0
                    ) || 0}
                </div>
              </ColumnLayout>

              {/* Amount Collection Section */}
              <Box color="text-status-info">
                <strong>Amount Collection</strong>
              </Box>
              <ColumnLayout minColumnWidth={20} columns={3} variant="default">
                <div>
                  <strong>QR Payment</strong>
                </div>
                <div>
                  ₹
                  {selectedRunsheet?.orders
                    ?.filter(
                      (order) => order?.paymentDetails?.method === "online"
                    )
                    ?.reduce(
                      (total, order) =>
                        total + parseFloat(order?.totalPrice || 0),
                      0
                    ) || 0}
                </div>
                <div></div>

                <div>
                  <strong>Cash on hand</strong>
                </div>
                <div>
                  ₹
                  {selectedRunsheet?.orders
                    ?.filter(
                      (order) => order?.paymentDetails?.method === "cash"
                    )
                    ?.reduce(
                      (total, order) =>
                        total + parseFloat(order?.totalPrice || 0),
                      0
                    ) || 0}
                </div>
                <div></div>
              </ColumnLayout>

              {/* Total Amount Section */}
              <ColumnLayout minColumnWidth={20} columns={3} variant="default">
                <div>
                  <strong>Total Amount</strong>
                </div>
                <Input
                  placeholder={`₹ ${totalAmount || 0}`}
                  value={amount}
                  onChange={(e) => setAmount(e.detail.value)}
                />
                <div></div>
              </ColumnLayout>
            </SpaceBetween>
          </Modal>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
};

export default ViewDetailsPage;

