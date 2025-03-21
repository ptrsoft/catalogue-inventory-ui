import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { uploadImage } from "Redux-Store/uploadImage/uploadThunk";

import {
  fetchProductById,
  updateProductDetails,
} from "Redux-Store/Products/ProductThunk";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Grid from "@cloudscape-design/components/grid";
import {
  
  Icon,
  
  SpaceBetween,
  FormField,
  Popover,
  StatusIndicator,
  Input,

  Header,
  Container,
  Select,
  Button,
  Textarea,
  Box,
} from "@cloudscape-design/components"; // Adjust the import path if needed
import Flashbar from "@cloudscape-design/components/flashbar";
import status from "Redux-Store/Constants";

const Edit = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate(); // Initialize useNavigate

  const dispatch = useDispatch();

  const productDetail = useSelector((state) => state.products.productDetail);
  const productDetailStatus = useSelector(
    (state) => state.products.productDetailStatus
  );
  const productDetailError = useSelector(
    (state) => state.products.productDetailError
  );

  // Local states for form input fields
  const [name, setName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState(null);
  const [imageUrl1, setImageUrl1] = React.useState("");
  const [imageUrl2, setImageUrl2] = React.useState("");
  const [imageUrl3, setImageUrl3] = React.useState("");

  const [purchasingPrice, setPurchasingPrice] = useState("");

  const [totalQuantityInB2C, setTotalQuantityInB2C] = useState("");
  const [buyerLimit, setBuyerLimit] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [category, setCategory] = useState("");
  const pPrice = parseFloat(purchasingPrice) || 0;
  const sPrice = parseFloat(sellingPrice) || 0;
  const cPrice = parseFloat(comparePrice) || 0;

  // Calculate Discount Percentage
  const discountPercentage =
    cPrice > 0 ? ((cPrice - sPrice) / cPrice) * 100 : 0;

  // Calculate Profit
  const profit = sPrice - pPrice;

  // Calculate Gross Margin Percentage
  const grossMargin = sPrice > 0 ? (profit / sPrice) * 100 : 0;
  const [stockQuantity, setStockQuantity] = useState("");

  const [subCategory, setSubCategory] = useState(""); // Add this line
  const [items, setItems] = React.useState([]);
  const [invalidFields, setInvalidFields] = useState({}); // State to track invalid fields
  const [tags, setTags] = useState([]);

  //variant code
  const [tableData, setTableData] = useState([]);
  const [values, setValues] = useState([]);

  // Add these new state declarations
  const [availability, setAvailability] = useState(null);
  const [MinimumSellingWeightUnit, setMinimumSellingWeightUnit] = useState("");
  const [MaximumSellingWeightUnit, setMaximumSellingWeightUnit] = useState("");
  const [stockQuantityAlert, setStockQuantityAlert] = useState("");
  const [isVariant, setIsVariant] = useState(false);
  const [parentProductId, setParentProductId] = useState("");
  const [search_name, setSearchName] = useState("");
  const [totalquantityB2cUnit, settotalquantityB2cUnit] = useState("");
  // Add or update state declarations
  const [maximumSellingWeight, setMaximumSellingWeight] = useState("");
  const [minimumSellingWeight, setMinimumSellingWeight] = useState("");
  const [images, setImages] = useState([]);

  const unitOptions = [
    { label: "Pcs", value: "pieces" },
    { label: "Grms", value: "grams" },
    { label: "Kgs", value: "kgs" },
    { label: "Ltrs", value: "litres" },
  ];
  const handleImageUpload = async (file, setImageUrl) => {
    if (file) {
      try {
        const result = await dispatch(uploadImage(file)).unwrap();
        setImageUrl(result);
      } catch (error) {
        console.error(`Failed to upload image:`, error);
      }
    }
  };
  //add Tag code
  const [inputTag, setInputTag] = useState("");
  const handleKeyPressForTag = (event) => {
    if (event.key === "Enter" && inputTag.trim() !== "") {
      setTags([...tags, inputTag.trim()]);
      setInputTag("");
    }
  };
  // console.log(tags, "tag");

  const removeTokenForTag = (index) => {
    setTags((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues.splice(index, 1);
      return updatedValues;
    });
  };
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetail) {
      console.log("Fetched Product Details:", productDetail);
    }
  }, [productDetail]);

  useEffect(() => {
    if (productDetail && productDetail.units) {
      setUnits(productDetail.units);
    }
  }, [productDetail]);

  useEffect(() => {
    if (productDetail) {
      setName(productDetail.name || "");
      setTags(Array.isArray(productDetail.tags) ? productDetail.tags : []);
      setCategory(productDetail.category || "");
      setUnits(productDetail.units || "");
      setStockQuantity(productDetail.stockQuantity || "");
      setPurchasingPrice(productDetail.purchasingPrice || "");
      setDescription(productDetail.description || "");
      setSubCategory(productDetail.subCategory || "");
      setExpiryDate(productDetail.expiry);
      setAvailability(productDetail.availability || "");
      setTotalQuantityInB2C(productDetail.totalQuantityInB2c || "");
      settotalquantityB2cUnit(productDetail.totalquantityB2cUnit || "");
      setMinimumSellingWeightUnit(productDetail.MinimumSellingWeightUnit || "");
      setMaximumSellingWeightUnit(productDetail.MaximumSellingWeightUnit || "");
      setStockQuantityAlert(productDetail.stockQuantityAlert || "");
      setIsVariant(productDetail.isVariant || false);
      setParentProductId(productDetail.parentProductId || "");
      setSearchName(productDetail.search_name || "");
      setBuyerLimit(productDetail.buyerLimit || "");
      setSellingPrice(productDetail.sellingPrice || "");
      setComparePrice(productDetail.comparePrice || "");
      setImageUrl1(productDetail.image || "");
      setMaximumSellingWeight(productDetail.maximumSellingWeight || "");
      setMinimumSellingWeight(productDetail.minimumSellingWeight || "");
      setDiscount(productDetail.discount || 0);
      setImages(productDetail.images || []);

      // setTotalQuantityB2CUnit(productDetail.TotalquantityB2cUnit || "");
    }
  }, [productDetail]);
  
  // console.log(images,"array of images");
  const handleSubmit = (event) => {
    event.preventDefault();

    // Check for empty fields and mark them as invalid
    // const validationFlags = {
    //   name: !name,
    //   category: !category,
    //   subCategory: !subCategory,
    //   units: !units,
    //   description: !description,
    //   totalQuantityInB2C:!totalQuantityInB2C

    // };

    // If any field is invalid, return early and set invalid fields
    // if (Object.values(validationFlags).some((isInvalid) => isInvalid)) {
    //   setInvalidFields(validationFlags);
    //   return;
    // }

    // setInvalidFields({});

    const productData = {
      id: id,
      name,
      tags,
      description,
      category,
      subCategory,
      units,
      expiry:
        expiryDate === "No Expiry"
          ? expiryDate
          : new Date(expiryDate).toISOString(),
      availability,
      
      TotalquantityB2cUnit:totalquantityB2cUnit,
      MinimumSellingWeightUnit,
      MaximumSellingWeightUnit,
      stockQuantityAlert,

      sellingPrice: Number(sellingPrice),
      comparePrice: Number(comparePrice),
      purchasingPrice: Number(purchasingPrice),
      buyerLimit: Number(buyerLimit),
      stockQuantity: Number(stockQuantity),
      image: imageUrl1,
      images: [imageUrl1, imageUrl2, imageUrl3], // Include all images
      totalQuantityInB2c: Number(totalQuantityInB2C),
      minimumSellingWeight: Number(minimumSellingWeight),
      maximumSellingWeight: Number(maximumSellingWeight),
      isVariant: isVariant,
    };
    console.log(productData, "product");
    dispatch(updateProductDetails({ id, productData }))
      .unwrap()
      .then((response) => {
        console.log("Payload (ID):", id);
        console.log("Product Data:", productData);
        console.log("Response:", response);

        setItems([
          {
            type: "success",
            content: "Item updated successfully!",
            header: "Updated Item",
            dismissible: true,
            id: "message_success",
            onDismiss: () => setItems([]),
          },
        ]);

        // setTimeout(() => {
        //   setItems([]);
        //   navigate("/app/inventory");

        //   window.location.reload(); // Force reload after navigation.
        // }, 2000);
      })
      .catch((error) => {
        console.log("Product Data:", productData);
        console.log("Product Data:", productData);

        console.error("Error during update:", error);
        setItems([
          {
            type: "error",
            content: `Failed to update item: ${
              error.message || "Unknown error"
            }`,
            dismissible: true,
            id: "message_error",
          },
        ]);
        setTimeout(() => {
          setItems([]);
          // navigate("/app/inventory");
        }, 5000);
      });
  };

  const handleReplaceImage = (setImageUrl) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const result = await dispatch(uploadImage(file)).unwrap();
          setImageUrl(result);
        } catch (error) {
          console.error(`Failed to replace image:`, error);
        }
      }
    };
    fileInput.click();
  };

  const handleRemoveImage = (setImageUrl) => {
    setImageUrl("");
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

  const categoryOptions = [
    { label: "All", value: "" },
    { label: "Fresh Vegetables", value: "Fresh Vegetables" },
    { label: "Fresh Fruits", value: "Fresh Fruits" },
    { label: "Dairy", value: "Dairy" },
    { label: "Groceries", value: "Groceries" },
    { label: "Bengali Special", value: "Bengali Special" },
    { label: "Eggs Meat & Fish", value: "Eggs Meat & Fish" },
  ];

  return (
    <SpaceBetween size="xs">
      <BreadcrumbGroup
        items={[
          { text: "Dashboard", href: "/app/dashboard" },
          { text: "Inventory", href: "/app/inventory" },
          { text: "Edit Item" },
        ]}
        ariaLabel="Breadcrumbs"
      />
      <Flashbar items={items} /> {/* Render the Flashbar here */}
      <Header
        actions={
          <Button variant="primary" onClick={handleSubmit}>
            Update
          </Button>
        }
      >
        Edit Item
      </Header>
      <SpaceBetween direction="vertical" size="l">
        <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
          <Container header={<Header>Category</Header>}>
            <hr style={{ marginLeft: "-15px", marginRight: "-15px" }}></hr>

            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <FormField
                                    errorText={!category && "Required"}

                label={
                  <span>
                    Category{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                  </span>
                }
              >
                <Select
                  selectedOption={
                    category ? { label: category, value: category } : null
                  }
                  onChange={({ detail }) => {
                    setCategory(detail.selectedOption.value);
                    setSubCategory(null);
                  }}
                  options={categoryOptions}
                  placeholder="Select a category"
                />
              </FormField>
              {/* Subcategory Dropdown */}
              <FormField
              errorText={!subCategory && "Required"}
                label={
                  <span>
                    Sub Category{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                  </span>
                }
              >
                <Select
                  selectedOption={
                    subCategory
                      ? { label: subCategory, value: subCategory }
                      : null
                  }
                  onChange={({ detail }) =>
                    setSubCategory(detail.selectedOption.value)
                  }
                  options={category ? subcategoryOptions[category] || [] : []}
                  placeholder="Select a subcategory"
                />
              </FormField>
            </Grid>
          </Container>
          <Container header={<Header>Status</Header>}>
            <FormField
                                  errorText={!status && "Required"}

              label={
                <span>
                  Status{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                </span>
              }
            >
              <Select
                name="statusofItem"
                selectedOption={
                  availability
                    ? { label: "In Stock", value: true }
                    : { label: "Out Of Stock", value: false }
                }
                onChange={({ detail }) =>
                  setAvailability(detail.selectedOption.value)
                }
                options={[
                  { label: "In Stock", value: true },
                  { label: "Out Of Stock", value: false },
                ]}
                placeholder="Select Status"
              />
            </FormField>
          </Container>
        </Grid>
        <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
          <Container fitHeight header={<Header>Item Information</Header>}>
            <hr style={{ marginLeft: "-15px", marginRight: "-15px" }}></hr>
            <SpaceBetween size="l">
              <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                <FormField
                                      errorText={!name && "Required"}

                  label={
                    <span>
                      Item Name{" "}
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        *
                      </span>
                    </span>
                  }
                >
                  <Input
                    invalid={invalidFields.name}
                    value={name}
                    onChange={({ detail }) => setName(detail.value)}
                  />
                </FormField>
                <FormField label="Expiry Date">
                  <Input
                    type="date"
                    value={expiryDate}
                    invalid={invalidFields.expiryDate}
                    onChange={({ detail }) => setExpiryDate(detail.value)}
                    required
                  />
                </FormField>
              </Grid>
              <div>
                <strong>Tags</strong>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                    alignItems: "center",
                    border: "2px solid #ccc",
                    padding: "5px",
                    borderRadius: "8px",
                    marginTop: "5px",
                  }}
                >
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "#f3f3f3",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        margin: "4px",
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => removeTokenForTag(index)}
                        style={{
                          marginLeft: "8px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#0073e6",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input
                    placeholder="Enter Tag"
                    value={inputTag}
                    onChange={(event) => setInputTag(event.target.value)}
                    onKeyPress={handleKeyPressForTag}
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "none",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              <FormField
                label={
                  <span>
                    Description{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                  </span>
                }
                stretch // This ensures the FormField takes full width
              >
                <div style={{ width: "100%" }}>
                  <Textarea
                    value={description}
                    invalid={invalidFields.description}
                    onChange={({ detail }) => setDescription(detail.value)}
                  />
                </div>
              </FormField>

              <FormField
                label={
                  <span>
                    Add Item Image{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                  </span>
                }
                stretch // This ensures the FormField takes full width
              >
                <div
                  style={{
                    border: "2px dashed #4A90E2",
                    padding: "16px",
                    borderRadius: "8px",
                    width: "100%",
                    textAlign: "left",
                    marginTop: "3px",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "12px", marginTop: "12px" }}
                  >
                    {[imageUrl1, imageUrl2, imageUrl3].map(
                      (image, index) =>
                        (index === 0 ||
                          (index === 1 && imageUrl1) ||
                          (index === 2 && imageUrl2)) && ( // Show conditionally
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              width: "80px",
                              height: "80px",
                            }}
                          >
                            {image ? (
                              <>
                                <img
                                  src={image}
                                  alt="Uploaded"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                  }}
                                />
                                <div
                                  style={{
                                    position: "absolute",
                                    inset: "0",
                                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "8px",
                                    opacity: "0",
                                    transition: "opacity 0.3s ease",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.opacity = "1")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.opacity = "0")
                                  }
                                >
                                  <button
                                    style={{
                                      background: "#fff",
                                      border: "none",
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                      marginBottom: "4px",
                                    }}
                                    onClick={() =>
                                      handleReplaceImage(
                                        index === 0
                                          ? setImageUrl1
                                          : index === 1
                                          ? setImageUrl2
                                          : setImageUrl3
                                      )
                                    }
                                  >
                                    Replace
                                  </button>
                                  <button
                                    style={{
                                      background: "red",
                                      color: "#fff",
                                      border: "none",
                                      padding: "4px 8px",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                    onClick={() =>
                                      handleRemoveImage(
                                        index === 0
                                          ? setImageUrl1
                                          : index === 1
                                          ? setImageUrl2
                                          : setImageUrl3
                                      )
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              </>
                            ) : (
                              <label
                                style={{
                                  width: "120px",
                                  height: "80px",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "1px dashed #aaa",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  color: "#4A90E2",
                                }}
                              >
                                <div>
                                  <Icon name="upload"></Icon>
                                </div>
                                <div
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "4px",
                                    textAlign: "center",
                                  }}
                                >
                                  Upload Image
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handleImageUpload(
                                      e.target.files[0],
                                      index === 0
                                        ? setImageUrl1
                                        : index === 1
                                        ? setImageUrl2
                                        : setImageUrl3
                                    )
                                  }
                                />
                              </label>
                            )}
                          </div>
                        )
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#777",
                      marginTop: "8px",
                    }}
                  >
                    Upload a cover image for your item. File format:{" "}
                    <b>jpeg, png</b>. Recommended size: <b>300×200</b>.
                  </p>
                </div>
              </FormField>
            </SpaceBetween>
          </Container>
          <Box>
            <SpaceBetween size="l">
              <Container header={<Header>Inventory</Header>}>
                <SpaceBetween size="l">
                  <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                    <FormField
                      label={
                        <span>
                          Quantity In Stock{" "}
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                        </span>
                      }
                      errorText={!stockQuantity && "Required"}
                    >
                      <Input
                        required
                        size="xs"
                        placeholder="Add Quantity"
                        value={stockQuantity}
                        onChange={({ detail }) =>
                          setStockQuantity(detail.value)
                        }
                      />
                    </FormField>
                    <FormField label="Units">
                      <Select
                        selectedOption={
                          units ? { label: units, value: units } : null
                        }
                        onChange={({ detail }) =>
                          setUnits(detail.selectedOption.value)
                        }
                        options={unitOptions}
                        placeholder="Select Unit"
                      />
                    </FormField>
                  </Grid>
                  <FormField label="Set limit for Low Stock Alert">
                    <Input
                      type="number"
                      name="lowStockAlert"
                      value={stockQuantityAlert}
                      onChange={({ detail }) =>
                        setStockQuantityAlert(detail.value)
                      }
                    />
                  </FormField>
                </SpaceBetween>
              </Container>

              <Container header={<Header>Sale in B2C</Header>}>
                <hr style={{ marginLeft: "-15px", marginRight: "-15px" }}></hr>
                <SpaceBetween size="l">
                  <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
                    <FormField
                      label={
                        <span>
                          Total Items Quantity{" "}
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            *
                          </span>
                        </span>
                      }
                      errorText={!totalQuantityInB2C && "Required"}
                      info={
                        <Popover
                          dismissButton={false}
                          position="top"
                          size="small"
                          triggerType="hover" // Show on hover
                          content={
                            <span>
                              Enter the quantity in which you want to sell the
                              item for B2C customers (e.g., 1 kg, 200g, 500ml).
                            </span>
                          }
                        >
                          <StatusIndicator colorOverride="blue" type="info" />
                        </Popover>
                      }
                    >
                      <Input
                        type="number"
                        name="quantityInStock"
                        value={totalQuantityInB2C}
                        onChange={({ detail }) =>
                          setTotalQuantityInB2C(detail.value)
                        }
                      />
                    </FormField>
                    <FormField label="Unit">
                      <Select
                        selectedOption={
                          totalquantityB2cUnit
                            ? {
                                label: totalquantityB2cUnit,
                                value: totalquantityB2cUnit,
                              }
                            : null
                        }
                        onChange={({ detail }) =>
                          settotalquantityB2cUnit(detail.selectedOption.value)
                        }
                        options={unitOptions}
                        placeholder="Select Unit"
                      />
                    </FormField>
                  </Grid>
                  <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
                    <FormField
                      label="Minimum Weight"
                      info={
                        <Popover
                          dismissButton={false}
                          position="top"
                          size="small"
                          triggerType="hover" // Show on hover
                          content={
                            <span>
                              Set the minimum and maximum weight range for the
                              item (e.g., 500g - 750g). This is useful for items
                              sold in pieces with varying weights,{" "}
                            </span>
                          }
                        >
                          <StatusIndicator colorOverride="blue" type="info" />
                        </Popover>
                      }
                    >
                      <Input
                        type="number"
                        name="min weight"
                        value={minimumSellingWeight}
                        onChange={({ detail }) =>
                          setMinimumSellingWeight(detail.value)
                        }
                      />
                    </FormField>
                    <FormField label="Unit">
                      <Select
                        selectedOption={
                          MinimumSellingWeightUnit
                            ? {
                                label: MinimumSellingWeightUnit,
                                value: MinimumSellingWeightUnit,
                              }
                            : null
                        }
                        onChange={({ detail }) =>
                          setMinimumSellingWeightUnit(
                            detail.selectedOption.value
                          )
                        }
                        options={unitOptions}
                        placeholder="Select Unit"
                      />
                    </FormField>
                  </Grid>
                  <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
                    <FormField
                      label="Maximum Weight"
                      info={
                        <Popover
                          dismissButton={false}
                          position="top"
                          size="small"
                          triggerType="hover" // Show on hover
                          content={
                            <span>
                              Set the minimum and maximum weight range for the
                              item (e.g., 500g - 750g). This is useful for items
                              sold in pieces with varying weights,{" "}
                            </span>
                          }
                        >
                          <StatusIndicator colorOverride="blue" type="info" />
                        </Popover>
                      }
                    >
                      <Input
                        type="maximum"
                        name="maximum"
                        value={maximumSellingWeight}
                        onChange={({ detail }) =>
                          setMaximumSellingWeight(detail.value)
                        }
                      />
                    </FormField>
                    <FormField label="Unit">
                      <Select
                        selectedOption={
                          MaximumSellingWeightUnit
                            ? {
                                label: MaximumSellingWeightUnit,
                                value: MaximumSellingWeightUnit,
                              }
                            : null
                        }
                        onChange={({ detail }) =>
                          setMaximumSellingWeightUnit(
                            detail.selectedOption.value
                          )
                        }
                        options={unitOptions}
                        placeholder="Select Unit"
                      />
                    </FormField>
                  </Grid>
                  <FormField
                    label={
                      <span>
                        Set Limit On Buying{" "}
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          *
                        </span>
                      </span>
                    }
                    info={
                      <Popover
                        dismissButton={false}
                        position="top"
                        size="small"
                        triggerType="hover" // Show on hover
                        content={
                          <span>
                            Set the maximum quantity a customer can order (e.g.,
                            5 kg, 10 units). Customers cannot order beyond this
                            limit.
                          </span>
                        }
                      >
                        <StatusIndicator colorOverride="blue" type="info" />
                      </Popover>
                    }
                    errorText={!buyerLimit && "Required"}
                  >
                    <Input
                      type="number"
                      name="buyer limit"
                      value={buyerLimit}
                      onChange={({ detail }) => setBuyerLimit(detail.value)}
                    />
                  </FormField>
                </SpaceBetween>
              </Container>
            </SpaceBetween>
          </Box>
        </Grid>
        <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
          <Container header={<Header headingTagOverride="h3">Pricing</Header>}>
            <hr style={{ marginLeft: "-15px", marginRight: "-15px" }} />

            <FormField
              label={
                <span>
                  Purchasing Price{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                </span>
              }
              errorText={!purchasingPrice && "Required"}
            >
              <Input
                required
                size="3xs"
                placeholder="Rs."
                value={purchasingPrice}
                onChange={({ detail }) => setPurchasingPrice(detail.value)}
              />
            </FormField>

            <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
              <FormField
                label={
                  <span>
                    Selling Price{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                  </span>
                }
                errorText={!sellingPrice && "Required"}
              >
                <Input
                  required
                  size="3xs"
                  placeholder="Rs."
                  value={sellingPrice}
                  onChange={({ detail }) => setSellingPrice(detail.value)}
                />
              </FormField>
              <FormField label="Compare Price">
                <Input
                  type="number"
                  name="comparePrice"
                  value={comparePrice}
                  onChange={({ detail }) => setComparePrice(detail.value)}
                />
              </FormField>
            </Grid>

            <FormField label="Discount (%)">
              <Input
                type="number"
                name="discount"
                value={discountPercentage.toFixed(2)}
                readOnly
              />
            </FormField>

            <FormField label="Gross Margin (%)">
              <Input
                type="number"
                name="grossMargin"
                value={grossMargin.toFixed(2)}
                readOnly
              />
            </FormField>

            <FormField label="Profit">
              <Input
                type="number"
                name="profit"
                value={profit.toFixed(2)}
                readOnly
              />
            </FormField>
          </Container>
        </Grid>
      </SpaceBetween>
    </SpaceBetween>
  );
};

export default Edit;

