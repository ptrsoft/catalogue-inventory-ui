import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchProductById,
  updateProductDetails,
} from "Redux-Store/Products/ProductThunk";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import BreadcrumbGroup from "@cloudscape-design/components/breadcrumb-group";
import Grid from "@cloudscape-design/components/grid";
import {
  SpaceBetween,
  FormField,
  Input,
  Toggle,
  Header,
  Container,
  Select,
  ColumnLayout,
  Button,
  Textarea,
} from "@cloudscape-design/components"; // Adjust the import path if needed
import Flashbar from "@cloudscape-design/components/flashbar";

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
  const [category, setCategory] = useState("");
  const [units, setUnits] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [purchasingPrice, setPurchasingPrice] = useState("");
  const [msp, setMsp] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [addExpiry, setAddExpiry] = useState(false);
  const [keepInformed, setKeepInformed] = useState(false);
  const [store, setStore] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showQuantityFields, setShowQuantityFields] = useState(false);
  const [selectedUnits, setSelectedUnits] = React.useState(null);
  const [subCategory, setSubCategory] = useState(""); // Add this line
  const [items, setItems] = React.useState([]);
  const [invalidFields, setInvalidFields] = useState({}); // State to track invalid fields

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
      setCategory(productDetail.category || "");
      setUnits(productDetail.units || "");
      setStockQuantity(productDetail.stockQuantity || "");
      setPurchasingPrice(productDetail.purchasingPrice || "");
      setMsp(productDetail.msp || "");
      setDescription(productDetail.description || "");
      setSubCategory(productDetail.subCategory || "");
      setExpiryDate(productDetail.expiryDate || "");
    }
  }, [productDetail]);

  if (productDetailStatus === "in_progress") {
    return <div>Loading...</div>;
  }
  if (productDetailStatus === "failure") {
    return <div>Error fetching product: {productDetailError}</div>;
  }
  if (!productDetail) {
    return <div>No product details available.</div>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check for empty fields and mark them as invalid
    const validationFlags = {
      name: !name,
      category: !category,
      subCategory: !subCategory,
      units: !units,
      description: !description,
      expiryDate: !expiryDate, // Always check for expiryDate
    };

    // If any field is invalid, return early and set invalid fields
    if (Object.values(validationFlags).some((isInvalid) => isInvalid)) {
      setInvalidFields(validationFlags);
      return;
    }

    setInvalidFields({});

    const productData = {
      name,
      description,
      category,
      subCategory,
      units,
      expiry: new Date(expiryDate).toISOString(),
    };

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
          },
        ]);

        setTimeout(() => {
          setItems([]);
          navigate("/app/inventory");
        }, 3000);
      })
      .catch((error) => {
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
      });
  };

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
      <form onSubmit={handleSubmit}>
        <Grid
          gridDefinition={[
            { colspan: { default: 16, xxs: 8 } },
            { colspan: { default: 8, xxs: 4 } },
          ]}
        >
          <Container>
            <SpaceBetween direction="vertical" size="xs">
              <ColumnLayout columns={2} minColumnWidth={170}>
                <SpaceBetween size="s">
                  <FormField label="Item Name">
                    <Input
                      invalid={invalidFields.name}
                      value={name}
                      onChange={({ detail }) => setName(detail.value)}
                    />
                  </FormField>
                  <FormField label="Category">
                    <Input
                      invalid={invalidFields.category}
                      value={category}
                      onChange={({ detail }) => setCategory(detail.value)}
                    />
                  </FormField>
                  <FormField label="Sub Category">
                    <Input
                      invalid={invalidFields.subCategory}
                      value={subCategory}
                      onChange={({ detail }) => setSubCategory(detail.value)}
                    />
                  </FormField>
                  <FormField label="Unit">
                    <Select
                      options={[
                        { label: "Piece", value: "pieces" },
                        { label: "Grams", value: "grams" },
                        { label: "Kgs", value: "kgs" },
                        { label: "Litres", value: "litres" },
                      ]}
                      value={units} // Set the value from productDetail
                      invalid={invalidFields.units}
                      selectedOption={{
                        label: units.charAt(0).toUpperCase() + units.slice(1),
                        value: units,
                      }} // Ensure the label is capitalized
                      onChange={({ detail }) => {
                        setUnits(detail.selectedOption.value);
                        setSelectedUnits(detail.selectedOption); // Update selectedUnits state
                      }}
                    />
                  </FormField>

                  <FormField label="Quantity in Stock">
                    <Input
                      value={stockQuantity}
                      onChange={({ detail }) => setStockQuantity(detail.value)}
                    />
                  </FormField>

                  <FormField label="Purchasing Price">
                    <Input
                      value={purchasingPrice}
                      onChange={({ detail }) =>
                        setPurchasingPrice(detail.value)
                      }
                    />
                  </FormField>
                  <FormField label="Minimum Selling Price">
                    <Input
                      value={msp}
                      onChange={({ detail }) => setMsp(detail.value)}
                    />
                  </FormField>
                  <FormField>
                    <Toggle
                      onChange={({ detail }) =>
                        setShowQuantityFields(detail.checked)
                      }
                      checked={showQuantityFields}
                    >
                      Quantity on hand
                    </Toggle>
                  </FormField>

                  {showQuantityFields && (
                    <>
                      <FormField label="Select Store">
                        <Select
                          onChange={({ detail }) =>
                            setStore(detail.selectedOption.value)
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
                        />
                      </FormField>
                    </>
                  )}
                </SpaceBetween>

                <SpaceBetween size="m">
                  <FormField label="Item Description">
                    <Textarea
                      value={description}
                      invalid={invalidFields.description}
                      onChange={({ detail }) => setDescription(detail.value)}
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
                </SpaceBetween>
              </ColumnLayout>
            </SpaceBetween>
          </Container>
          <Container>
            <div
              style={{
                borderRadius: "10px",
                backgroundColor: "#E9EBED",
                height: "47vh",
                padding: "15px",
                marginTop: "5px",
                marginBottom: "10px",
              }}
            >
              <div>
                <img
                  src={productDetail.image}
                  alt={productDetail.name}
                  style={{ width: "100%", height: "16rem" }}
                />{" "}
              </div>{" "}
            </div>
          </Container>
        </Grid>
      </form>
    </SpaceBetween>
  );
};

export default Edit;