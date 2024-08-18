import * as React from "react";
import { useDispatch } from "react-redux";
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
} from "@cloudscape-design/components";
import { addProduct, uploadImage } from "Redux-Store/Products/ProductThunk";
import UploadImage from "../../../../assets/img/UploadImage.png";
import upload2 from "../../../../assets/img/upload2.png";
import upload3 from "../../../../assets/img/upload3.png"
const AddItem = () => {
  // Form state
  const dispatch = useDispatch();

  const [name, setName] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState(null);
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

  // Handle first image upload
  const handleImageUpload1 = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileName = encodeURIComponent(file.name);
      try {
        const response = await fetch(
          `https://lou294nkli.execute-api.us-east-1.amazonaws.com/uploadUrl?fileName=${fileName}`
        );
        const { uploadUrl } = await response.json();
        // console.log("response", response.json());
        console.log("url", uploadUrl.split("?")[0]);
        const finalUrl = uploadUrl.split("?")[0];
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
        });

        if (uploadResponse.ok) {
          console.log("File uploaded successfully.");
          setImageUrl1(finalUrl);
          
        } else {
          console.error("Failed to upload the file.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  // Handle second image upload
  const handleImageUpload2 = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileName = encodeURIComponent(file.name);
      try {
        const response = await fetch(
          `https://lou294nkli.execute-api.us-east-1.amazonaws.com/uploadUrl?fileName=${fileName}`
        );
        const { uploadUrl } = await response.json();
        // console.log("response", response.json());
        console.log("url", uploadUrl.split("?")[0]);
        const finalUrl = uploadUrl.split("?")[0];
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
        });

        if (uploadResponse.ok) {
          console.log("File uploaded successfully upload 2.");
          setImageUrl2(finalUrl);
        } else {
          console.error("Failed to upload the file.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleImageUpload3 = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileName = encodeURIComponent(file.name);
      try {
        const response = await fetch(
          `https://lou294nkli.execute-api.us-east-1.amazonaws.com/uploadUrl?fileName=${fileName}`
        );
        const { uploadUrl } = await response.json();
        // console.log("response", response.json());
        console.log("url", uploadUrl.split("?")[0]);
        const finalUrl = uploadUrl.split("?")[0];
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
        });

        if (uploadResponse.ok) {
          console.log("File uploaded successfully upload3.");
          setImageUrl3(finalUrl);
        } else {
          console.error("Failed to upload the file.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  // Handle Save button click
  const handleSave = () => {
    const formattedExpiryDate = expiryDate
      ? new Date(expiryDate).toISOString()
      : null;

    const formData = {
      name,
      description,
      category: selectedCategory ? selectedCategory.value : null,
      units: selectedUnits ? selectedUnits.value : null,
      purchasingPrice: Number(purchasingPrice),
      msp: Number(msp),
      stockQuantity: Number(stockQuantity),
      expiry: formattedExpiryDate,
      images: [imageUrl1, imageUrl2, imageUrl3], // send both uploaded image URLs
    };

    console.log("Form Data:", JSON.stringify(formData, null, 2));
    dispatch(addProduct(formData))
      .unwrap() // optional: unwraps the resolved or rejected action to handle it as a promise
      .then(() => {
        console.log("Item added successfully");
      })
      .catch((error) => {
        console.error("Failed to add item:", error);
      });
  };

  return (
    <div>
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
              <Button>Import Items</Button>
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
            height: quantityOnHand ? "auto" : "370px",
          }}
        >
          <Container variant="borderless">
            <ColumnLayout minColumnWidth={45} columns={2} gutter={20}>
              <Form>
                <SpaceBetween direction="vertical" size="l">
                  <FormField label="Item Name">
                    <Input
                      size="xs"
                      placeholder="Input Item Name"
                      value={name}
                      onChange={({ detail }) => setName(detail.value)}
                    />
                  </FormField>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ width: "150px" }}>
                      <FormField label="Category">
                        <Select
                          selectedOption={selectedCategory}
                          onChange={({ detail }) =>
                            setSelectedCategory(detail.selectedOption)
                          }
                          options={[
                            { label: "FRUIT", value: "Fruit" },
                            { label: "VEGETABLE", value: "Vegetable" },
                            { label: "DAIRY", value: "Dairy" },
                          ]}
                          placeholder="Select Category"
                        />
                      </FormField>
                    </div>
                    <div style={{ width: "160px" }}>
                      <FormField label="Units">
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
                    </div>
                  </div>
                  <FormField label="Quantity In Stock">
                    <Input
                      size="xs"
                      placeholder="Quantity available in stock"
                      value={stockQuantity}
                      onChange={({ detail }) => setStockQuantity(detail.value)}
                    />
                  </FormField>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <FormField label="Purchasing Price">
                      <Input
                        size="3xs"
                        placeholder="Input Purchasing Price"
                        value={purchasingPrice}
                        onChange={({ detail }) =>
                          setPurchasingPrice(detail.value)
                        }
                      />
                    </FormField>
                    <FormField label="Min Selling Price">
                      <Input
                        size="3xs"
                        placeholder="Min Selling Price"
                        value={msp}
                        onChange={({ detail }) => setMsp(detail.value)}
                      />
                    </FormField>
                  </div>

                  <div style={{ marginBottom: 0 }}>
                    <Toggle
                      onChange={({ detail }) =>
                        setQuantityOnHand(detail.checked)
                      }
                      checked={quantityOnHand}
                    >
                      Quantity on hand
                    </Toggle>
                  </div>
                  {quantityOnHand && (
                    <div style={{ display: "flex", gap: "15px" }}>
                      <div style={{ width: "200px" }}>
                        <FormField label="Quantity In Stock">
                          <Select
                            value={store}
                            selectedOption={store} // Example, replace with relevant state
                            onChange={({ detail }) =>
                              setStore(detail.selectedOption)
                            }
                            options={[
                              { label: "GIRDHARI", value: "girdhari" },
                              { label: "SAIDABAD", value: "saidabad" },
                            ]}
                          />
                        </FormField>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <FormField label="Quantity">
                          <Input
                            size="3xs"
                            placeholder="Enter Quantity"
                            value={quantity}
                            onChange={({ detail }) => setQuantity(detail.value)}
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
                <FormField label="Product Description">
                  <Textarea
                    rows={5}
                    onChange={({ detail }) => setDescription(detail.value)}
                    value={description}
                  />
                </FormField>
                <Toggle
                  onChange={({ detail }) => setAddExpiry(detail.checked)}
                  checked={addExpiry}
                >
                  Add Expiry
                </Toggle>
                {addExpiry && (
                  <FormField label="Expiry Date">
                    <Input
                      type="date"
                      onChange={({ detail }) => setExpiryDate(detail.value)}
                      value={expiryDate}
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
                <input
                  type="file"
                  id="upload-button-1"
                  style={{ display: "none" }}
                  onChange={handleImageUpload1}
                />
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
                  />
                </div>
                <div
                    style={{
                      cursor: "pointer",
                      border: "1px dashed gray",
                      width: "120px",
                      height: "100px",
                      borderRadius: "8px",
                      marginTop: "20px",
                    }}
                    >
                  <label htmlFor="upload-button-3">
                    <img
                    style={{
                      height: "98px",
                      borderRadius: "8px",
                    }}
                      src={imageUrl3 || upload3}
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
