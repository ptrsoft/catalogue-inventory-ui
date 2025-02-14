import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  FormField,
  Input,
  Select,
  Textarea,
  Container,
  Header,
  SpaceBetween,
  Grid,
  BreadcrumbGroup,
  Flashbar,
  Icon
} from "@cloudscape-design/components";
import AddEditVariant from "../AddEditVariant";
import { uploadImage } from "Redux-Store/uploadImage/uploadThunk";
import { addProduct } from "Redux-Store/Products/ProductThunk";
import { FileUpload } from "@cloudscape-design/components";
import { useDispatch } from "react-redux";

const AddItemForm = ({ onToggle, isMultipleVariant }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  const [status, setStatus] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState(null);
  const [imageUrl1, setImageUrl1] = React.useState("");
  const [imageUrl2, setImageUrl2] = React.useState("");
  const [imageUrl3, setImageUrl3] = React.useState("");
  const [minimumWeight, setMinimumWeight] = useState("");
  const [maximumWeight, setMaximumWeight] = useState("");
  const [minimumWeightUnit, setMinimumWeightUnit] = useState("");
  const [maximumWeightUnit, setMaximumWeightUnit] = useState("");
  const [totalQuantityInB2C, setTotalQuantityInB2C] = useState("");
  const [totalQuantityInB2CUnit, setTotalQuantityInB2CUnit] = useState("");
  const [buyerLimit, setBuyerLimit] = useState("");
  const [lowStockAlert, setLowStockAlert] = useState("");
  const [purchasingPrice, setPurchasingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [discount, setDiscount] = useState(false);
  const [stockQuantity, setStockQuantity] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [imageError, setImageError] = React.useState(false);

  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);
 
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


  const handleSave = () => {
    setIsFormSubmitted(true);
    if (!imageUrl1) {
      setImageError(true); // Set error if no image is uploaded
      return;
    }
    if (!isFormValid()) {
      return; // Exit if the form is invalid
    }

    const formattedExpiryDate = expiryDate
      ? new Date(expiryDate).toISOString()
      : undefined;

    const formData = {
      name: name,
      expiry: formattedExpiryDate,
      category: selectedCategory ? selectedCategory.value : null,
      subCategory: selectedSubCategory ? selectedSubCategory.value : null, // Remove empty URLs
      tags: tags,

      description: description,
      images: [imageUrl1, imageUrl2, imageUrl3].filter(Boolean),
      units: units.value,
      minimumSellingWeight: Number(minimumWeight),
      maximumSellingWeight: Number(maximumWeight),
      MaximumSellingWeightUnit: minimumWeightUnit.value,
      MinimumSellingWeightUnit: minimumWeightUnit.value,
      totalQuantityInB2c: Number(totalQuantityInB2C),
      TotalquantityB2cUnit: totalQuantityInB2CUnit.value,
      stockQuantity: Number(stockQuantity),
      msp: 0,
      availability: status.value,
      buyerLimit: Number(buyerLimit),
      stockQuantityAlert: Number(lowStockAlert),
      purchasingPrice: Number(purchasingPrice),
      sellingPrice: Number(sellingPrice),
      comparePrice: Number(comparePrice),
      discount: discount,
    };
    console.log(formData, "formdata");
    console.log("Form Data:", JSON.stringify(formData, null, 2));
    dispatch(addProduct(formData))
      .unwrap() // optional: unwraps the resolved or rejected action to handle it as a promise
      .then(() => {
        console.log("Item added successfully");
        setItems([
          {
            type: "success",
            content: "Item Added Successfully",
            header: "Added Item",
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setItems([]),
            id: "message_1",
          },
        ]);
        setName("");
        setLowStockAlert("");
        setTotalQuantityInB2C("");
        setBuyerLimit("");
        setMaximumWeight("");
        setMinimumWeight("");
        setMaximumWeightUnit("");
        setMinimumWeightUnit("");
        setTags([]);
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setUnits(null);
        setPurchasingPrice("");

        setStockQuantity("");

        setDescription("");

        setExpiryDate("");
        setImageUrl1("");
        setImageUrl2("");
        setImageUrl3("");
        setPurchasingPrice("");
        setSellingPrice("");
        setComparePrice("");
        setDiscount(false);
        setStockQuantity("");
        setFileUploadValue([]); // Clear the file upload
        setIsFormSubmitted(false);
        setTimeout(() => {
          setItems([]); // Clear flash message
        }, 3000);
        // window.location.reload(); // This will force a full page reload
      })

      .catch((error) => {
        console.error("Failed to add item:", error);

        const errorMessage =
          error.message ||
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          "Unknown error";
        console.log("Extracted error message:", errorMessage);

        if (
          error.response?.status === 409 ||
          errorMessage.includes("Item with same name already exists")
        ) {
          setItems([
            {
              header: "Error",
              type: "error",
              content: "Item with the same name already exists.",
              dismissible: true,
              dismissLabel: "Dismiss message",
              onDismiss: () => setItems([]),
              id: "message_2",
            },
          ]);
        } else {
          setItems([
            {
              header: "Error",
              type: "error",
              content: errorMessage,
              dismissible: true,
              dismissLabel: "Dismiss message",
              onDismiss: () => setItems([]),
              id: "message_2",
            },
          ]);
        }
      });
  };

  const [errors, setErrors] = useState({});

  const isFormValid = () => {
    if (
      !name ||
      !selectedSubCategory ||
      !selectedCategory ||
      !description ||
      !units ||
      !purchasingPrice ||
      !sellingPrice ||
      !stockQuantity ||
      !imageUrl1 ||
      !totalQuantityInB2C 
      // !lowStockAlert
    ) {
      return false;
    }
    return true;
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

  const handleChange = ({ detail }) => {
    if (detail.value.length <= 247) {
      setDescription(detail.value);
    }
  };
  const [fileUploadValue, setFileUploadValue] = useState([]);

  const handleFileChange = (files) => {
    files.forEach((file, index) => {
      if (index === 0) handleImageUpload(file, setImageUrl1);
      else if (index === 1) handleImageUpload(file, setImageUrl2);
      else if (index === 2) handleImageUpload(file, setImageUrl3);
    });
  };

  //add Tag code
  const [inputTag, setInputTag] = useState("");
  const handleKeyPressForTag = (event) => {
    if (event.key === "Enter" && inputTag.trim() !== "") {
      setTags([...tags, inputTag.trim()]);
      setInputTag("");
    }
  };
  console.log(tags, "tag");

  const removeTokenForTag = (index) => {
    setTags((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues.splice(index, 1);
      return updatedValues;
    });
  };
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

  return (
    <>
      <Flashbar items={items} />

      <Box>
        <SpaceBetween size="m">
          {!isMultipleVariant && (
            <Box>
              <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                <Container header={<Header>Category</Header>}>
                  <hr
                    style={{ marginLeft: "-15px", marginRight: "-15px" }}
                  ></hr>

                  <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                    <FormField
                      label="Category"
                      errorText={
                        isFormSubmitted && !selectedCategory && "Required"
                      }
                    >
                      <Select
                        required
                        selectedOption={selectedCategory}
                        onChange={({ detail }) =>
                          setSelectedCategory(detail.selectedOption)
                        }
                        options={[
                          {
                            label: "Fresh Vegetables",
                            value: "Fresh Vegetables",
                          },
                          { label: "Fresh Fruits", value: "Fresh Fruits" },
                          { label: "Dairy", value: "Dairy" },
                          { label: "Groceries", value: "Groceries" },
                          {
                            label: "Bengali Special",
                            value: "Bengali Special",
                          },
                          {
                            label: "Eggs Meat & Fish",
                            value: "Eggs Meat & Fish",
                          },
                        ]}
                        placeholder="Select Category"
                      />
                    </FormField>
                    <FormField
                      label="Sub Category"
                      errorText={
                        isFormSubmitted && !selectedSubCategory && "Required"
                      }
                    >
                      <Select
                        placeholder="Sub Category"
                        selectedOption={selectedSubCategory}
                        onChange={({ detail }) =>
                          setSelectedSubCategory(detail.selectedOption)
                        }
                        options={
                          selectedCategory
                            ? subcategoryOptions[selectedCategory.value] || []
                            : []
                        }
                      />
                    </FormField>
                  </Grid>
                </Container>
                <Container header={<Header>Status</Header>}>
                  <FormField
                    label="Status *"
                    errorText={isFormSubmitted && !status && "Required"}
                  >
                    <Select
                      name="statusofItem"
                      selectedOption={status}
                      onChange={({ detail }) =>
                        setStatus(detail.selectedOption)
                      }
                      options={[
                        { label: "Active", value: true },
                        { label: "Inactive", value: false },
                      ]}
                      placeholder="Select Status"
                    />
                  </FormField>
                </Container>
              </Grid>

              <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                <Container fitHeight header={<Header>Item Information</Header>}>
                  <hr
                    style={{ marginLeft: "-15px", marginRight: "-15px" }}
                  ></hr>
        <SpaceBetween size="m">

                  <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                    <FormField
                      label="Item Name"
                      errorText={isFormSubmitted && !name && "Required"}
                    >
                      <Input
                        size="xs"
                        placeholder="Input Item Name"
                        value={name}
                        onChange={({ detail }) => setName(detail.value)}
                        style={{ width: "100%" }}
                      />
                    </FormField>
                    <FormField label="Expiry Date">
                      <Input
                        type="date"
                        onChange={({ detail }) => setExpiryDate(detail.value)}
                        value={expiryDate}
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
                    {tags?.map((tag, index) => (
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
                 label="Item Description"
                 errorText={isFormSubmitted && !description && "Required"}
                 stretch // This ensures the FormField takes full width
               >
                 <div style={{ width: "100%" }}>
                   <Textarea
                     rows={5}
                     onChange={handleChange}
                     placeholder="Add Item Description"
                     value={description}
                     maxLength={247}
                   />
                 </div>
               </FormField>
               <FormField
                 label="Add Item Image"
                 errorText={isFormSubmitted && !imageUrl1 && "Atleast Add one Image"}
                 stretch // This ensures the FormField takes full width
               >

<div style={{ border: "2px dashed #4A90E2", padding: "16px", borderRadius: "8px", width: "100%", textAlign: "left", marginTop: "3px" }}>
 
  <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
    {[imageUrl1, imageUrl2, imageUrl3].map((image, index) => (
      (index === 0 || (index === 1 && imageUrl1) || (index === 2 && imageUrl2)) && ( // Show conditionally
        <div key={index} style={{ position: "relative", width: "80px", height: "80px" }}>
          {image ? (
            <>
              <img src={image} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }} />
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
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
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
                  onClick={() => handleReplaceImage(index === 0 ? setImageUrl1 : index === 1 ? setImageUrl2 : setImageUrl3)}
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
                  onClick={() => handleRemoveImage(index === 0 ? setImageUrl1 : index === 1 ? setImageUrl2 : setImageUrl3)}
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
              <div><Icon name='upload'></Icon></div>
              <div style={{ fontSize: "12px", marginTop: "4px", textAlign: "center" }}>Upload Image</div>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageUpload(e.target.files[0], index === 0 ? setImageUrl1 : index === 1 ? setImageUrl2 : setImageUrl3)}
              />
            </label>
          )}
        </div>
      )
    ))}
  </div>
  <p style={{ fontSize: "12px", color: "#777", marginTop: "8px" }}>
    Upload a cover image for your item. File format: <b>jpeg, png</b>. Recommended size: <b>300×200</b>.
  </p>
</div>
</FormField>
</SpaceBetween>
                </Container>
                <Box>
                  <SpaceBetween size="m">
                    <Container header={<Header>Inventory</Header>}>
                      <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                        <FormField
                          label="Overall Quantity In Stock"
                          errorText={
                            isFormSubmitted && !stockQuantity && "Required"
                          }
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
                        <FormField
                          label="Units"
                          // errorText={isFormSubmitted && units && "Required"}
                        >
                          <Select
                            selectedOption={units}
                            onChange={({ detail }) =>
                              setUnits(detail.selectedOption)
                            }
                            options={[
                              { label: "Piece", value: "pieces" },
                              { label: "Grams", value: "grams" },
                              { label: "Kgs", value: "kgs" },
                              { label: "Litres", value: "litres" },
                            ]}
                            placeholder="Select Unit"
                          />
                        </FormField>
                      </Grid>
                      <FormField label="Set limit for Low Stock Alert">
                        <Input
                          type="number"
                          name="lowStockAlert"
                          value={lowStockAlert}
                          onChange={({ detail }) =>
                            setLowStockAlert(detail.value)
                          }
                        />
                      </FormField>
                    </Container>
                    <Container header={<Header>Sale in B2C</Header>}>
                      <hr
                        style={{ marginLeft: "-15px", marginRight: "-15px" }}
                      ></hr>

                      <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                        <FormField
                          label="Total Items Quantity *"
                          errorText={
                            isFormSubmitted && !totalQuantityInB2C && "Required"
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
                        <FormField
                          label="Units"

                          // errorText={
                          //   isFormSubmitted &&
                          //   totalQuantityInB2CUnit &&
                          //   "Required"
                          // }
                        >
                          <Select
                            selectedOption={totalQuantityInB2CUnit}
                            onChange={({ detail }) =>
                              setTotalQuantityInB2CUnit(detail.selectedOption)
                            }
                            options={[
                              { label: "Piece", value: "pieces" },
                              { label: "Grams", value: "grams" },
                              { label: "Kgs", value: "kgs" },
                              { label: "Litres", value: "litres" },
                            ]}
                            placeholder="Select Unit"
                          />
                        </FormField>
                      </Grid>
                      <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                        <FormField label="Minimum Weight">
                          <Input
                            type="number"
                            name="min weight"
                            value={minimumWeight}
                            onChange={({ detail }) =>
                              setMinimumWeight(detail.value)
                            }
                          />
                        </FormField>
                        <FormField name="minunit" label="Units">
                          <Select
                            selectedOption={minimumWeightUnit}
                            onChange={({ detail }) =>
                              setMinimumWeightUnit(detail.selectedOption)
                            }
                            options={[
                              { label: "Piece", value: "pieces" },
                              { label: "Grams", value: "grams" },
                              { label: "Kgs", value: "kgs" },
                              { label: "Litres", value: "litres" },
                            ]}
                          />
                        </FormField>
                      </Grid>
                      <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                        <FormField label="Maximum Weight ">
                          <Input
                            type="maximum"
                            name="maximum"
                            value={maximumWeight}
                            onChange={({ detail }) =>
                              setMaximumWeight(detail.value)
                            }
                          />
                        </FormField>
                        <FormField label="Units" name="minunit">
                          <Select
                            label="Units"
                            name="maxunit"
                            selectedOption={maximumWeightUnit}
                            onChange={({ detail }) =>
                              setMaximumWeightUnit(detail.selectedOption)
                            }
                            options={[
                              { label: "Piece", value: "pieces" },
                              { label: "Grams", value: "grams" },
                              { label: "Kgs", value: "kgs" },
                              { label: "Litres", value: "litres" },
                            ]}
                          />
                        </FormField>
                      </Grid>
                      <FormField
                        label="Set Limit For Buying Per Customer"
                        errorText={isFormSubmitted && !buyerLimit && "Required"}
                      >
                        <Input
                          type="number"
                          name="buyer limit"
                          value={buyerLimit}
                          onChange={({ detail }) => setBuyerLimit(detail.value)}
                        />
                      </FormField>
                    </Container>
                  </SpaceBetween>
                </Box>
              </Grid>

              <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                <Container
                  header={<Header headingTagOverride="h3">Pricing</Header>}
                >
                  <hr style={{ marginLeft: "-15px", marginRight: "-15px" }} />

                  <FormField
                    label="Purchasing Price"
                    errorText={
                      isFormSubmitted && !purchasingPrice && "Required"
                    }
                  >
                    <Input
                      required
                      size="3xs"
                      placeholder="Rs."
                      value={purchasingPrice}
                      onChange={({ detail }) =>
                        setPurchasingPrice(detail.value)
                      }
                    />
                  </FormField>

                  <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                    <FormField
                      label=" Selling Price"
                      errorText={isFormSubmitted && !sellingPrice && "Required"}
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

                  {/* <FormField>
                    <label>
                      <input
                        type="checkbox"
                        name="discount"
                        checked={discount}
                        onChange={({ detail }) => setDiscount(!discount)}
                      />
                      Show discount tag on B2C
                    </label>
                  </FormField> */}

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
            </Box>
          )}
          {isMultipleVariant && <AddEditVariant />}

          <SpaceBetween direction="horizontal" size="s">
            <Button onClick={handleSave}>Save Item</Button>
            <Button variant="link" onClick={onToggle}>
              Cancel
            </Button>
          </SpaceBetween>
        </SpaceBetween>
      </Box>
    </>
  );
};

const AddItem = () => {
  const [isMultipleVariant, setIsMultipleVariant] = useState(false);

  return (
    <>
      <SpaceBetween direction="vertical" size="m">
        <h2>Add Item</h2>
        <BreadcrumbGroup
          items={[
            { text: "Dashboard", href: "/app/dashboard" },

            { text: "Inventory", href: "/app/inventory" },
            { text: "Add Item", href: "/app/inventory/addItem" },
          ]}
          ariaLabel="Breadcrumbs"
        />
        {/* Radio buttons to toggle between forms */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <label>
            <input
              type="radio"
              name="itemType"
              value="single"
              onChange={() => setIsMultipleVariant(false)}
              defaultChecked
            />
            Add Single Item
          </label>
          <label>
            <input
              type="radio"
              name="itemType"
              value="multiple"
              onChange={() => setIsMultipleVariant(true)}
            />
            Add Multiple-Variant Item
          </label>
        </div>
      </SpaceBetween>

      {/* Conditionally render the appropriate form */}
      {isMultipleVariant ? (
        <AddEditVariant />
      ) : (
        <AddItemForm
          isMultipleVariant={isMultipleVariant}
          onToggle={setIsMultipleVariant}
        />
      )}
    </>
  );
};

export default AddItem;
