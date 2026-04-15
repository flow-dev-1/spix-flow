import React from "react";

function ColoredStarTextBox({ handleChange, value, color }) {
  return (
    <label
      className={`colored-star-input  border-0 ${color}-star-colored-small-input-label colored-small-star-input-label w-100 m-auto`}
    >
      <textarea
        className=" border-0 bg-transparent border-outline-0 no-scrollbar w-50 w-md-70 resize-none colored-star-input text-center"
        cols={7}
        rows={2}
        placeholder="Type your answer here..."
        value={value}
        onChange={handleChange}
      ></textarea>
    </label>
  );
}

export default ColoredStarTextBox;
