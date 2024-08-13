import * as React from "react";
import {
  ContentLayout,
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
  FormField,
} from "@cloudscape-design/components";
import UploadImage from "../../../../assets/img/UploadImage.png"
import upload2 from "../../../../assets/img/upload2.png";
const AddItem = () => {
  const [selectedOption, setSelectedOption] = React.useState({
    label: "Option 1",
    value: "1",
  });
  const [checked, setChecked] = React.useState(false);
  const [checked1, setChecked1] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <ContentLayout
      defaultPadding
      headerVariant="high-contrast"
      header={
        <Header
          variant="h1"
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Button>Import Product</Button>
              <Button variant="primary" iconName="add-plus">
                Save and Publish
              </Button>
            </div>
          }
        >
          Add Item
        </Header>
      }
    >
      <div style={{ display: "flex", gap: "30px", padding: "10px" }}>
        <div style={{ width: "48vw" }}>
          <Container>
            <ColumnLayout minColumnWidth={45} columns={2} gutter={20}>
              <form onSubmit={(e) => e.preventDefault()}>
                <Form>
                  <SpaceBetween direction="vertical" size="l">
                    <FormField label="Item Name">
                      <Input size="xs" placeholder="Input Item Name" />
                    </FormField>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <div style={{ width: "150px" }}>
                        <FormField label="Category">
                          <Select
                            selectedOption={selectedOption}
                            onChange={({ detail }) =>
                              setSelectedOption(detail.selectedOption)
                            }
                            options={[
                              { label: "Option 1", value: "1" },
                              { label: "Option 2", value: "2" },
                              { label: "Option 3", value: "3" },
                              { label: "Option 4", value: "4" },
                              { label: "Option 5", value: "5" },
                            ]}
                            placeholder="Select Category"
                          />
                        </FormField>
                      </div>
                      <div style={{ width: "160px" }}>
                        <FormField label="Units">
                          <Select
                            selectedOption={selectedOption}
                            onChange={({ detail }) =>
                              setSelectedOption(detail.selectedOption)
                            }
                            options={[
                              { label: "Option 1", value: "1" },
                              { label: "Option 2", value: "2" },
                              { label: "Option 3", value: "3" },
                              { label: "Option 4", value: "4" },
                              { label: "Option 5", value: "5" },
                            ]}
                          />
                        </FormField>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <FormField label="Purchasing Price">
                        <Input
                          size="3xs"
                          placeholder="Input Purchasing Price"
                        />
                      </FormField>
                      <FormField label="Min Selling Price">
                        <Input size="3xs" placeholder="Min Selling Price" />
                      </FormField>
                    </div>
                    <FormField label="Quantity In Stock">
                      <Input
                        size="xs"
                        placeholder="Quantity available in stock"
                      />
                    </FormField>
                    <Toggle
                      onChange={({ detail }) => setChecked(detail.checked)}
                      checked={checked}
                    >
                      Quantity on hand
                    </Toggle>
                    {checked && (
                      <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ width: "200px" }}>
                          <FormField label="Quantity In Stock">
                            <Select
                              selectedOption={selectedOption}
                              onChange={({ detail }) =>
                                setSelectedOption(detail.selectedOption)
                              }
                              options={[
                                { label: "Option 1", value: "1" },
                                { label: "Option 2", value: "2" },
                                { label: "Option 3", value: "3" },
                                { label: "Option 4", value: "4" },
                                { label: "Option 5", value: "5" },
                              ]}
                            />
                          </FormField>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <FormField label="Quantity">
                            <Input size="3xs" placeholder="Enter Quantity" />
                          </FormField>
                          <div style={{ paddingTop: "30px" }}>
                            <Icon name="remove" />
                          </div>
                        </div>
                      </div>
                    )}
                  </SpaceBetween>
                </Form>
              </form>
              <SpaceBetween direction="vertical" size="l">
                <FormField label="Product Description">
                  <Textarea
                    rows={5}
                    onChange={({ detail }) => setValue(detail.value)}
                    value={value}
                  />
                </FormField>
                <Toggle
                  onChange={({ detail }) => setChecked1(detail.checked)}
                  checked1={checked}
                >
                  Add Expiry
                </Toggle>
                <Input />
                <Checkbox
                  onChange={({ detail }) => setChecked(detail.checked)}
                  checked1={checked}
                >
                  Keep me informed when items expire
                </Checkbox>
              </SpaceBetween>
            </ColumnLayout>
          </Container>
        </div>
        <Container>
          <div
            style={{
              padding: "7px",
              width: "20vw",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <img src={UploadImage} alt="upload"></img>
            <span style={{fontSize:"15px"}}>Additional Images</span>
            <div style={{ display: "flex",gap:"20px" }}>
              <div style={{width:"120px", height:"120px"}}>
              <img src={upload2} alt="upload2" width="full" height="full"></img></div>
              <div style={{ border: "1px dashed gray",width:"120px", height:"115px",borderRadius:"8px" }}></div>
            </div>
          </div>
        </Container>
      </div>
    </ContentLayout>
  );
};

export default AddItem;
