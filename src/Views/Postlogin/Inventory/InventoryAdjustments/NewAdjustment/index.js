import {
    Box,
    BreadcrumbGroup,
    Button,
    Container,
    Form,
    FormField,
    Grid,
    Header,
    Icon,
    Input,
    Modal,
    Popover,
    SpaceBetween,
    Table,
    Textarea,
  } from "@cloudscape-design/components";
  import React from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  
  // importing create adjustment data using routes
  const NewAdjustment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { dataToSave } = location.state || {};
  
    React.useEffect(() => {
      if (dataToSave) {
        console.log("Received data: from create page", dataToSave);
        // You can use the data here as needed
      }
    }, [dataToSave]);
  
    const [visible, setVisible] = React.useState(false);
    const [confirmVisible, setConfirmVisible] = React.useState(false);
  
    const items = [
      // Your item data
    ];
  
    const handlePrint = () => {
      window.print();
    };
  
    const cancelNavigate = () => {
      navigate("/app/inventory/adjustments");
    };
  
    // Function to handle API request
    const sendAdjustmentData = async () => {
      if (!dataToSave) return;
  
      // Construct the request body
      const requestBody = {
        reason: dataToSave.formData.reason.label,
        description: dataToSave.formData.description,
        location: dataToSave.formData.location.label,
        items: dataToSave.itemsData.map((item) => ({
          id: item.id,
          itemCode: item.code,
          name: item.name,
          stock: parseInt(item.stockOnHold), // Assuming stock is in kg and needs to be a number
          currentCompareAtPrice: parseInt(item.sellingprice), // Parsing price
          currentOnlineStorePrice: parseInt(item.purchasingPrice), // Assuming current online store price is same as purchasing price
          adjustQuantity: parseInt(item.adjustQuantity), // Set this value based on your need
          newPurchasingPrice: parseInt(item.adjustPurchasePrice), // Example new price
          newOnlineStorePrice: parseInt(item.adjustSellingPrice), // Example new price
        })),
      };
      console.log("Request Body:", requestBody);
  
      try {
        const response = await fetch(
          "https://lou294nkli.execute-api.us-east-1.amazonaws.com/inventory/adjust",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
        if (response.ok) {
          const result = await response.json();
          console.log("API response:", result);
          // Handle success
          navigate("/app/inventory/adjustments");
        } else {
          const error = await response.text();
          console.error("API error:", error);
          // Handle error
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // Handle fetch error
      }
    };
  
    const handleSubmitClick = () => {
      setConfirmVisible(true); // Show the confirmation modal
    };
  
    const handleConfirmSubmit = () => {
      setConfirmVisible(false);
      sendAdjustmentData(); // Call the API after confirmation
    };
  
    return (
      <>
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },
            { text: "Inventory Adjustments", href: "#components" },
            { text: "New Adjustment", href: "#components" },
          ]}
          ariaLabel="Breadcrumbs"
        />
        <div style={{ marginTop: 10 }}>
          <Form
            header={
              <Header
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button onClick={() => setVisible(true)}>Cancel Adjustment</Button>
                    <Button onClick={handleSubmitClick} variant="primary">
                      Submit Adjustment
                    </Button>
                    <Button
                      onClick={() => navigate("/app/inventory/adjustments")}
                      variant="primary"
                    >
                      Back To Adjustments
                    </Button>
                  </SpaceBetween>
                }
                variant="h1"
              >
                New Adjustment
              </Header>
            }
          >
            <Container>
              <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }, { colspan: 12 }]}>
                <FormField label="Adjustment No.">
                  <Input value="SA-001" disabled />
                </FormField>
  
                <FormField label="Location">
                  <Input value={dataToSave?.formData.location.label} disabled />
                </FormField>
  
                <FormField label="Reason">
                  <Input value={dataToSave?.formData.reason.label} disabled />
                </FormField>
  
                <FormField label="Description">
                  <Textarea value={dataToSave?.formData.description} disabled />
                </FormField>
              </Grid>
            </Container>
  
            <div style={{ marginTop: 22 }}>
              <Container
                header={<Header variant="h2">Item Details</Header>}
              >
                <Table
                  variant="borderless"
                  columnDefinitions={[
                    { header: "Item Code", cell: (item) => "#" + item.code },
                    {
                      header: "Item name",
                      cell: (item) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={item.images}
                            alt={item.name}
                            style={{
                              width: "30px",
                              height: "30px",
                              marginRight: "10px",
                            }}
                          />
                          {item.name}
                        </div>
                      ),
                    },
                    {
                      header: "Stock on Hand",
                      cell: (item) => item.stockOnHold + " Kg",
                    },
                    {
                      header: (
                        <span
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                            justifyContent: "start",
                          }}
                        >
                          CP Price
                          <Popover
                            dismissButton={false}
                            position="top"
                            size="large"
                            triggerType="custom"
                            content={
                              <SpaceBetween>
                                <strong>Current Purchase Price</strong>
                                <span>
                                  The current purchase price is the latest cost
                                  used across all platforms for consistency.
                                </span>
                              </SpaceBetween>
                            }
                          >
                            <Icon name="status-info" />
                          </Popover>
                        </span>
                      ),
                      cell: (item) => "Rs. " + item.purchasingPrice,
                    },
                    {
                      header: (
                        <span
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                            justifyContent: "start",
                          }}
                        >
                          CS Price
                          <Popover
                            dismissButton={false}
                            position="top"
                            size="large"
                            triggerType="custom"
                            content={
                              <SpaceBetween>
                                <strong>Current Selling Price</strong>
                                <span>
                                  Current Selling Price: the latest price at which
                                  an item is sold.
                                </span>
                              </SpaceBetween>
                            }
                          >
                            <Icon name="status-info" />
                          </Popover>
                        </span>
                      ),
  
                      cell: (item) => item.sellingprice,
                    },
                    {
                      header: (
                        <span
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                            justifyContent: "start",
                          }}
                        >
                          Adjustment Quantity
                          <Popover
                            dismissButton={false}
                            position="top"
                            size="large"
                            triggerType="custom"
                            content={
                              <SpaceBetween>
                                <strong>Adjustment Quantity</strong>
                                <span>
                                  The quantity that will be adjusted for this
                                  item.
                                </span>
                              </SpaceBetween>
                            }
                          >
                            <Icon name="status-info" />
                          </Popover>
                        </span>
                      ),
                      cell: (item) => item.adjustQuantity,
                    },
                    {
                      header: (
                        <span
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                            justifyContent: "start",
                          }}
                        >
                          AP Price
                          <Popover
                            dismissButton={false}
                            position="top"
                            size="large"
                            triggerType="custom"
                            content={
                              <SpaceBetween>
                                <strong>Adjust Purchase Price</strong>
                                <span>
                                  Adjust Purchase Price: Adjust the cost for
                                  purchasing items.
                                </span>
                              </SpaceBetween>
                            }
                          >
                            <Icon name="status-info" />
                          </Popover>
                        </span>
                      ),
                      cell: (item) => item.adjustPurchasePrice || "Rs.",
                    },
                    {
                      header: (
                        <span
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                            justifyContent: "start",
                          }}
                        >
                          AS Price
                          <Popover
                            dismissButton={false}
                            position="top"
                            size="large"
                            triggerType="custom"
                            content={
                              <SpaceBetween>
                                <strong>Adjust Selling Price</strong>
                                <span>
                                  Adjust Selling Price: Adjust the price for
                                  selling items.
                                </span>
                              </SpaceBetween>
                            }
                          >
                            <Icon name="status-info" />
                          </Popover>
                        </span>
                      ),
                      cell: (item) => item.adjustSellingPrice || "Rs.",
                    },
                  ]}
                  items={dataToSave?.itemsData}
                  loadingText="Loading resources"
                  trackBy="name"
                  variant="container"
                />
              </Container>
            </div>
          </Form>
        </div>
  
        {/* Confirmation Modal */}
        <Modal
          onDismiss={() => setConfirmVisible(false)}
          visible={confirmVisible}
          closeAriaLabel="Close modal"
          header="Confirm Submission"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => setConfirmVisible(false)} variant="link">
                  Cancel
                </Button>
                <Button onClick={handleConfirmSubmit} variant="primary">
                  Confirm
                </Button>
              </SpaceBetween>
            </Box>
          }
        >
          Are you sure you want to submit this adjustment? Once submitted, it cannot be undone.
        </Modal>
  
        <Modal
          onDismiss={() => setVisible(false)}
          visible={visible}
          closeAriaLabel="Close modal"
          size="large"
          header="Cancel Adjustment"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => setVisible(false)} variant="link">
                  Cancel
                </Button>
                <Button onClick={cancelNavigate} variant="primary">
                  Confirm
                </Button>
              </SpaceBetween>
            </Box>
          }
        >
          Are you sure you want to cancel this adjustment? All unsaved changes will be lost.
        </Modal>
      </>
    );
  };
  
  export default NewAdjustment;
  