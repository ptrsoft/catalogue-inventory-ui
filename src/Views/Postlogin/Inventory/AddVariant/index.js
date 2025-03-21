import React, { useState, useEffect, useCallback } from "react";
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
  Modal,
  Flashbar,
  Icon
} from "@cloudscape-design/components";
import { Table, Toggle } from "@cloudscape-design/components";
import { uploadImage } from "Redux-Store/uploadImage/uploadThunk";
import { addProduct } from "Redux-Store/Products/ProductThunk";
import { FileUpload } from "@cloudscape-design/components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const AddEditVariant = () => {
  const dispatch = useDispatch();
 const navigate=useNavigate()

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  const [isShowIntable, setShowIntable] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [imageUrl1, setImageUrl1] = React.useState("");
  const [imageUrl2, setImageUrl2] = React.useState("");
  const [imageUrl3, setImageUrl3] = React.useState("");
  
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


  const [items, setItems] = React.useState([]);
  const [imageError, setImageError] = React.useState(false);

  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);

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

  // const handleImageUpload = async (file, setImageUrl) => {
  //   if (file) {
  //     try {
  //       const result = await dispatch(uploadImage(file)).unwrap();
  //       setImageUrl(result); // Update the state with the returned URL
  //     } catch (error) {
  //       console.error(`Failed to upload image:`, error);
  //     }
  //   }
  // };

  // Function for single product image upload
  const handleFileChange = (files) => {
    files.forEach((file, index) => {
      if (index === 0) handleImageUpload(file, setImageUrl1);
      else if (index === 1) handleImageUpload(file, setImageUrl2);
      else if (index === 2) handleImageUpload(file, setImageUrl3);
    });
  };

  const handleFileChange2 = (id, files) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              fileUploadValue: files, // Store uploaded files
            }
          : item
      )
    );

    // Upload each file and update the corresponding item's imageUrls array
    Promise.all(
      files.map(async (file) => {
        try {
          const result = await dispatch(uploadImage(file)).unwrap();
          return result;
        } catch (error) {
          console.error(`Failed to upload image:`, error);
          return null; // Handle errors gracefully
        }
      })
    ).then((uploadedUrls) => {
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? {
                ...item,
                imageUrls: uploadedUrls.filter((url) => url !== null), // Store all valid image URLs in an array
              }
            : item
        )
      );
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
  // console.log(tags, "tag");

  const removeTokenForTag = (index) => {
    setTags((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues.splice(index, 1);
      return updatedValues;
    });
  };

  const handleSave = () => {
    console.log("clicked");
    setIsFormSubmitted(true);
    if (!imageUrl1) {
      setImageError(true); // Set error if no image is uploaded
      return;
    }
    // if (!isFormValid()) {
    //   return; // Exit if the form is invalid
    // }

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
      units: "",
      variants: tableData,
    };
    console.log(formData, "formdata with variant");
    console.log("Form Data:", JSON.stringify(formData, null, 2));
    dispatch(addProduct(formData))
      .unwrap() // optional: unwraps the resolved or rejected action to handle it as a promise
      .then(() => {
        console.log("Item added successfully", formData);
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

        setTags([]);
        setSelectedCategory(null);
        setSelectedSubCategory(null);

        setDescription("");
         setValues([]);
        setExpiryDate("");
        setImageUrl1("");
        setImageUrl2("");
        setImageUrl3("");
        setTableData([]);

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
              id: "message_3",
            },
          ]);
        }
      });
  };

  // code for variant
  //add varient code
  const [attribute, setAttribute] = useState({
    label: "Weight",
    value: "Weight",
  });
  const [values, setValues] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      setValues([...values, inputValue.trim()]);
      console.log(values, "val");
      setInputValue("");
    }
  };

  const removeToken = (index) => {
    setValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues.splice(index, 1);
      return updatedValues;
    });
  };
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (values.length > 0) {
      setTableData(
        values.map((name, index) => ({
          id: index + 1,
          attribute: name,
          quantity: "",
          purchasingPrice: "",
          sellingPrice: "",
          comparePrice: "",
          buyerLimit: "",
          lowStockAlert: "",
          stockQuantity: 0,
          availability: false,
          unit: null, // Default value only
          minimumSellingWeight: "",  // Extra field
          maximumSellingWeight: "",  // Extra field
          MinimumSellingWeightUnit: "",  // Extra field
          MaximumSellingWeightUnit: "",  // Extra field
          totalQuantityInB2c: "",  // Extra field
          totalquantityB2cUnit: "",  // Extra field
        }))
      );
    }
  }, [values]);

  console.log(tableData, "tablee");

  const handleToggleChange = (id, checked) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, availability: checked } // Update the `status` field for the item with the given id
          : item
      )
    );
  };

  const handleInputChange = useCallback((id, field, value) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: isNaN(value) || value === "" ? value : Number(value), // Convert only if it's a valid number
            }
          : item
      )
    );
  }, []);
  

  const unitOptions = [
    { label: "Pcs", value: "pieces" },
    { label: "Grms", value: "grams" },
    { label: "Kgs", value: "kgs" },
    { label: "Ltrs", value: "litres" },
  ];

  const handledelete = () => {
    setAttribute(null);
    setValues([]);
  };
  // Open modal for editing
  const handleEdit = () => {
    setIsOpen(true);
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{marginLeft:'50px',marginRight:'50px'}}>
     
  
        
            <Flashbar items={items} />
      
      <SpaceBetween size="l">
      <Box float="right" >
              <Button onClick={handleSave} variant="primary">Save</Button>
              </Box>
        <Container  header={<Header>Category</Header>}>
          <hr style={{ marginLeft: "-15px", marginRight: "-15px" }}></hr>

          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <FormField
               label={
                <span>
                 Category{" "}
                  <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                </span>
              }
              errorText={isFormSubmitted && !selectedCategory && "Required"}
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
                  { label: "Bengali Special", value: "Bengali Special" },
                  {
                    label: "Eggs Meat & Fish",
                    value: "Eggs Meat & Fish",
                  },
                ]}
                placeholder="Select Category"
              />
            </FormField>
            <FormField
                label={
                  <span>
                   Sub Category{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                  </span>
                }
              errorText={isFormSubmitted && !selectedSubCategory && "Required"}
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
        <Container fitHeight header={<Header>Item Information</Header>}>
          <hr style={{ marginLeft: "-15px", marginRight: "-15px" }}></hr>
          <SpaceBetween size="m">

          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <FormField
  label={
    <span>
     Item Name{" "}
      <span style={{ color: "red", fontWeight: "bold" }}>*</span>
    </span>
  }              errorText={isFormSubmitted && !name && "Required"}
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
   label={
    <span>
     Description{" "}
      <span style={{ color: "red", fontWeight: "bold" }}>*</span>
    </span>
  }  errorText={isFormSubmitted && !description && "Required"}
  stretch // This ensures the FormField takes full width
>
  <div style={{ width: "100%"}}>
    <Textarea
      rows={5}
      onChange={handleChange}
      placeholder="Add Item Description"
      value={description}
      maxLength={500}
    />
  </div>
</FormField>
   <FormField
   label={
    <span>
     Add Item Image{" "}
      <span style={{ color: "red", fontWeight: "bold" }}>*</span>
    </span>
  }                 errorText={isFormSubmitted && !imageUrl1 && "Atleast Add one Image"}
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
        {values.length === 0 ? (
          <Container fitHeight header={<Header>Add Variant</Header>}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Button
                iconName="add-plus"
                variant="normal"
                onClick={() => setIsOpen(true)}
              />
              <p>Add variants like weight, size, color, etc.</p>
            </div>
          </Container>
        ) : (
          isShowIntable && (
          <Container header={<Header>Added Variants</Header>}>
            <Table
              variant="borderless"
              columnDefinitions={[
                {
                  id: "attributeName",
                  header: "Attribute Name",
                  cell: () => attribute.value,
                },
                {
                  id: "value",
                  header: "Value",
                  cell: () =>
                    values.map((value, index) => (
                      <span key={index}>
                        {value}
                        {index !== values.length - 1 && ", "}
                      </span>
                    )),
                },
                {
                  id: "action",
                  header: "Action",
                  cell: () => (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Button
                        onClick={handleEdit}
                        iconName="edit"
                        variant="icon"
                      />
                      <Button
                        onClick={handledelete}
                        iconName="remove"
                        variant="icon"
                      />
                    </div>
                  ),
                },
              ]}
              items={[{}]} // Single row, since attribute is a single object
            />
          </Container>
          )
        )}

        {/* Modal Component */}
        <Modal
          visible={isOpen}
          onDismiss={() => setIsOpen(false)}
          header="Add Variants"
          footer={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsOpen(false);
                  setShowIntable(true);
                }}
                
                disabled={values.length === 0}
              >
                Add Variant
              </Button>
            </SpaceBetween>
          }
        >
          <p>
            You'll be able to manage pricing and inventory for this product
            option later on.
          </p>
          <SpaceBetween size="s">
            <FormField label="Attribute">
              <Select
                onChange={({ detail }) => setAttribute(detail.selectedOption)}
                selectedOption={attribute} // ✅ Directly use attribute
                options={[
                  { label: "Weight", value: "Weight" },
                  { label: "Size", value: "Size" },
                ]}
              />
            </FormField>
            <div>
              <strong>Value</strong>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                  alignItems: "center",
                  border: "2px solid #ccc",
                  padding: "5px",
                  borderRadius: "8px",
                }}
              >
                {values.map((value, index) => (
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
                    {value}
                    <button
                      onClick={() => removeToken(index)}
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
                  placeholder="Enter value"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    flex: 1,
                    padding: "8px",
                    border: "none",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </SpaceBetween>
        </Modal>

        {/* Variants Table */}

        {tableData.length > 0 && isShowIntable && (
          <Container header={<Header>Manage Variant</Header>}>
            <hr style={{ marginLeft: "-15px", marginRight: "-15px" }}></hr>
            <p>
              Based on your item variant, these are the different versions of
              your variants that customers can buy.
            </p>
            <Table
  variant="borderless"
  columnDefinitions={[
    {
      id: "name",
      header: "Variant Name",
      cell: (item) => item.attribute,
    },
    {
      id: "quantity",
      header: (
        <span>
          Quantity In Stock{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>*</span>
        </span>
      ),
      cell: (item) => (
        <div style={{ width: "200px" }}>
          <Grid disableGutters gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
          <FormField
          errorText={
            isFormSubmitted && !item.quantity && "Required"
          }
        >
            <Input
              placeholder="Enter Quantity"
              type="text"
              value={item.quantity}
              onChange={({ detail }) =>
                handleInputChange(item.id, "quantity", detail.value) // Use item.id here
              }
            />
            </FormField>
            <Select
              key={`quantity-${item.id}`} // Ensures the select stays stable and is unique
              expandToViewport
              selectedOption={unitOptions.find((opt) => opt.value === item.quantityUnit)}
              onChange={(event) => {
                event.stopPropagation(); // Prevent parent handlers from closing the dropdown
                handleInputChange(
                  item.id,
                  "quantityUnit",
                  event.detail.selectedOption.value
                );
              }}
              options={unitOptions}
              placeholder="Select Unit"
            />
          </Grid>
        </div>
      ),
    },
    {
      id: "purchasePrice",
      header:   <span>
      Purchasing Price {" "}
        <span style={{ color: "red", fontWeight: "bold" }}>*</span>
      </span>,
      cell: (item) => (
        <FormField
          errorText={
            isFormSubmitted && !item.purchasingPrice && "Required"
          }
        >
          <Input
            required
            size="3xs"
            placeholder="Rs."
            value={item.purchasingPrice}
            onChange={
              ({ detail }) =>
                handleInputChange(
                  item.id,
                  "purchasingPrice",
                  detail.value
                ) // Use item.id here
            }
          />
        </FormField>
      ),
    },
    {
      id: "sellingPrice",
      header:    <span>
      Selling Price{" "}
       <span style={{ color: "red", fontWeight: "bold" }}>*</span>
     </span>,
      cell: (item) => (
        <FormField
          errorText={
            isFormSubmitted && !item.sellingPrice && "Required"
          }
        >
          <Input
            required
            size="3xs"
            placeholder="Rs."
            value={item.sellingPrice}
            onChange={
              ({ detail }) =>
                handleInputChange(
                  item.id,
                  "sellingPrice",
                  detail.value
                ) // Use item.id here
            }
          />
        </FormField>
      ),
    },
    {
      id: "comparePrice",
      header: "Compare Price",
      cell: (item) => (
        <FormField>
          <Input
          placeholder="Rs."

            type="number"
            value={item.comparePrice}
            onChange={
              ({ detail }) =>
                handleInputChange(
                  item.id,
                  "comparePrice",
                  detail.value
                ) // Use item.id here
            }
          />
        </FormField>
      ),
    },
    {
      id: "minimumSellingWeight",
      header: (
        <span>
          Minimum Selling Weight{" "}
          {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
        </span>
      ),
      cell: (item) => (
        <div style={{ width: "200px" }}>
          <Grid disableGutters gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
            <Input
              placeholder="Enter Minimum Selling Weight"
              type="text"
              value={item.minimumSellingWeight}
              onChange={({ detail }) =>
                handleInputChange(item.id, "minimumSellingWeight", detail.value) // Use item.id here
              }
            />
            <Select
              key={`min-selling-weight-${item.id}`} // Unique key for each unit select
              expandToViewport
              selectedOption={unitOptions.find(
                (opt) => opt.value === item.minimumSellingWeightUnit
              )}
              onChange={(event) => {
                event.stopPropagation(); // Prevent parent handlers from closing the dropdown
                handleInputChange(
                  item.id,
                  "minimumSellingWeightUnit",
                  event.detail.selectedOption.value
                );
              }}
              options={unitOptions}
              placeholder="Select Unit"
            />
          </Grid>
        </div>
      ),
    },
    {
      id: "maximumSellingWeight",
      header: (
        <span>
          Maximum Selling Weight{" "}
          {/* <span style={{ color: "red", fontWeight: "bold" }}>*</span> */}
        </span>
      ),
      cell: (item) => (
        <div style={{ width: "200px" }}>
          <Grid disableGutters gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
            <Input
              placeholder="Enter Maximum Selling Weight"
              type="text"
              value={item.maximumSellingWeight}
              onChange={({ detail }) =>
                handleInputChange(item.id, "maximumSellingWeight", detail.value) // Use item.id here
              }
            />
            <Select
              key={`max-selling-weight-${item.id}`} // Unique key for each unit select
              expandToViewport
              selectedOption={unitOptions.find(
                (opt) => opt.value === item.maximumSellingWeightUnit
              )}
              onChange={(event) => {
                event.stopPropagation(); // Prevent parent handlers from closing the dropdown
                handleInputChange(
                  item.id,
                  "maximumSellingWeightUnit",
                  event.detail.selectedOption.value
                );
              }}
              options={unitOptions}
              placeholder="Select Unit"
            />
          </Grid>
        </div>
      ),
    },
    {
      id: "totalQuantityInB2c",
      header: (
        <span>
          Total Quantity In B2c{" "}
          <span style={{ color: "red", fontWeight: "bold" }}>*</span>
        </span>
      ),
      cell: (item) => (
        <div style={{ width: "200px" }}>
          <Grid disableGutters gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
          <FormField
          errorText={
            isFormSubmitted && !item.totalQuantityInB2c && "Required"
          }
        >
            <Input
              placeholder="Enter Quantity"
              type="text"
              value={item.totalQuantityInB2c}
              onChange={({ detail }) =>
                handleInputChange(item.id, "totalQuantityInB2c", detail.value) // Use item.id here
              }
            />
            </FormField>
            <Select
              key={`total-quantity-b2c-${item.id}`} // Unique key for each unit select
              expandToViewport
              selectedOption={unitOptions.find(
                (opt) => opt.value === item.totalQuantityInB2cUnit
              )}
              onChange={(event) => {
                event.stopPropagation(); // Prevent parent handlers from closing the dropdown
                handleInputChange(
                  item.id,
                  "totalQuantityInB2cUnit",
                  event.detail.selectedOption.value
                );
              }}
              options={unitOptions}
              placeholder="Select Unit"
            />
          </Grid>
        </div>
      ),
    },
    {
      id: "saleLimit",
      header: "Sale Limit",
      cell: (item) => (
        <FormField>
          <Input
            placeholder="Enter Limit"
            type="number"
            value={item.saleLimit}
            onChange={({ detail }) =>
              handleInputChange(item.id, "saleLimit", detail.value) // Use item.id here
            }
          />
        </FormField>
      ),
    },
    
    {
      id: "buyerLimit",
      header: "Buyer Limit",
      cell: (item) => (
        <FormField>
          <Input
            placeholder="Enter Limit"
            type="number"
            value={item.buyerLimit}
            onChange={({ detail }) =>
              handleInputChange(item.id, "buyerLimit", detail.value) // Use item.id here
            }
          />
        </FormField>
      ),
    },
    {
      id: "lowStock",
      header: "Low Stock Alert",
      cell: (item) => (
        <FormField>
          <Input
            placeholder="Enter Stock Alert"
            type="number"
            value={item.lowStockAlert}
            onChange={({ detail }) =>
              handleInputChange(item.id, "lowStockAlert", detail.value) // Use item.id here
            }
          />
        </FormField>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (item) => (
        <Toggle
          checked={item.availability}
          onChange={({ detail }) =>
            handleToggleChange(item.id, detail.checked) // Use item.id here
          }
        />
      ),
    },
  ]}
  items={tableData}
  empty={<p>No variants added yet.</p>}
/>

          </Container>
        )}

     <Box float="right">
            <Button onClick={handleSave}>Save Item</Button>
            <Button variant="link" onClick={() => navigate("/app/inventory")}>
  Cancel
</Button>

          </Box>
      </SpaceBetween>
    </div>
  );
};

export default AddEditVariant;