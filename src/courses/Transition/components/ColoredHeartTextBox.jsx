import React from "react";

function ColoredHeartTextBox({ handleChange, value, color }) {
  return (
    <label
      className={`colored-heart-input pl-3 border-0 ${color}-colored-small-input-label colored-small-heart-input-label w-75`}
    >
      <textarea
        className=" border-0 bg-transparent border-outline-0 no-scrollbar w-100 resize-none"
        // cols={7}
        rows={2}
        placeholder="Type your answer here..."
        style={{
          maxWidth: "100%",
          minWidth: "20%",
          fontSize: "14px",
          position: "relative",
        }}
        value={value}
        onChange={handleChange}
      ></textarea>
    </label>
  );
}

export default ColoredHeartTextBox;
