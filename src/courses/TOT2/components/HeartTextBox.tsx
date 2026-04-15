import React from "react";

function HeartTextBox({ handleChange, value }) {
  return (
    <label className="border-0 heart-input-label">
      <textarea
        className="heart-input border-0 bg-transparent border-outline-0 no-scrollbar w-100 resize-none text-center"
        // cols={55}
        // rows={2}
        placeholder="Type your answer here..."
        value={value}
        onChange={handleChange ? handleChange : () => {}}
      ></textarea>
    </label>
  );
}

export default HeartTextBox;
