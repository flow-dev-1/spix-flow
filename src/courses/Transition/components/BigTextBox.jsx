import React from "react";

function BigTextBox({ handleChange, value }) {
  return (
    <label className="small-input p-4 border-0 small-input-label">
      <textarea
        className="form-control border-0 bg-transparent border-outline-0 no-scrollbar w-100 resize-none"
        // cols={80}
        // rows={5}
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
