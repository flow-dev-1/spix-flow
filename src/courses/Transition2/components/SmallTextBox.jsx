import React from "react";

function SmallTextBox({ value, onChange }) {

  return (
    <label className="small-input p-3 border-0 small-input-label">
      <input
        className=" border-0 bg-transparent border-outline-0  form-control small-input"
        placeholder="Type your answer here..."
        style={{ maxWidth: "100%", fontSize: "20px" }}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}

export default SmallTextBox;
