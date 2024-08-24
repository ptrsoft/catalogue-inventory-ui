import { Box, BreadcrumbGroup, Grid, Icon, Link, TextFilter, Pagination, CollectionPreferences, Popover, Select, Modal, Table, Textarea } from '@cloudscape-design/components';
import React, { useState } from 'react';
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import { useNavigate } from 'react-router-dom';
import { ErrorMessages, ValidationEngine } from 'Utils/helperFunctions';

const useFormState = (initialState) => {
    const [state, setState] = useState(initialState);

    const handleChange = (field) => (event) => {
        const value = event.detail ? event.detail.value || event.detail.selectedOption : event.target.value;
        setState((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return [state, handleChange, setState];
};

const CreateNewAdjustments = () => {
    const [visible, setVisible] = useState(false);
    const [items, setItems] = useState([]);  // State for items in the main table
    const [modalItems] = useState([  // Items in the modal table
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
    ]);
    const [selectedItems, setSelectedItems] = useState([]);  // State for selected items in the modal

    const navigate = useNavigate();
    const handleBackNavigate = () => {
        navigate("/app/inventory/inventory-adjustments");
    };

    const [formState, handleFormChange] = useFormState({
        location: '',
        reason: '',
        description: '',
    });

    const [formErrors, setFormErrors] = useState({});

    const validationRules = {
        location: [
            { type: ValidationEngine.type.MANDATORY, message: "Location is required." },
        ],
        reason: [
            { type: ValidationEngine.type.MANDATORY, message: "Reason is required." },
        ],
        description: [
            { type: ValidationEngine.type.MANDATORY, message: "Description is required." },
        ],
    };

    const validateForm = () => {
        const validationResult = ValidationEngine.validate(validationRules, formState);
        setFormErrors(validationResult);
        return validationResult.isValid;
    };

    const handleSave = () => {
        if (validateForm()) {
            console.log('Form data:', formState);
            navigate("/app/inventory/new-adjustment");
        } else {
            ErrorMessages.error("Please fix the errors before submitting.");
        }
    };

    const handleApplyItems = () => {
        // Append selected items to the main table
        setItems((prevItems) => [...prevItems, ...selectedItems]);
        setVisible(false);  // Close the modal
    };

    // handle input changes from the table inputs 
    const handleInputChange = (id, field, value) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, [field]:  value } : item
        ));
    };

    // dleeting the row from the table
    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };


    const [
        selectedOption,
        setSelectedOption
    ] = React.useState({});

    // temprory states
    const [
        filteringText,
        setFilteringText
    ] = React.useState("");


    const [
        currentPageIndex,
        setCurrentPageIndex
    ] = React.useState(1);

    return (
        <>
            <BreadcrumbGroup
                items={[
                    { text: "Dashboard", href: "/app/dashboard" },
                    { text: "Inventory Adjustments", href: "/app/inventory/inventory-adjustments" },
                    { text: "New Adjustment", href: "#components" },
                ]}
                ariaLabel="Breadcrumbs"
            />
            <div style={{ marginTop: 10 }}>
                <form onSubmit={e => e.preventDefault()}>
                    <Container
                        header={<Header actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button onClick={handleBackNavigate}>Cancel</Button>
                                <Button onClick={handleSave} variant="primary">Save</Button>
                            </SpaceBetween>
                        } variant="h1">New Adjustment</Header>}
                    >
                        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 } , {colspan:12}]}>
                            
                            <FormField label="Adjustment No.">
                                <Input placeholder='SA-001' value='' disabled />
                            </FormField>

                            <FormField
                                label="Location"
                                errorText={formErrors.location?.message}
                            >
                                <Select
                                    placeholder='Select Location'
                                    selectedOption={formState.location}
                                    onChange={handleFormChange('location')}
                                    options={[
                                        { label: 'Cold Storage', value: 'coldstorage' },
                                        { label: 'Atmakur', value: 'atmakur' },
                                        { label: 'Waligunda', value: 'waligunda' },
                                        { label: 'Atmakur-2', value: 'Atmakur2' },
                                    ]}
                                />
                            </FormField>

                            <FormField
                                label="Reason"
                                errorText={formErrors.reason?.message}
                            >
                                <Select
                                    placeholder='Select Reason'
                                    selectedOption={formState.reason}
                                    onChange={handleFormChange('reason')}
                                    options={[
                                        { label: 'Procure', value: 'procure' },
                                        { label: 'Correction', value: 'correction' },
                                        { label: 'Damage', value: 'damage' },
                                    ]}
                                />
                            </FormField>


                            <FormField
                                label="Description"
                                errorText={formErrors.description?.message}
                            >
                                <Textarea
                                    placeholder='Enter description'
                                    value={formState.description}
                                    onChange={handleFormChange('description')}
                                />
                            </FormField>
                        </Grid>
                    </Container>

                    {/* Second Section for Items */}
                    <div style={{ marginTop: 22 }}>
                        <Container header={
                            <Header
                                actions={
                                    <Button onClick={() => setVisible(true)} iconName='add-plus'>Add Items</Button>
                                }
                                variant='h2'>Item Details</Header>
                        }>
                            <Table
                                variant='borderless'
                                columnDefinitions={[
                                    { header: 'Item Code', cell: item => item.code },
                                    {
                                        header: 'Item name', cell: item => <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <img
                                                src={item.images}
                                                alt={item.name}
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    marginRight: "10px",
                                                }}
                                            />
                                            {item.name}
                                        </div>
                                    },
                                    { header: 'Stock on Hand', cell: item => item.stockOnHold },
                                    { header: 
                                        
                                        <span style={{display:"flex" , gap:6 , alignItems:"center", justifyContent:"start"}}>
                CP Price 
                <Popover
      dismissButton={false}
      position="top"
      size="large"
      triggerType="custom"
      content={
      <SpaceBetween>
<strong>Current Purchase Price</strong>
<span>The current purchase price is the latest cost used across all platforms for consistency.</span>
      </SpaceBetween>
      }
    >
     <Icon name='status-info'/>
    </Popover>

          </span>
                                        
                                        , cell: item => item.purchasingPrice },
                                    { header: 
                                        
                                        <span style={{display:"flex" , gap:6 , alignItems:"center", justifyContent:"start"}}>
                AP Price 
                <Popover
      dismissButton={false}
      position="top"
      size="large"
      triggerType="custom"
      content={
      <SpaceBetween>
<strong>Current Purchase Price</strong>
<span>The current purchase price is the latest cost used across all platforms for consistency.</span>
      </SpaceBetween>
      }
    >
     <Icon name='status-info'/>
    </Popover>

          </span>
                                        ,cell: item => <p>Rs 12</p> },
                                    { header: 'Adjust Quantity', cell: item =>
                                    <Input  
                
                                    value={item.quantity}
                                    onChange={({ detail }) => handleInputChange(item.id, 'quantity', detail.value)} 
                                    />
                                
                                
                                },
                                    { header: 
                                        
                                        <span style={{display:"flex" , gap:6 , alignItems:"center", justifyContent:"start"}}>
                AP Price 
                <Popover
      dismissButton={false}
      position="top"
      size="large"
      triggerType="custom"
      content={
      <SpaceBetween>
<strong>Current Purchase Price</strong>
<span>The current purchase price is the latest cost used across all platforms for consistency.</span>
      </SpaceBetween>
      }
    >
     <Icon name='status-info'/>
    </Popover>

          </span>
                                        
                                        
                                        , cell: item =>
                                    <Input
                                        // item.adjustPurchasePrice
                                    value="Rs."

                                    onChange={({ detail }) => handleInputChange(item.id, 'adjustPurchasePrice', detail.value)} 
                                    /> 
                                
                                },
                                    { header: 
                                        
                                        <span style={{display:"flex" , gap:6 , alignItems:"center", justifyContent:"start"}}>
                AS Price 
                <Popover
      dismissButton={false}
      position="top"
      size="large"
      triggerType="custom"
      content={
      <SpaceBetween>
<strong>Current Purchase Price</strong>
<span>The current purchase price is the latest cost used across all platforms for consistency.</span>
      </SpaceBetween>
      }
    >
     <Icon name='status-info'/>
    </Popover>

          </span>
                                        , cell: item => 
                                         <Input
                                        // item.adjustSellingPrice
                                         value="Rs."
                                         onChange={({ detail }) => handleInputChange(item.id, 'adjustSellingPrice', detail.value)} 
                                         /> 
                                        },
                                    { header: 'Action', cell: item =>
                                    <Button variant='icon' iconName='remove'
                                
                                    onClick={() => handleDeleteItem(item.id)}
                                    style={{ cursor: 'pointer' }}
                                    name='remove'/>
                                 },
                                ]} 
                                items={items}  // Display items in the main table
                                loadingText='Loading Items'
                                trackBy='name'
                                empty={
                                    <Box textAlign="center" color="inherit">
                                        <b>No Item</b>
                                        <Box
                                            padding={{ bottom: "s" }}
                                            variant="p"
                                            color="inherit"
                                        >
                                          No Item to display
                                        </Box>
                                        <Button onClick={() => setVisible(true)} iconName="add-plus">
                                            Add Items
                                        </Button>
                                    </Box>
                                }

                            />
                        </Container>
                    </div>
                </form>
            </div>

            {/* Modal for Selecting Items */}
            <Modal
                onDismiss={() => setVisible(false)}
                visible={visible}
                closeAriaLabel="Close modal"
                size="large"

                header={
                    <Header
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button onClick={() => setVisible(false)} >Cancel</Button>
                                <Button variant="primary" onClick={handleApplyItems}>Apply</Button>
                            </SpaceBetween>
                        }
                    >
                        Select Items
                    </Header>
                }
            >
                <Table
                    header={
                        <Header
                            actions={
                                <Pagination
                                    currentPageIndex={currentPageIndex}
                                    onChange={({ detail }) =>
                                        setCurrentPageIndex(detail.currentPageIndex)
                                    }
                                    pagesCount={5}
                                />
                            }
                        >
                            <SpaceBetween direction='horizontal' size='xs'>
                                <div style={{width:"400px"}}>
                                <TextFilter
                                    filteringText={filteringText}
                                    filteringPlaceholder="Placeholder"
                                    filteringAriaLabel="Placeholder"
                                    onChange={({ detail }) =>
                                        setFilteringText(detail.filteringText)
                                    }
                                />
</div>
                                <Select
                                    placeholder='Select Category'
                                    selectedOption={selectedOption}
                                    onChange={({ detail }) =>
                                        setSelectedOption(detail.selectedOption)
                                    }
                                    options={[
                                        { label: "All", value: "all" },
                                        { label: "Fruits", value: "fruits" },
                                        { label: "Vegetables", value: "vegetables" },
                                        { label: "Leafy Vegetables", value: "leafyVegetables" },
                                        { label: "Dairy", value: "dairy" }
                                    ]}
                                />
                            </SpaceBetween>
                        </Header>
                    }
                    variant='borderless'
                    columnDefinitions={[
                        { header: 'Item Code', cell: item => item.code },
                        {
                            header: 'Item name', cell: item => <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={item.images}
                                    alt={item.name}
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        marginRight: "10px",
                                    }}
                                />
                                {item.name}
                            </div>
                        },
                        { header: 'Stock on Hand', cell: item => item.stockOnHold },
                        { header: 'CP Price', cell: item => item.purchasingPrice },
                        { header: 'Minimum Selling Price', cell: item => item.minimumSellingPrice },
                    ]}
                    items={modalItems}
                    selectionType="multi"
                    selectedItems={selectedItems}
                    onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
                    trackBy="id"
                />
            </Modal>
        </>
    );
};

export default CreateNewAdjustments;
