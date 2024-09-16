import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Textarea,
  Icon,
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
  Spinner,
} from "@cloudscape-design/components";
import { uploadImage } from "Redux-Store/uploadImage/uploadThunk";
import { addProduct } from "Redux-Store/Products/ProductThunk";
import UploadImage from "../../../../assets/img/UploadImage.png";
import upload2 from "../../../../assets/img/upload2.png";
import upload3 from "../../../../assets/img/upload3.png";
const AddItem = () => {
  const { imageUrl, loading, error } = useSelector((state) => state.upload);

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
  const [imageLoading1, setImageLoading1] = React.useState(false);
  const [imageLoading2, setImageLoading2] = React.useState(false);
  const [imageLoading3, setImageLoading3] = React.useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const subcategoryOptions = {
    "Fruits And Vegetables": [
      { label: "FRESH VEGETABLES", value: "freshVegetables" },
      { label: "FRESH FRUITS", value: "freshFruits" },
      { label: "LEAFY VEGETABLES", value: "freshFruits" },
      { label: "EXOTIC VEGETABLES", value: "exoticVegetables" },
    ],
    "Meat/Fish/Eggs": [
      { label: "EGGS", value: "eggs" },
      { label: "FISH", value: "fish" },
      { label: "CHICKEN", value: "chicken" },
      { label: "MUTTON", value: "mutton" },
    ],
    "Dairies And Groceries": [
      { label: "DAIRIES", value: "dairies" },
      { label: "GROCERIES", value: "groceries" },
    ],
    "Bengali Special": [
      { label: "BENGALI VEGETABLES", value: "bengaliVegetables" },
      { label: "BENGALI GROCERIES", value: "bengaliGroceries" },
      { label: "BENGALI HOME NEEDS", value: "bengaliHomeNeeds" },
    ],
  };

  const handleImageUpload1 = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setImageLoading1(true);
        const result = await dispatch(uploadImage(file)).unwrap();
        setImageUrl1(result); // Update the state with the returned URL
      } catch (error) {
        console.error("Failed to upload image 1:", error);
      } finally {
        setImageLoading1(false);
        setImageError(false); // Clear error when an image is uploaded
      }
    }
  };

  const handleImageUpload2 = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setImageLoading2(true);
        const result = await dispatch(uploadImage(file)).unwrap();
        setImageUrl2(result); // Update the state with the returned URL
      } catch (error) {
        console.error("Failed to upload image 2:", error);
      } finally {
        setImageLoading2(false);
      }
    }
  };

  const handleImageUpload3 = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setImageLoading3(true);
        const result = await dispatch(uploadImage(file)).unwrap();
        setImageUrl3(result); // Update the state with the returned URL
      } catch (error) {
        console.error("Failed to upload image 3:", error);
      } finally {
        setImageLoading3(false);
      }
    }
  };

  // Handle second image upload
  // const handleImageUpload2 = async (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const fileName = encodeURIComponent(file.name);
  //     try {
  //       const response = await fetch(
  //         `https://lou294nkli.execute-api.us-east-1.amazonaws.com/uploadUrl?fileName=${fileName}`
  //       );
  //       const { uploadUrl } = await response.json();
  //       // console.log("response", response.json());
  //       console.log("url", uploadUrl.split("?")[0]);
  //       const finalUrl = uploadUrl.split("?")[0];
  //       const uploadResponse = await fetch(uploadUrl, {
  //         method: "PUT",
  //         body: file,
  //       });

  //       if (uploadResponse.ok) {
  //         console.log("File uploaded successfully upload 2.");
  //         setImageUrl2(finalUrl);
  //       } else {
  //         console.error("Failed to upload the file.");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }
  // };
  const isFormValid = () => {
    if (
      !name ||
      !selectedCategory ||
      !selectedUnits ||
      !purchasingPrice ||
      !msp ||
      !stockQuantity ||
      (quantityOnHand && (!store || !quantity)) ||
      !description ||
      (addExpiry && !expiryDate) ||
      !imageUrl1
    ) {
      return false;
    }
    return true;
  };

  const handleChange = ({ detail }) => {
    // Limit the description to 247 characters
    if (detail.value.length <= 247) {
      setDescription(detail.value);
    }
  };
  // Handle Save button click
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
      : null;

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
      subCategory : selectedSubCategory ? selectedSubCategory.value : null // Remove empty URLs
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
      });
  };

  return (
    <div>
      <Flashbar items={items} />
      <div style={{ paddingLeft: "20px" }}>
        <BreadcrumbGroup
          items={[
            { text: "Inventory", href: "/app/inventory" },
            { text: "Add Items", href: "/app/inventory/addItem" },
          ]}
          ariaLabel="Breadcrumbs"
        />
      </div>
      <div
        style={{
          marginTop: "12px",
          fontWeight: "900",
          fontSize: "36px",
          padding: "0 80px 0 20px",
        }}
      >
        <Header
          variant="h1"
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              {/* <Button>Import Items</Button> */}
              <Button variant="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          }
        >
          <strong style={{ fontWeight: "900" }}>Add Items</strong>
        </Header>
      </div>
      <div style={{ display: "flex", gap: "30px", padding: "10px" }}>
        <div
          style={{
            width: "48vw",
            borderRadius: "15px",
            boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
            height: quantityOnHand ? "auto" : "445px",
          }}
        >
          <Container variant="borderless">
            <ColumnLayout minColumnWidth={45} columns={2} gutter={20}>
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
                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ width: "150px" }}>
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
                            { label: "Select a Category", value: "" },
                            { label: "FRUITS AND VEGETABLES", value: "Fruits And Vegetables" },
                            { label: "DAIRIES AND GROCERIES", value: "Dairies And Groceries" },
                            { label: "BENGALI SPECIAL", value: "Bengali Special" },
                            { label: "MEAT/FISH/EGGS", value: "Meat/Fish/Eggs" },
                          ]}
                          placeholder="Select Category"
                        />
                      </FormField>
                    </div>
                    <div style={{ width: "160px" }}>
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
                    </div>
                  </div>
                  <FormField
                        label="Units"
                        errorText={
                          isFormSubmitted && !selectedUnits && "Required"
                        }
                      >
                        <Select
                          placeholder="Select Unit"
                          selectedOption={selectedUnits}
                          onChange={({ detail }) =>
                            setSelectedUnits(detail.selectedOption)
                          }
                          options={[
                            { label: "PIECE", value: "pieces" },
                            { label: "GRAMS", value: "grams" },
                          ]}
                        />
                      </FormField>
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
                  <div style={{ display: "flex", gap: "15px" }}>
                    <FormField
                      label="Purchasing Price"
                      errorText={
                        isFormSubmitted && !purchasingPrice && "Required"
                      }
                    >
                      <Input
                        required
                        size="3xs"
                        placeholder="Input Purchasing Price"
                        value={purchasingPrice}
                        onChange={({ detail }) =>
                          setPurchasingPrice(detail.value)
                        }
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
                  </div>

                  <div style={{ marginBottom: 0 }}>
                    <FormField
                      errorText={isFormSubmitted && !quantity && "Required"}>
                    <Toggle
                      onChange={({ detail }) =>
                        setQuantityOnHand(detail.checked)
                      }
                      checked={quantityOnHand}
                    >
                      Quantity on hand
                    </Toggle>
                    </FormField>
                  </div>
                  {quantityOnHand && (
                    <div style={{ display: "flex", gap: "15px" }}>
                      <div style={{ width: "200px" }}>
                        <FormField
                          label="Quantity In Stock"
                          errorText={isFormSubmitted && !store && "Required"}
                        >
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
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <FormField
                          label="Quantity"
                          errorText={isFormSubmitted && !quantity && "Required"}
                        >
                          <Input
                            size="3xs"
                            placeholder="Enter Quantity"
                            value={quantity}
                            onChange={({ detail }) => setQuantity(detail.value)}
                            required
                          />
                        </FormField>
                        <div style={{ paddingTop: "30px" }}>
                          <Icon name="remove" />
                        </div>
                      </div>
                    </div>
                  )}
                </SpaceBetween>
              </Form>
              <SpaceBetween direction="vertical" size="l">
                <FormField
                  label="Product Description"
                  errorText={isFormSubmitted && !description && "Required"}
                >
                  <Textarea
                    rows={5}
                    onChange={handleChange}
                    value={description}
                   maxLength = {247}
                  />
                </FormField>
              <FormField
                errorText={isFormSubmitted && !expiryDate && "Required"}
              >
                <Toggle
                  onChange={({ detail }) => setAddExpiry(detail.checked)}
                  checked={addExpiry}
                >
                  Add Expiry
                </Toggle></FormField>
                {addExpiry && (
                  <FormField
                    label="Expiry Date"
                    errorText={isFormSubmitted && !expiryDate && "Required"}
                  >
                    <Input
                      type="date"
                      onChange={({ detail }) => setExpiryDate(detail.value)}
                      value={expiryDate}
                      required
                    />
                  </FormField>
                )}
                <Checkbox
                  checked={keepInformed}
                  onChange={({ detail }) => setKeepInformed(detail.checked)}
                >
                  Keep me informed about stock updates for this item.
                </Checkbox>
              </SpaceBetween>
            </ColumnLayout>
          </Container>
        </div>
        <div
          style={{
            width: "25vw",
            borderRadius: "15px",
            height: "auto",
            boxShadow: "0 1px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Container variant="borderless">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div>
                <label htmlFor="upload-button-1">
                  <img
                    src={imageUrl1 || UploadImage}
                    alt="Upload"
                    style={{
                      width: "300px",
                      height: "300px",
                      objectFit: "cover",
                      cursor: "pointer",
                      borderRadius: "10px",
                    }}
                  />
                </label>
                {isFormSubmitted && imageError && (
                  <div style={{ color: "red", marginTop: "10px" }}>
                    Image is required
                  </div>
                )}
                <input
                  type="file"
                  id="upload-button-1"
                  style={{ display: "none" }}
                  onChange={handleImageUpload1}
                  required
                />
                {imageLoading1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "35%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "rgba(255, 255, 255, 0.7)",
                      borderRadius: "50%",
                      padding: "10px",
                    }}
                  >
                    <Spinner size="large" />
                  </div>
                )}
              </div>

              <div
                style={{ display: "flex", gap: "30px", paddingLeft: "20px" }}
              >
                <div>
                  <label htmlFor="upload-button-2">
                    <img
                      src={imageUrl2 || upload2}
                      alt="Upload"
                      style={{
                        marginTop: "20px",
                        width: "100px",
                        height: "100px",
                        cursor: "pointer",
                      }}
                    />
                  </label>
                  <input
                    type="file"
                    id="upload-button-2"
                    style={{ display: "none" }}
                    onChange={handleImageUpload2}
                    required
                  />
                  {imageLoading2 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "80%",
                        left: "27%",
                        transform: "translate(-80%, -50%)",
                        background: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "50%",
                        padding: "10px",
                      }}
                    >
                      <Spinner size="normal" />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    cursor: "pointer",
                    // border: "1px dashed gray",
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    marginTop: "20px",
                  }}
                >
                  {imageLoading3 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "80%",
                        left: "60%",
                        transform: "translate(-50%, -50%)",
                        background: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "50%",
                        padding: "10px",
                      }}
                    >
                      <Spinner size="normal" />
                    </div>
                  )}
                  <label htmlFor="upload-button-3">
                    <img
                      style={{
                        height: "98px",
                        borderRadius: "8px",
                      }}
                      src={imageUrl3 || upload2}
                      alt=""
                      height="full"
                      width="full"
                    />
                  </label>
                  <input
                    type="file"
                    id="upload-button-3"
                    style={{ display: "none" }}
                    onChange={handleImageUpload3}
                    required
                  />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
