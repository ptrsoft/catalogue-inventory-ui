import { Box, BreadcrumbGroup, Button, Container, Form, FormField, Grid, Header, Icon, Input, Modal, Popover, SpaceBetween, Table, Textarea } from '@cloudscape-design/components'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const NewAdjustment = () => {
    const navigate = useNavigate()

    const [visible, setVisible] = React.useState(false);    
    const items = [
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 1, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%02bj%D6%BF%17%EF%BF%BD%EF%BF%BD0%EF%BF%BDj%EF%BF%BD%EF%BF%BD%27%C2%9CScreenshot%202024-08-17%20213042.png", name: 'Spinitch', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 2, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/t%40%EF%BF%BD%7Fx%EF%BF%BDl%EF%BF%BD%05%5B%EF%BF%BD%3E%13%EF%BF%BD%EF%BF%BD%20Screenshot%202024-08-17%20174200.png", name: 'Apple', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
        { id: 3, code: "#98532", images: "https://prod-promodeargo-admin-api-mediabucket46c59097-tynsj9joexji.s3.us-east-1.amazonaws.com/%EF%BF%BD%0BA%EF%BF%BD5%1B%EF%BF%BDx%EF%BF%BD%EF%BF%BD%7F%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDScreenshot%202024-04-04%20072907.png", name: 'Guava', stockOnHold: "25 kg", purchasingPrice: "Rs. 18", minimumSellingPrice: "Rs. 30" },
    ]

    const handlePrint = () => {
        window.print();
    };

    const cancelNavigate = ()=>{
        navigate("/app/inventory/adjustments")
    }

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
<div style={{marginTop:10}}>
<Form
                    header={<Header actions={
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button  onClick={() => setVisible(true)}  >Cancel Adjustment</Button>
                            {/* <Button onClick={handlePrint} variant="primary">Print</Button> */}
                            <Button onClick={()=>{
                              navigate("/app/inventory/adjustments")
                            }} variant='primary'>Back To Adjustments</Button>
                        </SpaceBetween>
                    } variant="h1">New Adjustment</Header>}
                >
                    <Container>
                        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }, { colspan: 12 }]}>

                            <FormField label="Adjustment No.">
                                <Input  value='SA-001' disabled />
                            </FormField>

                            <FormField label="Location">
                                <Input value='Cold Storage' disabled />
                            </FormField>

                            <FormField label="Reason">
                                <Input value='Procure' disabled />
                            </FormField>

                            <FormField label="Description">
                                <Textarea value='Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste laborum in quasi accusamus voluptatem.' disabled />
                            </FormField>                        
                        </Grid>
                    </Container>

<div style={{marginTop:22}}>
        <Container header={
            <Header variant='h2'>Item Details</Header>
        }>
                        
<Table 
variant='borderless'
        columnDefinitions={[
            { header: 'Item Code',  cell: item => item.code },
            {
                header: 'Item name', cell: item =>  <div
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
            { header: <span style={{display:"flex" , gap:6 , alignItems:"center", justifyContent:"start"}}>
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

          </span>, cell: item => item.purchasingPrice },
            { header: <span style={{display:"flex" , gap:6 , alignItems:"center", justifyContent:"start"}}>CS Price
            
            <Popover
      dismissButton={false}
      position="top"
      size="large"
      triggerType="custom"
      content={
      <SpaceBetween>
<strong>Current Selling Price</strong>
<span>Current Selling Price: the latest price at which an item is sold.</span>
      </SpaceBetween>
      }
    >
     <Icon name='status-info'/>
    </Popover>
            </span>, cell: item =>  <p>Rs 12</p> },
            { header: 'Adjust Quantity', cell: item =>  <p>Rs 12</p>},
            { header: <span style={{display:"flex" , gap:6 , alignItems:"center", justifyContent:"start"}}>AP Price 
            
            <Popover
        dismissButton={false}
        position="top"
        size="large"
        triggerType="custom"
        content={
        <SpaceBetween>
  <strong>Adjust Purchase Price</strong>
  <span>Adjust Purchase Price: Adjust the cost for purchasing items.</span>
        </SpaceBetween>
        }
      >
       <Icon name='status-info'/>
      </Popover>
            </span>, cell: item =>  <p>Rs 12</p> },
            { header: <span style={{display:"flex" , gap:6 , alignItems:"center", justifyContent:"start"}}>AS Price
             <Popover
        dismissButton={false}
        position="top"
        size="large"
        triggerType="custom"
        content={
        <SpaceBetween>
  <strong>Adjust Selling Price</strong>
  <span>Adjust Selling Price: Adjust the price for selling items.</span>
        </SpaceBetween>
        }
      >
       <Icon name='status-info'/>
      </Popover>
            </span>,
            cell: item => <p>Rs 12</p> },
            
        ]}
        items={items}
      />
      </Container>
      </div>    
                </Form>

                </div>





                {/*modal for canceling the adjustmend */}
                <Modal
      onDismiss={() => setVisible(false)}
      visible={visible}
      
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button  onClick={() => setVisible(false)}
            >Not Now</Button>
            <Button variant="primary" onClick={cancelNavigate}>Cancel Adjustment</Button>
          </SpaceBetween>
        </Box>
      }
      header={
        <Header>
            Cancel The Adjustment
        </Header>
      }
    >
        <div>

    Are you sure do you want to cancel the Adjustment
         
        </div>
    </Modal>
  </>
  )
}

export default NewAdjustment