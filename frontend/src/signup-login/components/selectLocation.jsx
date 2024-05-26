import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { location } from "../components/location";

const Location = ({ onLocationChange, selectedLocation }) => {
  const handleLocationChange = (value) => {
    console.log("Inside handleLocationChange:", value);
    onLocationChange(value);
  };

  const selectItems = location.map((loc) => ({
    value: loc.value,
    label: loc.label,
  }));

  return (
    <div className="location">
      <Select
        label="Lokacija"
        placeholder="Lokacija"
        onSelectionChange={handleLocationChange}
        value={selectedLocation}
        items={selectItems}
      >
        {(loc) => <SelectItem key={loc.value}>{loc.label}</SelectItem>}
      </Select>
    </div>
  );
};

export default Location;