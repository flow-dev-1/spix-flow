import React from "react";

function SmallTextBox({ value, onChange, disabled }) {
  console.log(value, "Value den");
  return (
    <label className="small-input p-3 border-0 bg-white rounded-2">
      <input
        disabled={disabled}
        className=" border-0 bg-transparent border-outline-0 form-control small-input text-gray"
        placeholder="Type your answer here..."
        style={{ maxWidth: "100%", fontSize: "20px"}}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}

export default SmallTextBox;
