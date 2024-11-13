import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormField,
  Header,
  Input,
  Tiles,
  SpaceBetween,
  Container,
  BreadcrumbGroup,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { checkPincode, updatePincode } from "Redux-Store/Pincode/pincodeThunk";
import { useLocation } from "react-router-dom";

const AddPincode = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.pincode);

  const location = useLocation();
  const { payload } = location.state || {};  // Check if payload is passed
 
  const [pincode, setPincode] = useState(payload ? payload.pincode : "");
  const [deliveryMethod, setDeliveryMethod] = useState(payload ? payload.deliveryType : "same-day");
  const [shifts, setShifts] = useState(payload ? payload.shifts : [{ name: "", slots: [{ start: "", end: "" }] }]);

  const handleAddShift = () => {
    setShifts([...shifts, { name: "", slots: [{ start: "", end: "" }] }]);
  };
 const backtopincodes=()=>{
  navigate(-1)
 }

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

  const handleSavePincode = () => {
    // Prepare the payload, formatting time values to include seconds
    const formattedShifts = shifts.map((shift) => ({
      ...shift,
      slots: shift.slots.map((slot) => ({
        start: slot.start.length === 5 ? `${slot.start}:00` : slot.start, // add seconds if missing
        end: slot.end.length === 5 ? `${slot.end}:00` : slot.end,         // add seconds if missing
      })),
    }));

    const payload = {
      pincode,
      deliveryType: deliveryMethod,
      shifts: formattedShifts,
      active:true
    };

    // If there's a payload, update the existing pincode, otherwise, save as a new pincode
    if (payload.pincode) {
      // If payload exists, dispatch the update action
      dispatch(updatePincode(payload))  // Assuming updatePincode is the correct API call for PUT
        .unwrap()
        .then(() => {
          navigate("/app/inventory/pincodes/viewpincode", { state: { payload } });
        })
        .catch((err) => {
          console.error("Error updating pincode:", err);
        });
    } else {
      // For new pincode, dispatch the save action
      dispatch(checkPincode(payload))  // Assuming checkPincode is the API call for POST
        .unwrap()
        .then(() => {
          navigate("/app/inventory/pincodes/viewpincode", { state: { payload } });
        })
        .catch((err) => {
          console.error("Error saving pincode:", err);
        });
    }
  };

  return (
    <SpaceBetween size="m">
      <BreadcrumbGroup
        items={[
          { text: "Dashboard", href: "/app/dashboard" },
          { text: "Inventory", href: "/app/dashboard" },
          { text: "Pincodes", href: "/app/inventory/pincodes" },
          { text: payload ? "Edit Pincode" : "Add Pincode", href: "#" },  // Update breadcrumb text
        ]}
      />
      <Header
        variant="h1"
        
        actions={
          <SpaceBetween direction="horizontal" size="s">
            <Button variant="normal" onClick={backtopincodes}>Cancel</Button>
            <Button variant="primary" onClick={handleSavePincode} disabled={loading}>
              {loading ? (payload ? "Updating..." : "Saving...") : (payload ? "Update" : "Save")}
            </Button>
          </SpaceBetween>
        }
      >
      {payload ? <span style={{ fontWeight: "bolder" }}>Edit Pincode</span> : <span style={{fontWeight:"bolder"}}>Add Pincode</span>}
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
        <Tiles
          onChange={({ detail }) => setDeliveryMethod(detail.value)}
          value={deliveryMethod}
          items={[
            {
              label: "Same Day Delivery",
              value: "same day",
              description: "Item is delivered on the same day the order is placed.",
            },
            {
              label: "Next Day Delivery",
              value: "next day",
              description: "Item is delivered the following day or according to a booked delivery slot.",
            },
          ]}
        />
      </Container>

      <Container
        header={
          <Header
            variant="h3"
            description="Add multiple shifts in single pincodes"
            actions={
              <Button onClick={handleAddShift} iconName="add-plus" variant="primary">
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
                  <div style={{ width: "400px" }}>
                    <Input
                      placeholder="Add shift"
                      value={shift.name}
                      onChange={(event) => {
                        const updatedShifts = [...shifts];
                        updatedShifts[shiftIndex].name = event.detail.value;
                        setShifts(updatedShifts);
                      }}
                    />
                  </div>
                </FormField>
                <div style={{ marginTop: "25px" }}>
                  <Button onClick={() => handleRemoveShift(shiftIndex)} variant="normal">
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
                      value={slot.start}
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
                      value={slot.end}
                      onChange={(event) => {
                        const updatedShifts = [...shifts];
                        updatedShifts[shiftIndex].slots[slotIndex].end = event.detail.value;
                        setShifts(updatedShifts);
                      }}
                    />
                  </FormField>
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      marginTop: "30px",
                      alignItems: "center",
                    }}
                  >
                    <Button onClick={() => handleAddSlot(shiftIndex)} iconName="add-plus" variant="inline-link">
                      Add
                    </Button>
                    <div
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        color:"#7D8998",
                        fontWeight:"normal",
                        fontSize:"14px"
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

export default AddPincode;
