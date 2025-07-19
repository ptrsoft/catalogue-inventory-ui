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
  Icon,
  BreadcrumbGroup
} from "@cloudscape-design/components";
import { useMediaQuery } from 'react-responsive';

import { Table, Toggle } from "@cloudscape-design/components";
import { uploadImage } from "Redux-Store/uploadImage/uploadThunk";
import { addProduct } from "Redux-Store/Products/ProductThunk";
import { FileUpload } from "@cloudscape-design/components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import './styles.css'; // Import the CSS file


const AddEditVariant = () => {
  const dispatch = useDispatch();
 const navigate=useNavigate()
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [name, setName] = useState("");
  const [overallStock, setOverallStock] = useState("");
  const [overallStockUnit, setOverallStockUnit] = useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  const [isShowIntable, setShowIntable] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [imageUrl1, setImageUrl1] = React.useState("");
  const [imageUrl2, setImageUrl2] = React.useState("");
  const [imageUrl3, setImageUrl3] = React.useState("");
  
  const imagesArray= [imageUrl1, imageUrl2, imageUrl3].filter(Boolean)

  
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

  const handleUploadClick = (files) => {
    const fileArray = Array.from(files);

    const slots = [
      { url: imageUrl1, set: setImageUrl1 },
      { url: imageUrl2, set: setImageUrl2 },
      { url: imageUrl3, set: setImageUrl3 },
    ];

    let index = 0;

    for (let i = 0; i < slots.length && index < fileArray.length; i++) {
      if (!slots[i].url) {
        handleImageUpload(fileArray[index], slots[i].set);
        index++;
      }
    }

    if (index < fileArray.length) {
      console.warn("Only 3 images allowed. Extra files were not uploaded.");
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
    if (detail.value.length <= 100000) {
      setDescription(detail.value);
    }
  };
  const [fileUploadValue, setFileUploadValue] = useState([]);



  //add Tag code
  const [inputTag, setInputTag] = useState("");


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
      overallStock: overallStock,
      overallStockUnit: overallStockUnit ? overallStockUnit.value : null,
      expiry: formattedExpiryDate,
      category: selectedCategory ? selectedCategory.value : null,
      subCategory: selectedSubCategory ? selectedSubCategory.value : null,
      tags: tags,
      description: description,
      images: imagesArray,
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
        navigate("/app/inventory", { 
          state: { 
            itemAdded: true, 
            itemName: name 
          },
          // replace: true
        });

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
          purchasingPrice: "",
          sellingPrice: "",
          comparePrice: "",
          saleLimit: "",
          stockQuantity: "",
          unit: null,
          totalQuantityInB2c: "",
          totalquantityB2cUnit: null,
          lowStockAlert: "",
          availability: true,
          expiry: "",
          images: [],
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
              [field]: isNaN(value) || value === "" ? value : Number(value),
            }
          : item
      )
    );
  }, []);
  

  const unitOptions = [
    { label: "Pcs", value: "Pcs" },
    { label: "Pkt", value: "Pkt" },
    { label: "Gms", value: "Gms" },
    { label: "Kg", value: "Kg" },
    { label: "Ltr", value: "Ltr" },
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

  // Function to handle variant image upload
  const handleVariantImageUpload = async (id, files) => {
    try {
      const uploadedImages = await Promise.all(
        files.map((file) => dispatch(uploadImage(file)).unwrap())
      );
  
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === id
            ? { ...item, images: [...item.images, ...uploadedImages] }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to upload one or more variant images:", error);
    }
  };
  

  // Function to remove a specific image from a variant
  const handleRemoveVariantImage = (id, imageIndex) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              images: item.images.filter((_, index) => index !== imageIndex)
            }
          : item
      )
    );
  };

  return (
    <div className={isMobile ? "add-variant-container-mobile" : "add-variant-container"}>
       <BreadcrumbGroup
          items={[
            // { text: "Dashboard", href: "/app/dashboard" },

            { text: "Inventory", href: "/app/inventory" },
            { text: "Add Item", href: "/app/inventory/addItem" },
          ]}
          ariaLabel="Breadcrumbs"
        />
  
        
            <Flashbar items={items} />
      
      <SpaceBetween size="l">
      <Box   margin={{top:'m'}}>
        <Header variant="h2" actions={
                        <Button onClick={handleSave} variant="primary">Save</Button>


        }>Add Item</Header>
              </Box>
        <Container  header={<Header>Category</Header>}>
          <hr style={{ marginLeft: "-15px", marginRight: "-15px" }}></hr>

                <Grid gridDefinition={[{ colspan: { default: isMobile ? 12 : 6 } }, { colspan: { default: isMobile ? 12 : 6 } }]}>
            <FormField
               label={
                <span className="form-field-label">
                 Category{" "}
                  <span className="required-indicator">*</span>
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
                  <span className="form-field-label">
                   Sub Category{" "}
                    <span className="required-indicator">*</span>
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

          <Grid gridDefinition={[{ colspan: { default: isMobile ? 12 : 6 } }, { colspan: { default: isMobile ? 12 : 6 } }]}>
            <FormField
  label={
    <span className="form-field-label">
     Item Name{" "}
      <span className="required-indicator">*</span>
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
            <FormField
  label={
    <span className="form-field-label">
     Over All Stock{" "}
      <span className="required-indicator"></span>
    </span>
  }
              //  errorText={isFormSubmitted && !overallStock && "Required"}
            >
              <div style={{ width: "100%" }}>
                <Grid disableGutters={!isMobile} gridDefinition={[{ colspan: 7 }, { colspan: 5 }]}>
                  <Input
                    size="xs"
                    placeholder="Input Overall Stock"
                    value={overallStock}
                    onChange={({ detail }) => setOverallStock(detail.value)}
                  />
                  <Select
                    expandToViewport
                    selectedOption={overallStockUnit}
                    onChange={({ detail }) => setOverallStockUnit(detail.selectedOption)}
                    options={unitOptions}
                    placeholder="Select Unit"
                  />
                </Grid>
              </div>
            </FormField>
          
          </Grid>
          <div>
          <strong>Tags</strong>
          <div className="tag-container">
            {tags?.map((tag, index) => (
              <div
                key={index}
                className="tag-item"
              >
                {tag}
                <button
                  onClick={() => removeTokenForTag(index)}
                  className="tag-remove-button"
                >
                  ×
                </button>
              </div>
            ))}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (inputTag.trim() !== "") {
                  setTags([...tags, inputTag.trim()]);
                  setInputTag("");
                }
                return false;
              }}
              className="tag-form"
              style={{ flex: 1, display: "flex" }}
            >
              <input
                placeholder="Enter Tag"
                value={inputTag}
                onChange={(event) => setInputTag(event.target.value)}
                className="tag-input"
              />
            </form>
          </div>
          </div>

          <FormField
   label={
    <span className="form-field-label">
     Description{" "}
      <span className="required-indicator">*</span>
    </span>
  }  errorText={isFormSubmitted && !description && "Required"}
  stretch // This ensures the FormField takes full width
>
  <div style={{ width: "100%"}}>
    <Textarea
      rows={8}
      onChange={handleChange}
      placeholder="Add Item Description"
      value={description}
      maxLength={100000}
    />
  </div>
</FormField>
   <FormField
   label={
    <span className="form-field-label">
     Add Item Image{" "}
      <span className="required-indicator">*</span>
    </span>
  }                 errorText={isFormSubmitted && !imageUrl1 && "Atleast Add one Image"}
                 stretch // This ensures the FormField takes full width
               >
<div className="image-upload-container">
 
  <div className="image-preview-container">
    {imageUrl1&&imageUrl2&&imageUrl3? null:
    (
  <label
              className="image-upload-label"
            >
              <div><Icon  name='upload'></Icon></div>
              <div className="image-upload-label-text">Upload Image</div>
              <input
              
                type="file"
                accept="image/*"
                multiple
                className="image-upload-input"
                onChange={(e) => handleUploadClick(e.target.files)}
              />
            </label>
    )}
    </div>
    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    {imagesArray.map((image, index) => (
      (index === 0 || (index === 1 && imageUrl1) || (index === 2 && imageUrl2)) && ( // Show conditionally
        <div key={index} className="image-preview">
          {image &&(
            <>
              <img src={image} alt="Uploaded" />
              <div
                className="image-overlay"
              >
                <button
                  className="image-action-button"
                  onClick={() => handleReplaceImage(index === 0 ? setImageUrl1 : index === 1 ? setImageUrl2 : setImageUrl3)}
                >
                  Replace
                </button>
                <button
                  className="image-remove-button"
                  onClick={() => handleRemoveImage(index === 0 ? setImageUrl1 : index === 1 ? setImageUrl2 : setImageUrl3)}
                >
                  Remove
                </button>
              </div>
            </>
          ) }
          
          
           
          
        </div>
      )
    ))}
    {/* </div> */}
  </div>
  <p className="image-upload-hint">
    Upload Upto 3 images for your item. File format: <b>jpeg, png</b>. Recommended size: <b>300×200</b>.
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
            <p style={{marginBottom:"15px"}}>
              Based on your item variant, these are the different versions of
              your variants that customers can buy.
            </p>
            
            {isMobile ? (
              // Mobile view - Display variants in containers
              <SpaceBetween size="m">
                {tableData.map((item) => (
                  <Container key={item.id} variant="stacked">
                    <SpaceBetween size="m">
                      <Header variant="h3">Variant: {item.attribute}</Header>
                      
                      <FormField
                        label={
                          <span>
                            Quantity In Stock
                          </span>
                        }
                        errorText={
                          isFormSubmitted && !item.stockQuantity && "Required"
                        }
                      >
                        <div style={{ width: "100%" }}>
                          <Grid  gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                            <Input
                              placeholder="Enter Quantity"
                              type="text"
                              value={item.stockQuantity}
                              disabled={!!overallStock}
                              onChange={({ detail }) =>
                                handleInputChange(item.id, "stockQuantity", detail.value)
                              }
                            />
                            <Select
                              disabled={!!overallStock}
                              key={`quantity-${item.id}`}
                              expandToViewport
                              selectedOption={unitOptions.find((opt) => opt.value === item.unit)}
                              onChange={(event) => {
                                event.stopPropagation();
                                handleInputChange(
                                  item.id,
                                  "unit",
                                  event.detail.selectedOption.value
                                );
                              }}
                              options={unitOptions}
                              placeholder="Select Unit"
                            />
                          </Grid>
                        </div>
                      </FormField>
                      <Grid  gridDefinition={[{ colspan: 12 }, { colspan: 12 }]}>

                      
                      <FormField
                        label={
                          <span>
                            Purchasing Price{" "}
                            <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                          </span>
                        }
                        errorText={
                          isFormSubmitted && !item.purchasingPrice && "Required"
                        }
                      >
                        <Input
                          required
                          size="3xs"
                          placeholder="Rs."
                          value={item.purchasingPrice}
                          onChange={({ detail }) =>
                            handleInputChange(
                              item.id,
                              "purchasingPrice",
                              detail.value
                            )
                          }
                        />
                      </FormField>
                      
                      <FormField
                        label={
                          <span>
                            Selling Price{" "}
                            <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                          </span>
                        }
                        errorText={
                          isFormSubmitted && !item.sellingPrice && "Required"
                        }
                      >
                        <Input
                          required
                          size="3xs"
                          placeholder="Rs."
                          value={item.sellingPrice}
                          onChange={({ detail }) =>
                            handleInputChange(
                              item.id,
                              "sellingPrice",
                              detail.value
                            )
                          }
                        />
                      </FormField>
                      </Grid>
                      <Grid  gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                      <FormField label="Compare Price">
                        <Input
                          placeholder="Rs."
                          type="number"
                          value={item.comparePrice}
                          onChange={({ detail }) =>
                            handleInputChange(
                              item.id,
                              "comparePrice",
                              detail.value
                            )
                          }
                        />
                      </FormField>
                      <FormField label="Sale Limit">
                        <Input
                          placeholder="Enter Limit"
                          type="number"
                          value={item.saleLimit}
                          onChange={({ detail }) =>
                            handleInputChange(item.id, "saleLimit", detail.value)
                          }
                        />
                      </FormField>
                      </Grid>
                  
                      
                      <FormField
                        label={
                          <span>
                            Total Quantity In B2c{" "}
                            <span style={{ color: "red", fontWeight: "bold" }}>*</span>
                          </span>
                        }
                        errorText={
                          isFormSubmitted && !item.totalQuantityInB2c && "Required"
                        }
                      >
                        <div style={{ width: "100%" }}>
                          <Grid  gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                            <Input
                              placeholder="Enter Quantity"
                              type="text"
                              value={item.totalQuantityInB2c}
                              onChange={({ detail }) =>
                                handleInputChange(item.id, "totalQuantityInB2c", detail.value)
                              }
                            />
                            <Select
                              key={`total-quantity-b2c-${item.id}`}
                              expandToViewport
                              selectedOption={unitOptions.find(
                                (opt) => opt.value === item.totalquantityB2cUnit
                              )}
                              onChange={(event) => {
                                event.stopPropagation();
                                handleInputChange(
                                  item.id,
                                  "totalquantityB2cUnit",
                                  event.detail.selectedOption.value
                                );
                              }}
                              options={unitOptions}
                              placeholder="Select Unit"
                            />
                          </Grid>
                        </div>
                      </FormField>
                      
                    
                      <Grid  gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                      <FormField label="Low Stock Alert">
                        <Input
                          placeholder="Enter Stock Alert"
                          type="number"
                          value={item.lowStockAlert}
                          onChange={({ detail }) =>
                            handleInputChange(item.id, "lowStockAlert", detail.value)
                          }
                        />
                      </FormField>

                      <div style={{ display: "flex", alignItems: "center", marginLeft:"18px" }}>

                      <FormField label="Status">
                        <Toggle
                          checked={item.availability}
                          onChange={({ detail }) =>
                            handleToggleChange(item.id, detail.checked)
                          }
                        />
                      </FormField>
                      </div>

                      </Grid>
                      <Grid  gridDefinition={[{ colspan: 12 }, { colspan: 12 }]}>
                      <FormField label="Expiry Date">

                        <Input
                          type="date"
                          onChange={({ detail }) => 
                            handleInputChange(item.id, "expiry", detail.value)
                          }
                          value={item.expiry}
                        />
                      </FormField>
                      {/* upload image button with icon */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FormField label="Upload Image">
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                         
                          
                          {item.images.length < 5 && (
                         <Button 
                         variant="icon" 
                         size="small" 
                         iconName="upload"
                         onClick={() => {
                           const fileInput = document.createElement("input");
                           fileInput.type = "file";
                           fileInput.accept = "image/*";
                           fileInput.multiple = true; // enable multiple image selection
                           fileInput.onchange = (event) => {
                             const files = Array.from(event.target.files);
                             if (files.length > 0) {
                               handleVariantImageUpload(item.id, files); // Pass all selected files
                             }
                           };
                           fileInput.click();
                         }}
                       />
                          )}
                          
                          {item.images.length === 0 && (
                            <p className="image-upload-hint">
                              Upload Upto 5 images
                            </p>
                          )}
                        </div>
                      </FormField>
                      </div>
                      </Grid>
                      <div className="image-preview-container">
                            {item.images.map((image, index) => (
                              <div key={index} className="image-preview">
                                <img 
                                  src={image} 
                                  alt={`Variant ${item.attribute} img ${index + 1}`} 
                                />
                                <div className="image-overlay">
                                  <button
                                    className="image-action-button"
                                    onClick={() => {
                                      const fileInput = document.createElement("input");
                                      fileInput.type = "file";
                                      fileInput.accept = "image/*";
                                      fileInput.onchange = (event) => {
                                        const file = event.target.files[0];
                                        if (file) {
                                          handleVariantImageUpload(item.id, [file]);
                                        }
                                      };
                                      fileInput.click();
                                    }}
                                  >
                                    Replace
                                  </button>
                                  <button
                                    className="image-remove-button"
                                    onClick={() => handleRemoveVariantImage(item.id, index)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                    </SpaceBetween>
                  </Container>
                ))}
              </SpaceBetween>
            ) : (
              // Desktop view - Display variants in table
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
                      </span>
                    ),
                    cell: (item) => (
                      <div style={{ width: "200px" }}>
                        <Grid disableGutters gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                        <FormField
                        errorText={
                          isFormSubmitted && !item.stockQuantity && "Required"
                        }
                      >
                          <Input
                            placeholder="Enter Quantity"
                            type="text"
                            value={item.stockQuantity}
                            disabled={!!overallStock}
                            onChange={({ detail }) =>
                              handleInputChange(item.id, "stockQuantity", detail.value)
                            }
                          />
                          </FormField>
                          <Select
                                    disabled={!!overallStock}

                            key={`quantity-${item.id}`} // Ensures the select stays stable and is unique
                            expandToViewport
                            selectedOption={unitOptions.find((opt) => opt.value === item.unit)}
                            onChange={(event) => {
                              event.stopPropagation(); // Prevent parent handlers from closing the dropdown
                              handleInputChange(
                                item.id,
                                "unit",
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
                              (opt) => opt.value === item.totalquantityB2cUnit
                            )}
                            onChange={(event) => {
                              event.stopPropagation(); // Prevent parent handlers from closing the dropdown
                              handleInputChange(
                                item.id,
                                "totalquantityB2cUnit",
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
                  // {
                  //   id: "saleLimit",
                  //   header: "Sale Limit",
                  //   cell: (item) => (
                  //     <FormField>
                  //       <Input
                  //         placeholder="Enter Limit"
                  //         type="number"
                  //         value={item.saleLimit}
                  //         onChange={({ detail }) =>
                  //           handleInputChange(item.id, "saleLimit", detail.value) // Use item.id here
                  //         }
                  //       />
                  //     </FormField>
                  //   ),
                  // },
                  // 
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
                  {
                    id: "expiry",
                    header: "Expiry Date",
                    cell: (item) => (
                      <FormField>
                        <Input
                          type="date"
                          onChange={({ detail }) => 
                            handleInputChange(item.id, "expiry", detail.value)
                          }
                          value={item.expiry}
                        />
                      </FormField>
                    )
                  },
                  {
                    id: "image",
                    header: "Image",
                    cell: (item) => (
                      <div className="desktop-variant-image-cell">
                        <div className="image-preview-container">
                          {item.images.map((image, index) => (
                            <div key={index} className="desktop-variant-image-preview">
                              <img 
                                src={image} 
                                alt={`Variant ${item.attribute} Img ${index + 1}`} 
                              />
                              <div className="image-overlay">
                                <button
                                  className="image-action-button"
                                  onClick={() => {
                                    const fileInput = document.createElement("input");
                                    fileInput.type = "file";
                                    fileInput.accept = "image/*";
                                    fileInput.onchange = (event) => {
                                      const file = event.target.files[0];
                                      if (file) {
                                        handleVariantImageUpload(item.id, [file]);
                                      }
                                    };
                                    fileInput.click();
                                  }}
                                >
                                  Replace
                                </button>
                                <button
                                  className="image-remove-button"
                                  onClick={() => handleRemoveVariantImage(item.id, index)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {item.images.length < 5 && (
                        <Button 
                        variant="icon" 
                        size="small" 
                        iconName="upload"
                        onClick={() => {
                          const fileInput = document.createElement("input");
                          fileInput.type = "file";
                          fileInput.accept = "image/*";
                          fileInput.multiple = true; // enable multiple image selection
                          fileInput.onchange = (event) => {
                            const files = Array.from(event.target.files);
                            if (files.length > 0) {
                              handleVariantImageUpload(item.id, files); // Pass all selected files
                            }
                          };
                          fileInput.click();
                        }}
                      />
                      
                        )}
                        
                        {item.images.length === 0 && (
                          <p className="image-upload-hint">
                            Upload up to 5 images
                          </p>
                        )}
                      </div>
                    )
                  }
                ]}
                items={tableData}
                empty={<p>No variants added yet.</p>}
              />
            )}
          </Container>
        )}

     <div className="action-buttons">
            <Button onClick={handleSave}>Save Item</Button>
            <Button variant="link" onClick={() => navigate("/app/inventory")}>
              Cancel
            </Button>
     </div>
      </SpaceBetween>
    </div>
  );
};

export default AddEditVariant;