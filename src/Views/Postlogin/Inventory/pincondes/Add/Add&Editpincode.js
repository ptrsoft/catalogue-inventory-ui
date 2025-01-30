import React, { useState, useEffect } from "react";
import {
  Cards,
  Checkbox,
  Box,
  Select,
  Button,
  FormField,
  Header,
  Input,
  Tiles,
  SpaceBetween,
  Container,
  BreadcrumbGroup,
  Flashbar,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { checkPincode, updatePincode } from "Redux-Store/Pincode/pincodeThunk";
import { useLocation } from "react-router-dom";

const AddEditPincode = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.pincode);

  const location = useLocation();
  const { pay } = location.state || {}; // Check if payload is passed
  console.log(pay, "getting pay for eddit");

  const [pincode, setPincode] = useState(pay ? pay.pincode : "");
  // for cards
  const [deliveryTypes, setdeliveryTypes] = useState(
    pay ? pay.deliveryTypes : []
  );

  const [shifts, setShifts] = useState(
    pay ? pay.shifts : [{ name: "", slots: [{ start: "", end: "" }] }]
  );
  const [flashMessages, setFlashMessages] = useState([]);
  const handleAddShift = () => {
    setShifts([...shifts, { name: "", slots: [{ start: "", end: "" }] }]);
  };
  const backtopincodes = () => {
    navigate(-1);
  };

  const handleRemoveShift = (index) => {
    const updatedShifts = shifts.filter((_, i) => i !== index);
    setShifts(updatedShifts);
  };

  const handleAddSlot = (shiftIndex) => {
    const updatedShifts = [...shifts];
    updatedShifts[shiftIndex].slots.push({ start: "", end: "" });
    setShifts(updatedShifts);
  };

  const handleRemoveSlot = (shiftIndex, slotIndex) => {
    const updatedShifts = [...shifts];
    updatedShifts[shiftIndex].slots.splice(slotIndex, 1);
    setShifts(updatedShifts);
  };
  const handleSelectionChange = ({ detail }) => {
    setdeliveryTypes(detail.selectedItems);
  };

  // console.log(shifts,"shiftsss");
  const handleSavePincode = () => {
    // Prepare the payload, formatting time values to include seconds
    const formattedShifts = shifts.map((shift) => ({
      ...shift,
      slots: shift.slots.map((slot) => ({
        start: slot.start, // Original start time
        end: slot.end, // Original end time
        id: slot.id, // Slot ID
        startAmPm: (() => {
          const [startHour] = slot.start.split(":").map(Number); // Extract the hour from start time
          return startHour >= 1 && startHour <= 12 ? "AM" : "PM"; // Determine AM/PM
        })(),
        endAmPm: (() => {
          const [endHour] = slot.end.split(":").map(Number); // Extract the hour from end time
          return endHour >= 1 && endHour <= 12 ? "AM" : "PM"; // Determine AM/PM
        })(),
      })),
    }));

    console.log(formattedShifts, "format");

    const payload = {
      pincode,
      deliveryTypes: deliveryTypes,
      shifts: formattedShifts,
      active: true,
    };
    console.log(payload, "payloadd of add or update pincode");
    const showErrorFlash = (err) => {
      setFlashMessages([
        {
          content: err,
          type: "error",
          dismissible: true,
          onDismiss: () => setFlashMessages([]),
        },
      ]);

      // Close flashbar automatically after 3 seconds
      setTimeout(() => setFlashMessages([]), 3000);
    };

    if (pay) {
      // Update existing pincode
      dispatch(updatePincode(payload))
        .unwrap()
        .then(() => {
          navigate("/app/inventory/pincodes/viewpincode", {
            state: { payload, update: "update" },
            replace: "true",
          });
        })
        .catch((err) => {
          console.error("Error updating pincode:", err);
          showErrorFlash(err);
        });
    } else {
      // Save new pincode
      dispatch(checkPincode(payload))
        .unwrap()
        .then(() => {
          navigate("/app/inventory/pincodes/viewpincode", {
            state: { payload, flash: "save" },
            replace: "true",
          });
        })
        .catch((err) => {
          console.error("Error saving pincode:", err);
          showErrorFlash(err);
        });
    }
  };
  const isFormValid = () => {
    if (!pincode) return false;
    if (!deliveryTypes) return false;
    for (let shift of shifts) {
      if (!shift.name) return false;
      for (let slot of shift.slots) {
        if (!slot.start || !slot.end) return false;
      }
    }
    return true;
  };
  // Function to format the time with leading zero if necessary
const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  const formattedHours = hours.padStart(2, "0"); // Ensure two digits for hour
  return `${formattedHours}:${minutes}`;
};

  // console.log(flashMessages,"flash");
  return (
    <SpaceBetween size="m">
      <BreadcrumbGroup
        items={[
          { text: "Dashboard", href: "/app/dashboard" },
          { text: "Inventory", href: "/app/dashboard" },
          { text: "Pincodes", href: "/app/inventory/pincodes" },
          { text: pay ? "Edit Pincode" : "Add Pincode", href: "#" }, // Update breadcrumb text
        ]}
      />
      {flashMessages.length > 0 && <Flashbar items={flashMessages} />}

      <Header
        variant="h1"
        actions={
          <SpaceBetween direction="horizontal" size="s">
            <Button variant="normal" onClick={backtopincodes}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSavePincode}
              disabled={loading || !isFormValid()}
            >
              {loading
                ? pay
                  ? "Updating..."
                  : "Saving..."
                : pay
                ? "Update"
                : "Save"}
            </Button>
          </SpaceBetween>
        }
      >
        {pay ? (
          <span style={{ fontWeight: "bolder" }}>Edit Pincode</span>
        ) : (
          <span style={{ fontWeight: "bolder" }}>Add Pincode</span>
        )}
        {/* Change header text based on payload existence */}
      </Header>

      {/* {error && <p style={{ color: "red" }}>Error: {error}</p>} */}

      <Container header={<Header variant="h3">Pincode</Header>}>
        <FormField label="Pincode No.">
          <Input
            value={pincode}
            onChange={(event) => setPincode(event.detail.value)}
            placeholder="Type Pincode"
          />
        </FormField>
      </Container>

      <Container header={<Header variant="h3">Select Delivery Type</Header>}>
        <SpaceBetween direction="horizontal" size="s">
          {[
            {
              label: "Same Day Delivery",
              value: "same day",
              description:
                "Item is delivered on the same day the order is placed.",
            },
            {
              label: "Next Day Delivery",
              value: "next day",
              description:
                "Item is delivered the following day or according to a booked delivery slot.",
            },
          ].map((method) => (
            <div
              key={method.value}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px", // space between checkbox label and description
                border: deliveryTypes.includes(method.value)
                  ? "2px solid #0073e6"
                  : "1px solid #ccc",
                padding: "12px",
                borderRadius: "8px",
                width: "100%",
                cursor: "pointer",
                backgroundColor: deliveryTypes.includes(method.value)
                  ? "#f0f8ff"
                  : "#fff",
                transition: "all 0.2s ease-in-out",
              }}
              onClick={() => {
                setdeliveryTypes((prev) =>
                  prev.includes(method.value)
                    ? prev.filter((item) => item !== method.value)
                    : [...prev, method.value]
                );
              }}
            >
              <div style={{ display: "flex", gap: "5px" }}>
                <Checkbox
                  checked={deliveryTypes.includes(method.value)}
                  onChange={() => {}}
                  label={method.label}
                  ariaLabel={method.label}
                  style={{
                    fontWeight: "bold",
                    margin: 0,
                  }}
                />
                <strong>{method.label}</strong>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginLeft: "10px", // indent description slightly for better alignment
                }}
              >
                {method.description}
              </div>
            </div>
          ))}
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h3"
            description="Add multiple shifts in single pincodes"
            actions={
              <Button
                onClick={handleAddShift}
                iconName="add-plus"
                variant="primary"
              >
                Add Shifts
              </Button>
            }
          >
            Add Shifts
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="l">
          {shifts.map((shift, shiftIndex) => (
            <Container key={shiftIndex}>
              <SpaceBetween direction="vertical" size="m">
                <div style={{ display: "flex", gap: "5px" }}>
                  <FormField label="Shift Name">
                    <div style={{ width: "48vw" }}>
                    <Select
  selectedOption={shift.name ? { label: shift.name, value: shift.name } : null} // Only show a selected option if shift.name has a value

  onChange={({ detail }) => {
    const updatedShifts = [...shifts];
    updatedShifts[shiftIndex].name = detail.selectedOption.value;
    setShifts(updatedShifts);
  }}
  options={[
    { label: "Select a shift", value: "", disabled: true }, // Placeholder option with empty value

    { label: "morning", value: "morning" },
    { label: "afternoon", value: "afternoon" },
    { label: "evening", value: "evening" },
    { label: "night", value: "night" }
  ]}
  placeholder="Select a shift" // Placeholder text

/>
                    </div>
                  </FormField>
                  <div style={{ marginTop: "25px" }}>
                    <Button
                      onClick={() => handleRemoveShift(shiftIndex)}
                      variant="normal"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <h3>Add Slot</h3>
                {shift.slots.map((slot, slotIndex) => (
                  <SpaceBetween direction="horizontal" size="s" key={slotIndex}>
                    <FormField label="Start Time">
                    <Input
  type="time"
  value={slot.start ? formatTime(slot.start) : ""}
  onChange={(event) => {
    const updatedShifts = [...shifts];
    updatedShifts[shiftIndex].slots[slotIndex].start = event.detail.value;
    setShifts(updatedShifts);
  }}
/>
                    </FormField>
                    <FormField label="End Time">
                    <Input
                        type="time"
                        value={slot.end ? formatTime(slot.end) : ""}

                        onChange={(event) => {
                          const updatedShifts = [...shifts];
                          updatedShifts[shiftIndex].slots[slotIndex].end =
                            event.detail.value;
                          setShifts(updatedShifts);
                        }}
                      />
                    </FormField>
                    {/* <FormField label="Date">
  <Input value={slot.date ? slot.date : "Auto Generated"} disabled />
</FormField> */}
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        marginTop: "30px",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        onClick={() => handleAddSlot(shiftIndex)}
                        iconName="add-plus"
                        variant="inline-link"
                      >
                        Add
                      </Button>
                      <div
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "#7D8998",
                          fontWeight: "normal",
                          fontSize: "14px",
                        }}
                        onClick={() => handleRemoveSlot(shiftIndex, slotIndex)}
                      >
                        <AiTwotoneDelete />
                        <span color="#7D8998"> Remove</span>
                      </div>
                    </div>
                  </SpaceBetween>
                ))}
              </SpaceBetween>
            </Container>
          ))}
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default AddEditPincode;
