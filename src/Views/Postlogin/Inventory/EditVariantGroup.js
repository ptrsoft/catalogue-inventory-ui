import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, FormField, Input, Select, Textarea, Container, Header, SpaceBetween, Grid, Flashbar, Table } from "@cloudscape-design/components";
import { updateGroup, fetchCollectionById } from "Redux-Store/Products/ProductThunk";
import { uploadImage } from "Redux-Store/uploadImage/uploadThunk";

const unitOptions = [
  { label: "Pcs", value: "Pcs" },
  { label: "Pkt", value: "Pkt" },
  { label: "Gms", value: "Gms" },
  { label: "Kg", value: "Kg" },
  { label: "Ltr", value: "Ltr" },
  { label: "Combo", value: "Combo" },

];

const EditVariantGroup = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [flash, setFlash] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [variantNewTags, setVariantNewTags] = useState({}); // { idx: "" }
  const [imageUploading, setImageUploading] = useState(false);
  const [variantImageUploading, setVariantImageUploading] = useState({}); // { idx: false }
  const [overallStock, setOverallStock] = useState("");
  const [overallStockUnit, setOverallStockUnit] = useState("");

  // Add category and subcategory options (copied from edit.js)
  const categoryOptions = [
    { label: "All", value: "" },
    { label: "Fresh Vegetables", value: "Fresh Vegetables" },
    { label: "Fresh Fruits", value: "Fresh Fruits" },
    { label: "Dairy", value: "Dairy" },
    { label: "Groceries", value: "Groceries" },
    { label: "Bengali Special", value: "Bengali Special" },
    { label: "Eggs Meat & Fish", value: "Eggs Meat & Fish" },
  ];
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

  // Load group data from location.state or fetch by groupId
  useEffect(() => {
    if (location.state && location.state.groupData) {
      // Ensure all variations have boolean 'active'
      const groupData = { ...location.state.groupData };
      if (groupData.variations) {
        groupData.variations = groupData.variations.map(v => ({
          ...v,
          availability: (v.active !== undefined ? v.active : v.availability) === true || (v.active !== undefined ? v.active : v.availability) === 'true',
        }));
      }
      setForm(groupData);
      setOverallStock(location.state.groupData.overallStock || "");
      setOverallStockUnit(location.state.groupData.overallStockUnit || "");
    } else if (groupId) {
      dispatch(fetchCollectionById(groupId))
        .unwrap()
        .then((data) => {
          // Ensure all variations have boolean 'active'
          const groupData = { ...data };
          if (groupData.variations) {
            groupData.variations = groupData.variations.map(v => ({
              ...v,
              availability: (v.active !== undefined ? v.active : v.availability) === true || (v.active !== undefined ? v.active : v.availability) === 'true',
            }));
          }
          setForm(groupData);
          setOverallStock(data.overallStock || "");
          setOverallStockUnit(data.overallStockUnit || "");
        })
        .catch(() => {
          setFlash([{ type: "error", content: "Failed to load group data.", dismissible: true }]);
        });
    }
  }, [location.state, groupId, dispatch]);

  // Handlers for group fields
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for variant fields
  const handleVariantChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) => {
        if (i !== idx) return v;
        if (field === "availability") {
          return { ...v, [field]: value === true || value === "true" };
        }
        return { ...v, [field]: value };
      }),
    }));
  };

  // Add new variant
  const handleAddVariant = () => {
    setForm((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        {
          name: "",
          sellingPrice: "",
          purchasingPrice: "",
          stockQuantity: "",
          units: "",
          comparePrice: "",
          totalQuantityInB2c: "",
          totalquantityB2cUnit: "",
          images: [], // <-- added for image upload placeholder
          tags: [],
          description: "",
          stockQuantityAlert: "", // <-- added for alert field
          availability: true, // default to 'In Stock'
        },
      ],
    }));
  };

  // Remove variant
  const handleRemoveVariant = (idx) => {
    setForm((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== idx),
    }));
  };

  // --- Main Images ---
  const handleMainImageUpload = async (file) => {
    setImageUploading(true);
    try {
      const url = await dispatch(uploadImage(file)).unwrap();
      setForm((prev) => ({ ...prev, images: [...(prev.images || []), url] }));
    } finally {
      setImageUploading(false);
    }
  };
  const handleRemoveMainImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  // --- Main Tags ---
  const handleAddMainTag = () => {
    if (newTag.trim()) {
      setForm((prev) => ({ ...prev, tags: [...(prev.tags || []), newTag.trim()] }));
      setNewTag("");
    }
  };
  const handleRemoveMainTag = (idx) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));
  };

  // --- Variant Images ---
  const handleVariantImageUpload = async (idx, file) => {
    setVariantImageUploading((prev) => ({ ...prev, [idx]: true }));
    try {
      const url = await dispatch(uploadImage(file)).unwrap();
      setForm((prev) => ({
        ...prev,
        variations: prev.variations.map((v, i) =>
          i === idx ? { ...v, images: [...(v.images || []), url] } : v
        ),
      }));
    } finally {
      setVariantImageUploading((prev) => ({ ...prev, [idx]: false }));
    }
  };
  const handleRemoveVariantImage = (idx, imgIdx) => {
    setForm((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === idx ? { ...v, images: v.images.filter((_, j) => j !== imgIdx) } : v
      ),
    }));
  };

  // --- Variant Tags ---
  const handleAddVariantTag = (idx) => {
    const tag = (variantNewTags[idx] || "").trim();
    if (tag) {
      setForm((prev) => ({
        ...prev,
        variations: prev.variations.map((v, i) =>
          i === idx ? { ...v, tags: [...(v.tags || []), tag] } : v
        ),
      }));
      setVariantNewTags((prev) => ({ ...prev, [idx]: "" }));
    }
  };
  const handleRemoveVariantTag = (idx, tagIdx) => {
    setForm((prev) => ({
      ...prev,
      variations: prev.variations.map((v, i) =>
        i === idx ? { ...v, tags: v.tags.filter((_, j) => j !== tagIdx) } : v
      ),
    }));
  };

  // Helper to filter valid image URLs
  function filterValidImages(images) {
    return (images || []).filter(
      (url) => typeof url === "string" && url.trim().length > 0 && /^https?:\/\//.test(url)
    );
  }

  // Update group
  const handleUpdate = async () => {
    setLoading(true);
    setFlash([]);
    try {
      // Group-level update object
      const groupUpdate = {
        id: 'group',
        overallStock: overallStock === "" ? null : Number(overallStock),
        overallStockUnit: overallStockUnit || null,
      };
      // Variant updates (only for those with id)
      const updates = [
        groupUpdate,
        ...((form.variations || [])
          .filter(v => v.id)
          .map(v => {
            // Only include fields that are present and changed (for simplicity, include all editable fields)
            return {
              id: v.id,
              name: v.name,
              attribute: v.attribute,
              sellingPrice: v.sellingPrice === "" ? null : Number(v.sellingPrice),
              purchasingPrice: v.purchasingPrice === "" ? null : Number(v.purchasingPrice),
              stockQuantity: v.stockQuantity === "" ? null : Number(v.stockQuantity),
              units: v.units,
              comparePrice: v.comparePrice === "" ? null : Number(v.comparePrice),
              totalQuantityInB2c: v.totalQuantityInB2c === "" ? null : Number(v.totalQuantityInB2c),
              totalquantityB2cUnit: v.totalquantityB2cUnit,
              images: filterValidImages(v.images),
              tags: v.tags,
              description: v.description,
              stockQuantityAlert: v.stockQuantityAlert === "" ? null : Number(v.stockQuantityAlert),
              availability: v.availability === undefined ? true : v.availability,
              expiry: v.expiry,
            };
          })
        )
      ];
      // Add new variants (no id)
      const add = (form.variations || [])
        .filter(v => !v.id)
        .map(v => ({
          ...v,
          images: filterValidImages(v.images),
          sellingPrice: v.sellingPrice === "" ? null : Number(v.sellingPrice),
          purchasingPrice: v.purchasingPrice === "" ? null : Number(v.purchasingPrice),
          stockQuantity: v.stockQuantity === "" ? null : Number(v.stockQuantity),
          comparePrice: v.comparePrice === "" ? null : Number(v.comparePrice),
          totalQuantityInB2c: v.totalQuantityInB2c === "" ? null : Number(v.totalQuantityInB2c),
          stockQuantityAlert: v.stockQuantityAlert === "" ? null : Number(v.stockQuantityAlert),
          availability: v.availability === undefined ? true : v.availability,
        }));
      await dispatch(updateGroup({ groupId: form.groupId, groupData: { updates, add } })).unwrap();
      setFlash([
        {
          type: "success",
          content: "Group updated successfully!",
          dismissible: true,
          onDismiss: () => setFlash([]),
        },
      ]);
      setTimeout(() => navigate("/app/inventory"), 1500);
    } catch (error) {
      setFlash([
        {
          type: "error",
          content: error.message || "Failed to update group.",
          dismissible: true,
          onDismiss: () => setFlash([]),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <Box>Loading...</Box>;

  return (
    <SpaceBetween size="l">
      <Flashbar items={flash} />
      <Header actions={
          <Box float="right">
          <Button variant="primary" loading={loading} onClick={handleUpdate}>Update</Button>
          <Button variant="link" onClick={() => navigate("/app/inventory")}>Cancel</Button>
        </Box>

      }>Edit Multiple-Variant</Header>
    
        {/* Left column: Item Information and Variants */}
        <Box>
        <SpaceBetween size="l">
          <Container header={
            <Header>Category</Header>
          }>
            <Grid  gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
          <Select
                selectedOption={form.category ? { label: form.category, value: form.category } : null}
                onChange={({ detail }) => {
                  handleChange("category", detail.selectedOption.value);
                  handleChange("subCategory", "");
                }}
                options={categoryOptions}
                placeholder="Select a category"
              />
              <Select
                selectedOption={form.subCategory ? { label: form.subCategory, value: form.subCategory } : null}
                onChange={({ detail }) => handleChange("subCategory", detail.selectedOption.value)}
                options={form.category ? subcategoryOptions[form.category] || [] : []}
                placeholder="Select a subcategory"
              />
              </Grid>
          </Container>

          <Container header={<Header>Item Information</Header>}>
            <SpaceBetween size="l">
              <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}> 
                <FormField label="Name">
                  <Input value={form.name} onChange={({ detail }) => handleChange("name", detail.value)} placeholder="Name" />
                </FormField>

                <FormField label="Over All Stock">
                <Grid disableGutters gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}> 

                  <Input
                    type="text"
                    value={overallStock}
                    onChange={({ detail }) => setOverallStock(detail.value)}
                    placeholder="Over All Stock"
                    style={{ minWidth: 0 }}
                  />
               
                  <Select
                    selectedOption={unitOptions.find((u) => u.value === overallStockUnit) || null}
                    onChange={({ detail }) => setOverallStockUnit(detail.selectedOption.value)}
                    options={unitOptions}
                    placeholder="Unit"
                    style={{ minWidth: 80, maxWidth: 120 }}
                  />
                       </Grid>
                </FormField>
           
              </Grid>
          
            <h3>Tags</h3>
                <Box>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {form.tags && form.tags.filter(Boolean).map((tag, idx) => (
                      <span key={idx} style={{ background: "#f3f3f3", borderRadius: 16, paddingLeft: "6px", paddingRight:'6px', fontSize: 13, color: "#333", border: "1px solid #ddd", display: "flex", alignItems: "center" }}>
                        {tag.trim()}
                        <Button iconName="remove" variant="icon" onClick={() => handleRemoveMainTag(idx)} size="small" />
                      </span>
                    ))}
                    <input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleAddMainTag()}
                      placeholder="Add tag"
                      style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid #ccc", fontSize: 13 }}
                    />
                    <Button onClick={handleAddMainTag} iconName="add-plus" size="small" />
                  </div>
                </Box>
            
          <h3>Description</h3>
                <Textarea
                  rows={10}
                  value={form.description}
                  onChange={({ detail }) => handleChange("description", detail.value)}
                  placeholder="Description"
                />
            
              {/* <Container header={<Header>Main Images</Header>}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {form.images && form.images.filter(Boolean).map((img, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img src={img} alt="main" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }} />
                  <Button iconName="remove" variant="icon" onClick={() => handleRemoveMainImage(idx)} style={{ position: "absolute", top: 0, right: 0 }} />
                </div>
              ))}
              <label style={{ display: "inline-block", width: 80, height: 80, border: "1px dashed #aaa", borderRadius: 8, cursor: "pointer", textAlign: "center", lineHeight: "80px", color: "#4A90E2" }}>
                {imageUploading ? "Uploading..." : "+"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files[0] && handleMainImageUpload(e.target.files[0])} />
              </label>
            </div>
            <div style={{ fontSize: "12px", color: "#777", marginTop: "8px" }}>
              Upload up to 5 images. File format: <b>jpeg, png</b>. Recommended size: <b>300×200</b>.
            </div>
          </Container> */}
            </SpaceBetween>
          </Container>
          <Container>
          <Header actions={<Button onClick={handleAddVariant} iconName="add-plus">Add New Variant</Button>}>Variants</Header>
            <Table
          

              columnDefinitions={[
                { 
                  id: 'attribute', 
                  header: 'Attribute Name', 
                  cell: item => (
                    <div style={{ minWidth: 80, maxWidth: 240 }}>
                      <Input 
                        value={item.attribute || ""} 
                        onChange={({ detail }) => handleVariantChange(item.idx, "attribute", detail.value)} 
                      />
                    </div>
                  ) 
                },
                { 
                  id: 'name', 
                  header: 'Name', 
                  cell: item => (
                    <div style={{ minWidth: 120, maxWidth: 240 }}>
                      <Input 
                        value={item.name} 
                        onChange={({ detail }) => handleVariantChange(item.idx, "name", detail.value)} 
                      />
                    </div>
                  ) 
                },
                { id: 'availability', header: 'Availability', cell: item => (
                    <Select
                    expandToViewport
                      selectedOption={
                        item.availability === false
                          ? { label: "Out of Stock", value: false }
                          : { label: "In Stock", value: true }
                      }
                      onChange={({ detail }) => handleVariantChange(item.idx, "availability", detail.selectedOption.value)}
                      options={[
                        { label: "In Stock", value: true },
                        { label: "Out of Stock", value: false },
                      ]}
                      placeholder="Select Availability"
                    />
                  ) },
                { id: 'sellingPrice', header: 'Selling Price', cell: item => (
                  <div style={{ minWidth: 40, maxWidth: 140 }}>

                    <Input type="text" value={item.sellingPrice} onChange={({ detail }) => handleVariantChange(item.idx, "sellingPrice", detail.value)} />
                 </div>
                  ) },
                { id: 'purchasingPrice', header: 'Purchasing Price', cell: item => (
                  <div style={{ minWidth: 40, maxWidth: 140 }}>

                    <Input type="text" value={item.purchasingPrice} onChange={({ detail }) => handleVariantChange(item.idx, "purchasingPrice", detail.value)} />
                 </div>
                  ) },
                { id: 'stockQuantity', header: 'Stock Quantity', cell: item => (
                  <div style={{ minWidth: 200, maxWidth: 240 }}>

                  <Grid disableGutters gridDefinition={[{ colspan: 7 }, { colspan: 5 }]}>


                    <Input type="text" value={item.stockQuantity === 0 ? "" : item.stockQuantity} onChange={({ detail }) => handleVariantChange(item.idx, "stockQuantity", detail.value)} disabled={!!overallStock} />
                    <Select
                    expandToViewport
                      selectedOption={unitOptions.find((u) => u.value === item.units) || null}
                      onChange={({ detail }) => handleVariantChange(item.idx, "units", detail.selectedOption.value)}
                      options={unitOptions}
                      placeholder="Select Unit"
                      disabled={!!overallStock}
                    />
                    </Grid>
                    </div>

                  ) },
              
                { id: 'comparePrice', header: 'Compare Price', cell: item => (
                  <div style={{ minWidth: 40, maxWidth: 240 }}>

                    <Input type="text" value={item.comparePrice} onChange={({ detail }) => handleVariantChange(item.idx, "comparePrice", detail.value)} />
                </div>
                ) },
                { id: 'totalQuantityInB2c', header: 'Total Quantity In B2C', cell: item => (
                  <div style={{ minWidth: 200, maxWidth: 240 }}>

                  <Grid disableGutters gridDefinition={[{ colspan: 7 }, { colspan: 5 }]}>
                  <Input type="text" value={item.totalQuantityInB2c} onChange={({ detail }) => handleVariantChange(item.idx, "totalQuantityInB2c", detail.value)} />
                    <Select
                    expandToViewport
                      selectedOption={unitOptions.find((u) => u.value === item.totalquantityB2cUnit) || null}
                      onChange={({ detail }) => handleVariantChange(item.idx, "totalquantityB2cUnit", detail.selectedOption.value)}
                      options={unitOptions}
                      placeholder="Select Unit"
                    />
                    </Grid> 
                    </div>
                  ) },

                { id: 'expiry', header: 'Expiry Date', cell: item => (
                    <Input
                      type="date"
                      value={item.expiry ? item.expiry.slice(0, 10) : ""}
                      onChange={({ detail }) => handleVariantChange(item.idx, "expiry", detail.value)}
                    />
                  ) },
                { id: 'stockQuantityAlert', header: 'Stock Quantity Alert', cell: item => (
                  <div style={{ minWidth: 50, maxWidth: 100 }}>

                    <Input
                      type="text"
                      value={item.stockQuantityAlert || ""}
                      onChange={({ detail }) => handleVariantChange(item.idx, "stockQuantityAlert", detail.value)}
                    />
                    </div>
                  ) },
                { id: 'images', header: 'Images', cell: item => (
                    <Box margin={{ bottom: "xs" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap",width:"200px" }}>
                        {item.images && item.images.filter(Boolean).map((img, i) => (
                          <div key={i} style={{ position: "relative" }}>
                            <img src={img} alt="variant" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }} />
                            <Button iconName="remove" variant="icon" onClick={() => handleRemoveVariantImage(item.idx, i)} style={{ position: "absolute", top: 0, right: 0 }} />
                          </div>
                        ))}
                        <label style={{ display: "inline-block", width: 40, height: 40, border: "1px dashed #aaa", borderRadius: 8, cursor: "pointer", textAlign: "center", lineHeight: "40px", color: "#4A90E2" }}>
                          {variantImageUploading[item.idx] ? "Uploading..." : "+"}
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files[0] && handleVariantImageUpload(item.idx, e.target.files[0])} />
                        </label>
                      </div>
                      You Can Select Upto 5 images
                    </Box>
                  ) },
                { id: 'actions', header: 'Action', cell: item => (
                    <Button variant="icon" iconName="remove" onClick={() => handleRemoveVariant(item.idx)} />
                  ) },
              ]}
              items={form.variations.map((v, idx) => ({ ...v, idx }))}
              empty={<Box>No variants</Box>}
              variant="embedded"
            />
            </Container>
            </SpaceBetween>
       
        </Box>
        {/* Right column: Images */}
       
     
      <Box float="right">
        <Button variant="primary" loading={loading} onClick={handleUpdate}>Update</Button>
        <Button variant="link" onClick={() => navigate("/app/inventory")}>Cancel</Button>
      </Box>
    </SpaceBetween>
  );
};

export default EditVariantGroup; 