import React from "react";

function WhiteStarSmallTextBox({ handleChange, value }) {
  return (
    <label
      className={`white-star-input  border-0 white-star-colored-small-input-label white-colored-small-star-input-label`}
    >
      <textarea
        className=" border-0 bg-transparent border-outline-0 no-scrollbar w-100 resize-none white-star-input fs-6 "
        // cols={10}
        rows={4}
        placeholder="Type here..."
        value={value}
        onChange={handleChange}
      ></textarea>
    </label>
  );
}

export default WhiteStarSmallTextBox;
