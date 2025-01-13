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
  const handleSearchChange = ({ detail }) => {
    setFilteringText(detail.filteringText);
    setCurrentPage(1); // Reset page to 1 when filters change
  };
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  // Prepare items for the table
  const handleCategoryChange = ({ detail }) => {
    setSelectedCategory(detail.selectedOption);
    setCurrentPage(1); // Reset page to 1 when filters change
  };
  const handleSubCategoryChange = ({ detail }) => {
    setSelectedSubCategory(detail.selectedOption);
    setCurrentPage(1); // Reset page to 1 when filters change
  };

  const [filteringText, setFilteringText] = React.useState("");


  const [fetchedPages, setFetchedPages] = useState({}); // Store fetched data per page
  const [pagesCount, setPagesCount] = useState(1); // Keep track of total pages
  const [currentPage, setCurrentPage] = useState(1);
  console.log("Current Page:", currentPage);
  const [nextKeys, setNextKeys] = useState({}); // Store nextKey per page
  useEffect(() => {
    // Define the pageKey for pagination (undefined for page 1)
    const pageKey = currentPage === 1 ? undefined : nextKeys[currentPage - 1];

    // Create a key to represent the current filters and page
    const filterKey = `${selectedCategory?.value || ""}-${
      selectedSubCategory?.value || ""
    }-${filteringText || ""}-${currentPage}`;

    // Check if the current page with the current filter has already been fetched
    if (!fetchedPages[filterKey]) {
      dispatch(
        fetchProducts({
          category: selectedCategory?.value || "",
          subCategory: selectedSubCategory?.value || "",
          search: filteringText || "",
          // active: selectedStatus?.value || "",
          pageKey, // Only pass the nextKey for pages beyond 1
          pageSize: 50, // Items per page
        })
      )
        .unwrap()
        .then((result) => {
          console.log("Fetched products for page:", currentPage, result);

          // Adjust to check the correct data structure
          if (Array.isArray(result.data)) {
            // Store fetched items for the current page and filters
            setFetchedPages((prev) => ({
              ...prev,
              [filterKey]: result.data, // Directly using result.data since it's an array
            }));

            // Store the nextKey for future pagination
            if (result.nextKey) {
              setNextKeys((prevKeys) => ({
                ...prevKeys,
                [currentPage]: result.nextKey, // Store nextKey for the current page
              }));

              // Increment the pages count only if there's more data to fetch
              setPagesCount((prevCount) => prevCount + 1);
            }
          } else {
            console.error("Unexpected data structure:", result.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  }, [
    dispatch,
    currentPage,
    filteringText,
    selectedCategory,
    selectedSubCategory,
    // selectedStatus,
    nextKeys,
    fetchedPages,
  ]);

  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState([]);

  const [selectedOption, setSelectedOption] = useState({
    label: "All",
    value: "all",
  });

  const [modalItems] = useState([]);
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
      {
        type: ValidationEngine.type.CHARACTERCOUNT,
        message: "Cannot exceed 200 character",
      },
    ],
  };

  const validateForm = () => {
    const validationResult = ValidationEngine.validate(
      validationRules,
      formState
    );

    // Additional validation for items
    const itemErrors = items.reduce((errors, item, index) => {
      // const missingFields = [];

      // if (!item.adjustQuantity) {
      //   missingFields.push("Adjustment Quantity");
      // }
      // if (!item.adjustPurchasePrice) {
      //   missingFields.push("Adjust Purchase Price");
      // }
      // if (!item.adjustSellingPrice) {
      //   missingFields.push("Adjust Selling Price");
      // }

      // if (missingFields.length > 0) {
      //   errors[index] = `Please fill out: ${missingFields.join(", ")}`;
      // }

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
        itemErrors, // Ensure itemErrors are added to formErrors
      });
      ErrorMessages.error(
        "Please fix the errors in the item details before submitting."
      );
      return false;
    }

    setFormErrors(validationResult);
    return validationResult.isValid;
  };

  // console.log(formErrors.itemErrors.missingFields,"error");

  const handleSave = () => {
    if (validateForm()) {
      // Collecting form and table data
      const dataToSave = {
        formData: formState,
        itemsData: items.map((item) => ({
          id: item.id,
          code: item.itemCode,
          name: item.name,
          images: item.images[0],
          sellingprice: item.msp,
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

  const subcategoryOptions = {
    "Fresh Vegetables": [
      { label: "Daily Vegetables", value: "Daily Vegetables" },
      { label: "Leafy Vegetables", value: "Leafy Vegetables" },
      { label: "Exotic Vegetables", value: "Exotic Vegetables" },
    ],
    "Fresh Fruits": [
      { label: "Daily Fruits", value: "Daily Fruits" },
      { label: "Exotic Fruits", value: "Exotic Fruits" },
      { label: "Dry Fruits", value: "Dry Fruits" },
    ],
    Dairy: [
      { label: "Milk", value: "Milk" },
      { label: "Butter & Ghee", value: "Butter & Ghee" },
      { label: "Paneer & Khowa", value: "Paneer & Khowa" },
    ],
    Groceries: [
      { label: "Cooking Oil", value: "Cooking Oil" },
      { label: "Rice", value: "Rice" },
      { label: "Daal", value: "Daal" },
      { label: "Spices", value: "Spices" },
      { label: "Snacks", value: "Snacks" },
    ],
    "Bengali Special": [
      { label: "Bengali Vegetables", value: "Bengali Vegetables" },
      { label: "Bengali Groceries", value: "Bengali Groceries" },
      { label: "Bengali Home Needs", value: "Bengali Home Needs" },
    ],
    "Eggs Meat & Fish": [
      { label: "Eggs", value: "Eggs" },
      { label: "Fish", value: "Fish" },
      { label: "Chicken", value: "Chicken" },
      { label: "Mutton", value: "Mutton" },
    ],
  };

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
                errorText={formErrors.description?.message||(formState.description?.length>200 && 'Description Exceeding characters')}
                
                constraintText={
                  <>
                    Description must be 1 to 200 characters. Character
                    count: {formState.description?.length}/200
                  </>
                }
          

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
                {/* <Box margin={{ top: "xxs" }}>
                  {formState.description?.length} / 200 characters
                </Box> */}
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
                    cell: (item) => (
                      <Input
                        ariaRequired
                        value={item.adjustPurchasePrice || ""}
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
                    cell: (item) => (
                      <Input
                        value={item.adjustSellingPrice || ""}
                        onChange={({ detail }) =>
                          handleInputChange(
                            item.id,
                            "adjustSellingPrice",
                            detail.value
                          )
                        }
                        errorText={
                          item.adjustSellingPrice < 0
                            ? "Selling price cannot be negative"
                            : ""
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
          pagination={
            <Pagination
              currentPageIndex={currentPage}
              onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
              pagesCount={pagesCount}
            />
          }
          header={
            <Header>
              <SpaceBetween direction="horizontal" size="xs">
                <div style={{ width: "400px" }}>
                  <TextFilter
                    filteringText={filteringText}
                    filteringPlaceholder="Search"
                    filteringAriaLabel="Filter instances"
                    onChange={handleSearchChange}
                  />
                </div>
                <Select
                  required
                  selectedOption={selectedCategory}
                  onChange={handleCategoryChange}
                  options={[
                    { label: "All", value: "" },
                    {
                      label: "Fresh Vegetables",
                      value: "Fresh Vegetables",
                    },
                    {
                      label: "Fresh Fruits",
                      value: "Fresh Fruits",
                    },
                    {
                      label: "Dairy",
                      value: "Dairy",
                    },
                    {
                      label: "Groceries",
                      value: "Groceries",
                    },
                    { label: "Bengali Special", value: "Bengali Special" },
                    { label: "Eggs Meat & Fish", value: "Eggs Meat & Fish" },
                  ]}
                  placeholder="Select Category"
                />
                <Select
                  disabled={!selectedCategory || selectedCategory.value === ""} // Disable if no category or "All" is selected
                  required
                  selectedOption={selectedSubCategory}
                  onChange={handleSubCategoryChange}
                  placeholder="Select Sub Category"
                  options={
                    selectedCategory
                      ? subcategoryOptions[selectedCategory.value] || []
                      : []
                  }
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
              cell: (item) => item.purchasingPrice,
            },
            { header: "MSP", cell: (item) => item.msp },
          ]}
          // items={data.items}
          items={
            fetchedPages[
              `${selectedCategory?.value || ""}-${
                selectedSubCategory?.value || ""
              }-${filteringText || ""}-${currentPage}`
            ] || []
          }
          selectionType="multi"
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) =>
            setSelectedItems(detail.selectedItems)
          }
          trackBy="itemCode"
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No Products</b>
              </SpaceBetween>
            </Box>
          }
        />
      </Modal>
    </>
  );
};

export default CreateNewAdjustments;

