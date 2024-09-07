import React, { useEffect, useState } from "react";
import {
  Box,
  BreadcrumbGroup,
  Grid,
  Icon,
  TextFilter,
  Pagination,
  Popover,
  Select,
  Modal,
  Table,
  Textarea,
  Button,
  Container,
  Header,
  FormField,
  Input,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import { ErrorMessages, ValidationEngine } from "Utils/helperFunctions";

import { fetchProducts } from "Redux-Store/Products/ProductThunk";
import { useDispatch, useSelector } from "react-redux";

const useFormState = (initialState) => {
  const [state, setState] = useState(initialState);

  const handleChange = (field) => (event) => {
    const value = event.detail
      ? event.detail.value || event.detail.selectedOption
      : event.target.value;
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return [state, handleChange, setState];
};

const CreateNewAdjustments = () => {
  // modal table data from redux
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.products);
  console.log(products, "prod");
  console.log("pro", products);
  const { data = [] } = products;
  console.log("modal data", data.items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);

  const [selectedOption, setSelectedOption] = useState({
    label: "All",
    value: "all",
  });

  const [modalItems] = useState([

  ]);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate();
  const handleBackNavigate = () => {
    navigate("/app/inventory/adjustments");
  };

  const [formState, handleFormChange] = useFormState({
    location: "",
    reason: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const validationRules = {
    location: [
      {
        type: ValidationEngine.type.MANDATORY,
        message: "Location is required.",
      },
    ],
    
    reason: [
      { type: ValidationEngine.type.MANDATORY, message: "Reason is required." },
    
    ],
    description: [
      {
        type: ValidationEngine.type.MANDATORY,
        message: "Description is required.",
      },
      { type: ValidationEngine.type.CHARACTERCOUNT, message: "Cannot exceed 200 character" },
    ],
  };

  const validateForm = () => {
    const validationResult = ValidationEngine.validate(
      validationRules,
      formState
    );

    // Additional validation for items
    const itemErrors = items.reduce((errors, item, index) => {
      if (
        !item.adjustQuantity ||
        !item.adjustPurchasePrice ||
        !item.adjustSellingPrice
      ) {
        errors[index] = "Please fill out all fields for this item.";
      }
      return errors;
    }, {});

    if (items.length === 0) {
      setFormErrors({
        ...validationResult,
        items: "Please add at least one item.",
      });
      ErrorMessages.error("Please fix the errors before submitting.");
      return false;
    } else if (Object.keys(itemErrors).length > 0) {
      setFormErrors({
        ...validationResult,
        itemErrors,
      });
      ErrorMessages.error(
        "Please fix the errors in the item details before submitting."
      );
      return false;
    }

    setFormErrors(validationResult);
    return validationResult.isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Collecting form and table data
      const dataToSave = {
        formData: formState,
        itemsData: items.map((item) => ({
          id: item.id,
          code: item.itemCode,
          name: item.name,
          images:item.images[0],
          sellingprice:item.msp,
          stockOnHold: item.stockQuantity,
          purchasingPrice: item.purchasingPrice,
          adjustQuantity: item.adjustQuantity,
          adjustPurchasePrice: item.adjustPurchasePrice,
          adjustSellingPrice: item.adjustSellingPrice,
        })),
      };

      // Log data to check before navigation
      console.log("Data to save:", dataToSave);

      // Navigate with the data
      navigate("/app/inventory/new-adjustment", { state: { dataToSave } });
    } else {
      ErrorMessages.error("Please fix the errors before submitting.");
    }
  };

  const handleApplyItems = () => {
    const newItems = selectedItems
      .filter(
        (selectedItem) => !items.some((item) => item.id === selectedItem.id)
      )
      .map((item) => ({
        ...item,
        adjustQuantity: "", // Initialize with empty or default value
        adjustPurchasePrice: "", // Initialize if needed
        adjustSellingPrice: "", // Initialize if needed
      }));

    setItems((prevItems) => [...prevItems, ...newItems]);
    setVisible(false);
  };

  const handleInputChange = (id, field, value) => {
    console.log(`Updating item ${id}: ${field} = ${value}`); // Debug log
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const [filteringText, setFilteringText] = React.useState("");
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);

  // Filter modalItems based on the filteringText
  // Updated filtering logic to include category filter
  const filteredModalItems = modalItems.filter((item) => {
    const matchesText =
      item.name.toLowerCase().includes(filteringText.toLowerCase()) ||
      item.code.toLowerCase().includes(filteringText.toLowerCase());

    const matchesCategory =
      selectedOption.value === "all" ||
      selectedOption.value === undefined ||
      item.category === selectedOption.value;

    return matchesText && matchesCategory;
  });

  return (
    <>
      <BreadcrumbGroup
        items={[
          { text: "Dashboard", href: "/app/dashboard" },
          {
            text: "Inventory Adjustments",
            href: "/app/inventory/inventory-adjustments",
          },
          { text: "New Adjustment", href: "#components" },
        ]}
        ariaLabel="Breadcrumbs"
      />
      <div style={{ marginTop: 10 }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Container
            header={
              <Header
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button onClick={handleBackNavigate}>Cancel</Button>
                    <Button onClick={handleSave} variant="primary">
                      Save
                    </Button>
                  </SpaceBetween>
                }
                variant="h1"
              >
                New Adjustment
              </Header>
            }
          >
            <Grid
              gridDefinition={[
                { colspan: 4 },
                { colspan: 4 },
                { colspan: 4 },
                { colspan: 12 },
              ]}
            >
              <FormField label="Adjustment No.">
                <Input placeholder="SA-001" value="" disabled />
              </FormField>
              <FormField
                label="Location"
                errorText={formErrors.location?.message}
              >
                <Select
                  placeholder="Select Location"
                  selectedOption={formState.location}
                  onChange={handleFormChange("location")}
                  options={[
                    { label: "Cold Storage", value: "coldstorage" },
                    { label: "Atmakur", value: "atmakur" },
                    { label: "Waligunda", value: "waligunda" },
                    { label: "Atmakur-2", value: "Atmakur2" },
                  ]}
                />
              </FormField>
              <FormField label="Reason" errorText={formErrors.reason?.message}>
                <Select
                  placeholder="Select Reason"
                  selectedOption={formState.reason}
                  onChange={handleFormChange("reason")}
                  options={[
                    { label: "Procure", value: "procure" },
                    { label: "Correction", value: "correction" },
                    { label: "Damage", value: "damage" },
                  ]}
                />
              </FormField>
              <FormField
  label="Description"
  errorText={formErrors.description?.message}
>
  <Textarea
    placeholder="Enter description (max 200 characters)"
    value={formState.description}
    onChange={(event) => {
      // Always update formState, but enforce a validation if over 200 characters
      handleFormChange("description")(event);
    }}
    resizable={false}
  />
  <Box margin={{ top: "xxs" }}>
    {formState.description?.length} / 200 characters
  </Box>
</FormField>
            </Grid>
          </Container>
          <div style={{ marginTop: 22 }}>
            <Container
              header={
                <Header
                  actions={
                    <Button
                      onClick={() => setVisible(true)}
                      iconName="add-plus"
                    >
                      Add Items
                    </Button>
                  }
                  variant="h2"
                >
                  Item Details
                </Header>
              }
            >
              <Table
                variant="borderless"
                columnDefinitions={[
                  { header: "Item Code", cell: (item) => "#" + item.itemCode },
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
                          src={item.images[0]}
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
                    cell: (item) => item.stockQuantity + " Kg",
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
                    cell: (item) => item.purchasingPrice,
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

                    cell: (item) => item.msp,
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
                    cell: (item) => (
                      <Input
                        value={item.adjustQuantity || ""}
                        onChange={({ detail }) =>
                          handleInputChange(
                            item.id,
                            "adjustQuantity",
                            detail.value
                          )
                        }
                      />
                    ),
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
                            Adjust Purchase Price: Adjust the cost for purchasing items.
                            </span>
                          </SpaceBetween>
                          }
                        >
                          <Icon name="status-info" />
                        </Popover>
                      </span>
                    ),
                    cell: (item) => (
                      <Input
                        ariaRequired
                        value={item.adjustPurchasePrice ||""}
                        onChange={({ detail }) =>
                          handleInputChange(
                            item.id,
                            "adjustPurchasePrice",
                            detail.value
                          )
                        }
                      />
                    ),
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
                            Adjust Selling Price: Adjust the price for selling items.
                            </span>
                          </SpaceBetween>
                          }
                        >
                          <Icon name="status-info" />
                        </Popover>
                      </span>
                    ),
                    cell: (item) => (
                      
                      <Input
                        value={item.adjustSellingPrice ||""}
                        onChange={({ detail }) =>
                          handleInputChange(
                            item.id,
                            "adjustSellingPrice",
                            detail.value
                          )
                        }
                      />
                    ),
                  },

                  {
                    header: "Action",
                    cell: (item) => (
                      <Button
                        variant="icon"
                        iconName="remove"
                        onClick={() => handleDeleteItem(item.id)}
                        style={{ cursor: "pointer" }}
                        name="remove"
                      />
                    ),
                  },
                ]}
                items={items}
                loadingText="Loading Items"
                trackBy="id"
                empty={
                  <Box textAlign="center" color="inherit">
                    <b>No Item</b>
                    <Box padding={{ bottom: "s" }} variant="p" color="inherit">
                      No Item to display
                    </Box>
                    <Button
                      onClick={() => setVisible(true)}
                      iconName="add-plus"
                    >
                      Add Items
                    </Button>
                  </Box>
                }
              />
            </Container>
          </div>
        </form>
      </div>

      {/* Modal for Selecting Items */}
      <Modal
        onDismiss={() => setVisible(false)}
        visible={visible}
        closeAriaLabel="Close modal"
        size="large"
        header={<Header>Select Items</Header>}
        footer={
          <Header
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={() => setVisible(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleApplyItems}>
                  Apply
                </Button>
              </SpaceBetween>
            }
          ></Header>
        }
      >
        <Table
          header={
            <Header
              actions={
                <Pagination
                  currentPageIndex={currentPageIndex}
                  onChange={({ detail }) =>
                    setCurrentPageIndex(detail.currentPageIndex)
                  }
                  pagesCount={5}
                />
              }
            >
              <SpaceBetween direction="horizontal" size="xs">
                <div style={{ width: "400px" }}>
                  <TextFilter
                    filteringPlaceholder="Find items"
                    filteringText={filteringText}
                    onChange={(e) => setFilteringText(e.detail.filteringText)}
                    countText={`Results: ${filteredModalItems.length}`}
                  />
                </div>
                <Select
                  placeholder="Select Category"
                  selectedOption={selectedOption}
                  onChange={({ detail }) =>
                    setSelectedOption(detail.selectedOption)
                  }
                  options={[
                    { label: "All", value: "all" },
                    { label: "Fruits", value: "fruits" },
                    { label: "Vegetables", value: "vegetables" },
                    { label: "Leafy Vegetables", value: "leafyVegetables" },
                    { label: "Dairy", value: "dairy" },
                  ]}
                />
              </SpaceBetween>
            </Header>
          }
          variant="borderless"
          columnDefinitions={[
            {
              header: "Item Code",
              sortingField: "Item Code",
              cell: (item) => "#" + item.itemCode,
            },
            {
              header: "Item Name",
              sortingField: "Item Name",
              cell: (item) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={item.images[0]}
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
              sortingField: "stock on hand",
              cell: (item) => item.stockQuantity,
            },
            {
              header: "Purchasing Price",
              cell: (item) =>  item.purchasingPrice,
            },
            { header: "MSP", cell: (item) =>  item.msp },
          ]}
          items={data.items}
          selectionType="multi"
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) =>
            setSelectedItems(detail.selectedItems)
          }
          trackBy="id"
        />
      </Modal>
    </>
  );
};

export default CreateNewAdjustments;

