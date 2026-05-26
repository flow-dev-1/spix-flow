import React from "react";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";

function CheckboxInput({ options, selectedOptions, onCheckboxChange }) {
  const handleCheckboxClick = (optionId) => {
    const isCurrentlyChecked = selectedOptions[optionId];
    onCheckboxChange(optionId, !isCurrentlyChecked);
  };

  return (
    <div className="bg-white px-4 py-3 rounded">
      {options.map((option, index) => {
        const isChecked = selectedOptions[option.id] || false;

        return (
          <div
            key={option.id}
            className="d-flex gap-3 mb-3 align-items-center"
            onClick={() => handleCheckboxClick(option.id)}
            style={{ cursor: "pointer" }}
          >
            <input
              type="checkbox"
              id={`checkbox-${option.id}`}
              checked={isChecked}
              onChange={() => handleCheckboxClick(option.id)}
              style={{ display: "none" }}
            />
            <img
              src={isChecked ? checkedImage : uncheckedImage}
              alt={`Checkbox ${option.label}`}
              style={{ width: 20, height: 20 }}
            />
            <label
              htmlFor={`checkbox-${option.id}`}
              className="mb-0"
              style={{ cursor: "pointer" }}
            >
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default CheckboxInput;
