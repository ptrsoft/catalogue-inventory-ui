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
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessages, ValidationEngine } from "Utils/helperFunctions";
import { fetchProducts } from "Redux-Store/Products/ProductThunk";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from 'react-responsive';
import { fetchAdjustmentById, updateAdjustmentById } from "Redux-Store/InventoryAdjustments/InventoryAdjustmentsThunk";

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
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
    if (id) {
      setIsEditMode(true);
      setLoading(true);
      dispatch(fetchAdjustmentById(String(id)))
        .unwrap()
        .then((data) => {
          // Map API response to form state
          setState({
            location: { label: data.location, value: data.location },
            reason: { label: data.reason, value: data.reason },
            description: data.description,
          });
          setItems(
            (data.items || []).map((item) => ({
              ...item,
              itemCode: item.itemCode,
              name: item.name,
              images: item.images || [""],
              sellingPrice: item.currentCompareAtPrice,
              stockQuantity: item.stock,
              overallStock: item.overallStock,
              overallStockUnit: item.overallStockUnit,
              purchasingPrice: item.currentOnlineStorePrice,
              adjustQuantity: item.adjustQuantity,
              adjustPurchasePrice: item.newPurchasingPrice,
              adjustSellingPrice: item.newOnlineStorePrice,
            }))
          );
        })
        .finally(() => setLoading(false));
    }
  }, [id, dispatch]);

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

  const [formState, handleFormChange, setState] = useFormState({
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

  const handleSaveOrUpdate = () => {
    if (validateForm()) {
      const requestBody = {
        reason: formState.reason.label || formState.reason.value || formState.reason,
        description: formState.description,
        location: formState.location.label || formState.location.value || formState.location,
        items: items.map((item) => ({
          id: item.id,
          itemCode: item.itemCode,
          name: item.name,
          stock: Number(item.stockQuantity || item.overallStock),
          currentCompareAtPrice: Number(item.sellingPrice),
          currentOnlineStorePrice: Number(item.purchasingPrice),
          adjustQuantity: Number(item.adjustQuantity),
          newPurchasingPrice: Number(item.adjustPurchasePrice),
          newOnlineStorePrice: Number(item.adjustSellingPrice),
          overallStock: item.overallStock,
          overallStockUnit: item.overallStockUnit,
          totalQuantityInB2c: item.totalQuantityInB2c,
          totalquantityB2cUnit: item.totalquantityB2cUnit,
          amount: Number((item.adjustQuantity || 0) * Number(item.purchasingPrice || 0)),
          units: item.units,
          image: item.images[0],

        })),
      };
      if (isEditMode) {
        // Update
        dispatch(updateAdjustmentById({ id, data: requestBody }))
          .unwrap()
          .then(() => {
            ErrorMessages.success("Adjustment updated successfully");
            navigate("/app/inventory/adjustments");
          })
          .catch(() => ErrorMessages.error("Failed to update adjustment"));
      } else {
        // Add (existing logic)
        const dataToSave = {
          formData: formState,
          itemsData: items.map((item) => ({
            id: item.id,
            code: item.itemCode,
            name: item.name,
            images: item.images[0],
            sellingPrice: item.sellingPrice,
            stockOnHold: item.stockQuantity||item.overallStock,
            stockQuantity: item.stockQuantity,
            overallStock: item.overallStock,
            purchasingPrice: item.purchasingPrice,
            adjustQuantity: item.adjustQuantity,
            adjustPurchasePrice: item.adjustPurchasePrice,
            adjustSellingPrice: item.adjustSellingPrice,
            units: item.units,
            overallStockUnit: item.overallStockUnit,
            totalquantityB2cUnit: item.totalquantityB2cUnit,
            totalQuantityInB2c: item.totalQuantityInB2c,
          })),
        };
        navigate("/app/inventory/new-adjustment", { state: { dataToSave } });
      }
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
  const [isOpen, setIsOpen] = useState(false);
  const toggleFilter = () => {
    setIsOpen(!isOpen);
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
          // { text: "Dashboard", href: "/app/dashboard" },
          {
            text: "Inventory Adjustments",
            href: "/app/inventory/adjustments",
          },
          { text: "New Adjustment", href: "#components" },
        ]}
        ariaLabel="Breadcrumbs"
      />
      <div style={{ marginTop: 10 }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <Container
            header={
              <Header
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <button
                        className="cancel-btn"
                        style={{ borderRadius: "64px", padding:isMobile?"5px":"6px 8px" }}
                        onClick={handleBackNavigate}
                      >
                         {isMobile ? "" : "Cancel Adjustment"}
                         {isMobile ? 
                         <Icon name="close" size="small"></Icon> : ""}
                      </button>
                      <button
                      className="cancel-btn"
                      style={{ borderRadius: "16px",backgroundColor:'#0972D3',borderColor:'#0972D3',color:'white' }}
                      onClick={handleSaveOrUpdate} >
                      {isEditMode ? "Update" : "Save"}
                    </button>
                  </SpaceBetween>
                }
                variant={isMobile ? "h3" : "h1"}
              >
                {isEditMode ? "Edit Adjustment" : "New Adjustment"}
              </Header>
            }
          >
            <Grid
              gridDefinition={isMobile ? [
                { colspan: 12 },
                { colspan: 12}, 
                { colspan: 12},
                { colspan: 12 }
              ] : [
                { colspan: 4 },
                { colspan: 4 },
                { colspan: 4 },
                { colspan: 12 }
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
                          src={item.images[0]||item.image}
                          alt={item.name}
                          style={{
                            width: "30px",
                            height: "30px",
                            marginRight: "10px",
                          }}
                        />
                        {(
                          (item.stockQuantity === null || item.stockQuantity === 0) &&
                          item.overallStock > 0
                        ) ? (
                          item.name
                        ) : (
                          <>
                            {item.name}
                            {"-"}
                            {item.totalQuantityInB2c}
                            {item.totalquantityB2cUnit}
                          </>
                        )}
                      </div>
                    ),
                  },
                  {
                    id: "quantityOnHand",
                    header: "Quantity In Stock",
                    cell: (e) => {
                      // If stockQuantity is null or 0, use overallStock and overallStockUnit
                      const hasStock =
                        e.stockQuantity !== null &&
                        e.stockQuantity !== undefined &&
                        Number(e.stockQuantity) !== 0;
                      if (hasStock) {
                        return `${e.stockQuantity} ${e.units}`;
                      } else if (
                        e.overallStock !== null &&
                        e.overallStock !== undefined &&
                        e.overallStock !== "" &&
                        Number(e.overallStock) !== 0
                      ) {
                        return `${e.overallStock} ${e.overallStockUnit || ""}`;
                      } else {
                        return "-";
                      }
                    },
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

                    cell: (item) => item.sellingPrice,
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
                  // Hide "Wastage Amount" column when reason is "procure"
                  ...(formState?.reason === "Procure" || formState?.reason?.label === "Procure"
                    ? []
                    : [
                        {
                          header: " Amount",
                          cell: (item) => {
                            const qty = item.adjustQuantity || 0;
                            const price = item.purchasingPrice || 0;
                            const wastage = qty * price;
                            return `Rs. ${wastage.toFixed(2)}`;
                          },
                        },
                      ]
                  ),
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
        )}
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
    <div>          
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
      <SpaceBetween size="m">
    <Grid
          gridDefinition={[
            { colspan: { default: isMobile ? 10 : 8,} },
            { colspan: { default: isMobile ? 2 : 4} },
            { colspan: { default: isMobile ? 12 : 12} },
          ]}
        >
          {/* <div style={{width:"260px"}}> */}
          <TextFilter
            filteringText={filteringText}
            filteringPlaceholder="Search"
            filteringAriaLabel="Filter instances"
            onChange={handleSearchChange}
          />
          {/* </div> */}
          {/* Filter Toggle */}
          <span
            onClick={toggleFilter}
            style={{
              display: "flex",
              justifyContent: isMobile ? "center" : "space-between",
              alignItems: "center",
              cursor: "pointer",
              border: isMobile ? "2px solid #9BA7B6" : "3px solid #9BA7B6",
              padding: isMobile ? "4px" : "4px 8px",
              borderRadius: "8px",
              backgroundColor: "white",
              width: isMobile ? "32px" : "180px",
              gap: "10px",
            }}
          >
            {isMobile ? (
              <Icon variant="link" name="filter" />
            ) : (
              <>
                <div style={{ display: "flex", gap: "5px" }}>
                  <Icon variant="link" name="filter" />
                  <span
                    style={{
                      fontWeight: "normal", 
                      color: "#9BA7B6",
                      fontStyle: "italic",
                    }}
                  >
                    Filters
                  </span>
                </div>
                <Icon
                  variant="link"
                  name={isOpen ? "caret-up-filled" : "caret-down-filled"}
                />
              </>
            )}
          </span>
          
        </Grid>
        
        {/* Filter UI that appears when toggle is clicked */}
        {isOpen && (
          <div style={{ 
            // padding: "16px", 
            // backgroundColor: "white", 
            // borderRadius: "8px", 
            // border: "1px solid #e9ebed",
            marginBottom: "16px"
          }}>
            <Grid
              gridDefinition={[
                { colspan: { default: 12, xs: 12 } },
                { colspan: { default: 12, xs: 12 } },
              ]}
            >
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
           
            </Grid> 
               </div>
        )}
        </SpaceBetween>
        

            </Header>
          }
          variant="borderless"
          columnDefinitions={[
            {
              header: "Item Code",
              sortingField: "Item Code",
              cell: (item) => "#" + item.id,
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
                  {typeof item.totalQuantityInB2c !== "undefined" && (
                    <>
                      {" "}
                      - {item.totalQuantityInB2c}
                      {item.totalquantityB2cUnit ? ` ${item.totalquantityB2cUnit}` : ""}
                    </>
                  )}
                </div>
              ),
            },
            {
              id: "quantityOnHand",
              header: "Quantity In Stock",
              cell: (e) => {
                // If stockQuantity is null or 0, use overallStock and overallStockUnit
                const hasStock =
                  e.stockQuantity !== null &&
                  e.stockQuantity !== undefined &&
                  Number(e.stockQuantity) !== 0;
                if (hasStock) {
                  return `${e.stockQuantity} ${e.units}`;
                } else if (
                  e.overallStock !== null &&
                  e.overallStock !== undefined &&
                  e.overallStock !== "" &&
                  Number(e.overallStock) !== 0
                ) {
                  return `${e.overallStock} ${e.overallStockUnit || ""}`;
                } else {
                  return "-";
                }
              },
            },
            {
              header: "Purchasing Price",
              cell: (item) => item.purchasingPrice,
            },
            { header: "SP", cell: (item) => item.sellingPrice },
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
        </div>
      </Modal>
    </>
  );
};

export default CreateNewAdjustments;

