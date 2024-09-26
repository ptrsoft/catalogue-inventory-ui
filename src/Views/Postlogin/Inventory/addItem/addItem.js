import React, { useState } from 'react'; 
import { useDispatch } from "react-redux";
import {
  Textarea,
  Container,
  Toggle,
  Select,
  Header,
  Button,
  ColumnLayout,
  Input,
  Form,
  SpaceBetween,
  Checkbox,
  BreadcrumbGroup,
  FormField,
  Flashbar,
} from "@cloudscape-design/components";
import { uploadImage } from "Redux-Store/uploadImage/uploadThunk";
import { addProduct } from "Redux-Store/Products/ProductThunk";
import { FileUpload } from "@cloudscape-design/components";

const AddItem = () => {
  const dispatch = useDispatch();
  const [name, setName] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = React.useState(null);
  const [selectedUnits, setSelectedUnits] = React.useState(null);
  const [purchasingPrice, setPurchasingPrice] = React.useState("");
  const [msp, setMsp] = React.useState("");
  const [stockQuantity, setStockQuantity] = React.useState("");
  const [quantityOnHand, setQuantityOnHand] = React.useState(false);
  const [quantity, setQuantity] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [addExpiry, setAddExpiry] = React.useState(false);
  const [keepInformed, setKeepInformed] = React.useState(false);
  const [expiryDate, setExpiryDate] = React.useState("");
  const [imageUrl1, setImageUrl1] = React.useState("");
  const [imageUrl2, setImageUrl2] = React.useState("");
  const [imageUrl3, setImageUrl3] = React.useState("");
  const [store, setStore] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [fileUploadValue, setFileUploadValue] = useState([]);
  

  const subcategoryOptions = {
    "Fruits And Vegetables": [
      { label: "Fresh Vegetables", value: "freshVegetables" },
      { label: "Fresh Fruits", value: "freshFruits" },
      { label: "Leafy Vegetables", value: "freshFruits" },
      { label: "Exotic Vegetables", value: "exoticVegetables" },
    ],
    "Meat/Fish/Eggs": [
      { label: "Eggs", value: "eggs" },
      { label: "Fish", value: "fish" },
      { label: "Chicken", value: "chicken" },
      { label: "Mutton", value: "mutton" },
    ],
    "Dairies And Groceries": [
      { label: "Dairies", value: "dairies" },
      { label: "Groceries", value: "groceries" },
    ],
    "Bengali Special": [
      { label: "Bengali Vegetables", value: "bengaliVegetables" },
      { label: "Bengali Groceries", value: "bengaliGroceries" },
      { label: "Bengali Home Needs", value: "bengaliHomeNeeds" },
    ],
  };

  const handleImageUpload = async (file, setImageUrl) => {
    if (file) {
      try {
        const result = await dispatch(uploadImage(file)).unwrap();
        setImageUrl(result); // Update the state with the returned URL
      } catch (error) {
        console.error(`Failed to upload image:`, error);
      }
    }
  };
  
  const isFormValid = () => {
    if (
      !name ||
      !selectedCategory ||
      !selectedUnits ||
      !purchasingPrice ||
      !msp ||
      !stockQuantity ||
      !imageUrl1
    ) {
      return false;
    }
    return true;
  };

  const handleChange = ({ detail }) => {
    if (detail.value.length <= 247) {
      setDescription(detail.value);
    }
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
      name,
      description: description,
      category: selectedCategory ? selectedCategory.value : null,
      units: selectedUnits ? selectedUnits.value : null,
      purchasingPrice: Number(purchasingPrice),
      msp: Number(msp),
      stockQuantity: Number(stockQuantity),
      expiry: formattedExpiryDate,
      images: [imageUrl1, imageUrl2, imageUrl3].filter(Boolean),
      subCategory: selectedSubCategory ? selectedSubCategory.value : null, // Remove empty URLs
    };

    console.log("Form Data:", JSON.stringify(formData, null, 2));
    dispatch(addProduct(formData))
      .unwrap() // optional: unwraps the resolved or rejected action to handle it as a promise
      .then(() => {
        console.log("Item added successfully");
        setItems([
          {
            type: "success",
            content: "Item added successfully",
            dismissible: true,
            dismissLabel: "Dismiss message",
            onDismiss: () => setItems([]),
            id: "message_1",
          },
        ]);
        setName("");
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setSelectedUnits(null);
        setPurchasingPrice("");
        setMsp("");
        setStockQuantity("");
        setQuantityOnHand(false);
        setQuantity("");
        setDescription("");
        setAddExpiry(false);
        setKeepInformed(false);
        setExpiryDate("");
        setImageUrl1("");
        setImageUrl2("");
        setImageUrl3("");
        setStore("");
        setIsFormSubmitted(false);
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
          console.log(
            "No Flashbar message shown for this error:",
            errorMessage
          );
        }
      });
  };

  const handleFileChange = (files) => {
    files.forEach((file, index) => {
      if (index === 0) handleImageUpload(file, setImageUrl1);
      else if (index === 1) handleImageUpload(file, setImageUrl2);
      else if (index === 2) handleImageUpload(file, setImageUrl3);
    });
  };

  return (
  <SpaceBetween size="s">
      <Flashbar items={items} />
      <BreadcrumbGroup
        items={[
          { text: "Inventory", href: "/app/inventory" },
          { text: "Add Items", href: "/app/inventory/addItem" },
        ]}
        ariaLabel="Breadcrumbs"
      />
      <Header
        variant="h1"
        actions={
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        }
      >
        Add Items
      </Header>
      <Container>
        <Form>
          <SpaceBetween direction="vertical" size="l">
            <FormField
              label="Item Name"
              errorText={isFormSubmitted && !name && "Required"}
            >
              <Input
                size="xs"
                placeholder="Input Item Name"
                value={name}
                onChange={({ detail }) => setName(detail.value)}
              />
            </FormField>
            <FormField label="Product Description">
              <Textarea
                rows={5}
                onChange={handleChange}
                value={description}
                maxLength={247}
              />
            </FormField>

            <ColumnLayout columns={3} minColumnWidth={120}>
              <FormField
                label="Category"
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
                      label: "Fruits And Vegetables",
                      value: "Fruits And Vegetables",
                    },
                    {
                      label: "Dairies And Groceries",
                      value: "Dairies And Groceries",
                    },
                    { label: "Bengali Special", value: "Bengali Special" },
                    { label: "Meat/Fish/Eggs", value: "Meat/Fish/Eggs" },
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
                  placeholder="Select Unit"
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
              <FormField
                label="Units"
                errorText={isFormSubmitted && !selectedUnits && "Required"}
              >
                <Select
                  placeholder="Select Unit"
                  selectedOption={selectedUnits}
                  onChange={({ detail }) =>
                    setSelectedUnits(detail.selectedOption)
                  }
                  options={[
                    { label: "Piece", value: "pieces" },
                    { label: "Grams", value: "grams" },
                    { label: "Kgs", value: "kgs" },
                  ]}
                />
              </FormField>
            </ColumnLayout>

            <ColumnLayout columns={3} minColumnWidth={120}>
              <FormField
                label="Quantity In Stock"
                errorText={isFormSubmitted && !stockQuantity && "Required"}
              >
                <Input
                  required
                  size="xs"
                  placeholder="Quantity available in stock"
                  value={stockQuantity}
                  onChange={({ detail }) => setStockQuantity(detail.value)}
                />
              </FormField>
              <FormField
                label="Purchasing Price"
                errorText={isFormSubmitted && !purchasingPrice && "Required"}
              >
                <Input
                  required
                  size="3xs"
                  placeholder="Input Purchasing Price"
                  value={purchasingPrice}
                  onChange={({ detail }) => setPurchasingPrice(detail.value)}
                />
              </FormField>
              <FormField
                label="Min Selling Price"
                errorText={isFormSubmitted && !msp && "Required"}
              >
                <Input
                  required
                  size="3xs"
                  placeholder="Min Selling Price"
                  value={msp}
                  onChange={({ detail }) => setMsp(detail.value)}
                />
              </FormField>
            </ColumnLayout>
            <ColumnLayout columns={3} minColumnWidth={120}>
              <div>
                <FormField>
                  <Toggle
                    onChange={({ detail }) => setAddExpiry(detail.checked)}
                    checked={addExpiry}
                  >
                    Add Expiry
                  </Toggle>
                </FormField>
                {addExpiry && (
                  <FormField label="Expiry Date">
                    <Input
                      type="date"
                      onChange={({ detail }) => setExpiryDate(detail.value)}
                      value={expiryDate}
                      required
                    />
                  </FormField>
                )}
              </div>
              <div>
                <FormField>
                  <Toggle
                    onChange={({ detail }) => setQuantityOnHand(detail.checked)}
                    checked={quantityOnHand}
                  >
                    Quantity on hand
                  </Toggle>
                </FormField>
                {quantityOnHand && (
                  <>
                    <FormField label="Quantity In Stock">
                      <Select
                        required
                        value={store}
                        selectedOption={store} // Example, replace with relevant state
                        onChange={({ detail }) =>
                          setStore(detail.selectedOption)
                        }
                        options={[
                          { label: "GIRDHARI", value: "girdhari" },
                          { label: "SAIDABAD", value: "saidabad" },
                        ]}
                        placeholder="Select store"
                      />
                    </FormField>
                    <FormField label="Quantity">
                      <Input
                        size="3xs"
                        placeholder="Enter Quantity"
                        value={quantity}
                        onChange={({ detail }) => setQuantity(detail.value)}
                        required
                      />
                    </FormField>
                    <Checkbox
                      checked={keepInformed}
                      onChange={({ detail }) => setKeepInformed(detail.checked)}
                    >
                      Keep me informed about stock updates for this item.
                    </Checkbox>
                  </>
                )}
              </div>
              <div></div>
            </ColumnLayout>
          </SpaceBetween>
        </Form>

        <Container variant="borderless">
<FileUpload
      onChange={({ detail }) => {
        setFileUploadValue(detail.value);
        handleFileChange(detail.value); // Call handleFileChange when files are selected
      }}
      value={fileUploadValue}
      i18nStrings={{
        uploadButtonText: e => (e ? "Choose files" : "Choose file"),
        dropzoneText: e => (e ? "Drop files to upload" : "Drop file to upload"),
        removeFileAriaLabel: e => `Remove file ${e + 1}`,
        limitShowFewer: "Show fewer files",
        limitShowMore: "Show more files",
        errorIconAriaLabel: "Error"
      }}
      multiple
      showFileSize
      showFileThumbnail
      tokenLimit={3}
      errorText={fileUploadValue.length === 0 && isFormSubmitted ? (
        "At least one image is required"
      ) : ""} // Display error if no images are uploaded and form has been submitted
            />
        </Container>
      </Container>
      </SpaceBetween>  );
};

export default AddItem;
