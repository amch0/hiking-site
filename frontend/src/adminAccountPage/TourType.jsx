import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

const TourType = ({ onTypeChange, selectedType }) => {
  const handleTypeChange = (value) => {
    console.log("Inside handleTypeChange:", value);
    onTypeChange(value);
  };

  const tourOptions = [
    { value: "BiH", label: "BiH" },
    { value: "Internacionalna", label: "Internacionalna" },
  ];

  return (
    <div className="location">
      <Select
        placeholder="Odaberite tip ture.."
        onSelectionChange={handleTypeChange}
        value={selectedType}
        items={tourOptions}
      >
        {(loc) => <SelectItem key={loc.value}>{loc.label}</SelectItem>}
      </Select>
    </div>
  );
};

export default TourType;
