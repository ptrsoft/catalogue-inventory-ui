import { Box, BreadcrumbGroup, Button, Container, Form, FormField, Grid, Header, Icon, Input, Modal, Popover, SpaceBetween, Table, Textarea } from '@cloudscape-design/components';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const NewAdjustment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { dataToSave } = location.state || {};

    React.useEffect(() => {
        if (dataToSave) {
            console.log('Received data: from create page', dataToSave);
            // You can use the data here as needed
        }
    }, [dataToSave]);

    const [visible, setVisible] = React.useState(false);

    const items = [
        // Your item data
    ];

    const handlePrint = () => {
        window.print();
    };

    const cancelNavigate = () => {
        navigate("/app/inventory/adjustments");
    };

    const columnDefinitions = [
        // Your column definitions
    ];

    // Function to handle API request
    const sendAdjustmentData = async () => {
        if (!dataToSave) return;

        // Construct the request body
        const requestBody = {
            reason: dataToSave.formData.reason.label,
            description: dataToSave.formData.description,
            location: dataToSave.formData.location.label,
            items: items.map(item => ({
                id: item.id,
                itemCode: item.code,
                name: item.name,
                stock: parseInt(item.stockOnHold.replace(' kg', '')), // Assuming stock is in kg and needs to be a number
                currentCompareAtPrice: parseInt(item.purchasingPrice.replace('Rs. ', '')), // Parsing price
                currentOnlineStorePrice: parseInt(item.purchasingPrice.replace('Rs. ', '')), // Assuming current online store price is same as purchasing price
                adjustQuantity: 0, // Set this value based on your need
                newPurchasingPrice: parseInt(item.purchasingPrice.replace('Rs. ', '')), // Example new price
                newOnlineStorePrice: parseInt(item.purchasingPrice.replace('Rs. ', '')) // Example new price
            }))
        };
        console.log('Request Body:', requestBody);

        try {
            const response = await fetch('https://lou294nkli.execute-api.us-east-1.amazonaws.com/inventory/adjust', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('API response:', result);
                // Handle success
                navigate("/app/inventory/adjustments");
            } else {
                const error = await response.text();
                console.error('API error:', error);
                // Handle error
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Handle fetch error
        }
    };
    return (
        <>
            <BreadcrumbGroup
                items={[
                    { text: "Dashboard", href: "/app/dashboard" },
                    { text: "Inventory Adjustments", href: "#components" },
                    { text: "New Adjustment", href: "#components" },
                ]}
                ariaLabel="Breadcrumbs"
            />
            <div style={{ marginTop: 10 }}>
                <Form
                    header={<Header actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={() => setVisible(true)}>Cancel Adjustment</Button>
                            <Button onClick={() => sendAdjustmentData()} variant='primary'>Submit Adjustment</Button>
                            <Button onClick={() => navigate("/app/inventory/adjustments")} variant='primary'>Back To Adjustments</Button>
                        </SpaceBetween>
                    } variant="h1">New Adjustment</Header>}
                >
                    <Container>
                        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }, { colspan: 12 }]}>
                            <FormField label="Adjustment No.">
                                <Input value='SA-001' disabled />
                            </FormField>

                            <FormField label="Location">
                                <Input value={dataToSave?.formData.location.label} disabled />
                            </FormField>

                            <FormField label="Reason">
                                <Input value={dataToSave?.formData.reason.label} disabled />
                            </FormField>

                            <FormField label="Description">
                                <Textarea value={dataToSave?.formData.description} disabled />
                            </FormField>
                        </Grid>
                    </Container>

                    <div style={{ marginTop: 22 }}>
                        <Container header={
                            <Header variant='h2'>Item Details</Header>
                        }>
                            <Table
                                variant='borderless'
                                columnDefinitions={columnDefinitions}
                                items={items}
                            />
                        </Container>
                    </div>
                </Form>
            </div>

            {/* Modal for canceling the adjustment */}
            <Modal
                onDismiss={() => setVisible(false)}
                visible={visible}
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={() => setVisible(false)}>Not Now</Button>
                            <Button variant="primary" onClick={cancelNavigate}>Cancel Adjustment</Button>
                        </SpaceBetween>
                    </Box>
                }
                header={<Header>Cancel The Adjustment</Header>}
            >
                <div>Are you sure you want to cancel the Adjustment?</div>
            </Modal>
        </>
    );
};

export default NewAdjustment;
