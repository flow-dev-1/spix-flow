import React from "react";

function BigTextBox({ handleChange, value }) {
  return (
    <label className="resilience-small-inpu border-0 small-input-labe">
      <textarea
        className="form-control border-0 bg-white border-outline-0 no-scrollbar w-100 resize-none"
        cols={80}
        rows={6}
        placeholder="Type your answer here..."
        style={{
          maxWidth: "100%",
          // fontSize: "5px",
        }}
        value={value}
        onChange={handleChange ? handleChange : () => {}}
      ></textarea>
    </label>
  );
}

export default BigTextBox;
