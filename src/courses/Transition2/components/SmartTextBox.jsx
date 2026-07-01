import React from "react";

function SmartTextBox({ value, onChange, label }) {
  return (
    <label
      className={`small-input py-3 px-5 border-0 transition2-smart-text-box-label ${label}-smart-small-input-label`}
    >
      <input
        className="border-0 bg-transparent border-outline-0 form-control small-input px-5 transition2-smart-text-box-input"
        placeholder="Type your answer here"
        style={{ maxWidth: "100%", fontSize: "20px" }}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}

export default SmartTextBox;
