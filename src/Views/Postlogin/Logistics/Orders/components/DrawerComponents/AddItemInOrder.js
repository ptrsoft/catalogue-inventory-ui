import React, { useEffect, useState } from "react";
import { Table,Modal,Pagination,Input,Select,TextFilter,Box,Button,Header,SpaceBetween } from "@cloudscape-design/components";
import { fetchProducts } from "Redux-Store/Products/ProductThunk";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector

const AddItemInOrder = () => {
      const dispatch = useDispatch();
    

      const [visible, setVisible] = useState(false);
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
    
      const [quantities, setQuantities] = useState({});
      const [selectedItems, setSelectedItems] = useState([]);
      // Handle quantity change
      const handleQuantityChange = (item, value) => {
        setQuantities((prev) => ({
          ...prev,
          [item.id]: value,
        }));
      };
     // Update selected items to include quantity
      const handleApplyItems = () => {
        const updatedSelectedItems = selectedItems.map((item) => ({
          ...item,
          quantity: quantities[item.id] || 0, // Default to 0 if no quantity entered
        }));
    
        console.log("Selected Items with Quantity:", updatedSelectedItems);
    
        // You can now use updatedSelectedItems for further processing
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
    <div>
         {/* Items List */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <Box variant="h5">Items List </Box>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                          variant="inline-link"
                          iconName="add-plus"
                          onClick={() => setVisible(true)}
                        >
                          Add Item
                        </Button>
                      </div>
                    </div>
                    {/* Modal for Selecting Items */}
                    <Modal
                      size="max"
                      onDismiss={() => setVisible(false)}
                      visible={visible}
                      closeAriaLabel="Close modal"
                      // header={<Header>Add Items</Header>}
                      header={
                        <Header
                          actions={
                            <div style={{ marginLeft: "800px" }}>
                              <SpaceBetween direction="horizontal" size="xs">
                                <button
                                  className="cancel-btn"
                                  style={{ borderRadius: "16px" }}
                                  onClick={() => setVisible(false)}
                                >
                                  Cancel
                                </button>
                                <Button
                                  variant="primary"
                                  onClick={handleApplyItems}
                                  disabled={selectedItems.length === 0} // Disable if no item is selected
                                >
                                  Save
                                </Button>
                              </SpaceBetween>
                            </div>
                          }
                        >
                          Add Items
                        </Header>
                      }
                    >
                      <Table
                        pagination={
                          <Pagination
                            currentPageIndex={currentPage}
                            onChange={({ detail }) =>
                              setCurrentPage(detail.currentPageIndex)
                            }
                            pagesCount={pagesCount}
                          />
                        }
                        header={
                          <Header>
                            <SpaceBetween direction="horizontal" size="xs">
                              <div style={{ width: "400px" }}>
                                <TextFilter
                                  filteringText={filteringText}
                                  filteringPlaceholder="Search"
                                  filteringAriaLabel="Filter instances"
                                  onChange={handleSearchChange}
                                />
                              </div>
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
                              <Select
                                disabled={
                                  !selectedCategory || selectedCategory.value === ""
                                } // Disable if no category or "All" is selected
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
                              </div>
                            ),
                          },
        
                          {
                            header: "Price Per Unit ",
                            cell: (item) => item.purchasingPrice,
                          },
                          {
                            header: "Add Quantity",
                            cell: (item) => (
                              <Input
                                type="number"
                                value={quantities[item.id] || ""}
                                onChange={({ detail }) =>
                                  handleQuantityChange(item, detail.value)
                                }
                                disabled={
                                  !selectedItems.some(
                                    (selected) => selected.id === item.id
                                  )
                                }
                                placeholder="Enter quantity"
                              />
                            ),
                          },
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
                          <Box
                            margin={{ vertical: "xs" }}
                            textAlign="center"
                            color="inherit"
                          >
                            <SpaceBetween size="m">
                              <b>No Products</b>
                            </SpaceBetween>
                          </Box>
                        }
                      />
                    </Modal>

    </div>
  )
}

export default AddItemInOrder