import React from "react";

function MediumTextBox({ handleChange,value }) {
  return (
    <label className="small-input p-3 border-0 small-input-label d-block w-100">
      <textarea
        className="border-0 bg-transparent border-outline-0 no-scrollbar w-100 p-3 resize-none"
        cols={80}
        rows={5}
        placeholder="Type your answer here..."
        style={{ width: "100%" }}
        value={value}
        onChange={handleChange ? handleChange : () => { }}
      ></textarea>
    </label>
  );
}

export default MediumTextBox;
