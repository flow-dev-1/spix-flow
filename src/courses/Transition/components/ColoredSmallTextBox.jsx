import React from "react";

function ColoredSmallTextBox({ color, value, onChange }) {
  return (
    <label className={`colored-small-input p-3 border-0 ${color}-colored-small-input-label`}>
      <input
        className="border-0 bg-transparent form-control colored-small-input"
        placeholder="Type your answer here..."
        style={{ maxWidth: "100%", fontSize: "20px" }}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}

export default ColoredSmallTextBox;
