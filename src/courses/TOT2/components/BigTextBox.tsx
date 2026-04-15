import React from "react";

function BigTextBox({ handleChange, value }) {
  return (
    <label className="resilience-small-inpu border-0 small-input-labe d-block w-100">
      <textarea
        className="form-control border-0 bg-white border-outline-0 no-scrollbar w-100 resize-none"
        cols={80}
        rows={6}
        placeholder="Type your answer here..."
        style={{ width: "100%" }}
        value={value}
        onChange={handleChange ? handleChange : () => {}}
      ></textarea>
    </label>
  );
}

export default BigTextBox;
