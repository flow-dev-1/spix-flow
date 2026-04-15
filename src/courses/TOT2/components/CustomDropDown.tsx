import React from "react";

function CustomDropDown({ value, onChange, options = [] }) {
  return (
    <label className="dropdown-small-input p-3 border-0 dropdown-input-label px-5 w-100 d-block">
      <select
        className="border-0 bg-transparent border-outline-0 form-control dropdown-small-input w-100"
        style={{ fontSize: "1.25rem" }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {/* <option value=""> </option> */}
        <option value="" >
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {index+1}. {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default CustomDropDown;
