import React from "react";

function ColoredSmallSquaredTextBox({ color, value, onChange }) {
  const customStyle = {
    maxWidth: "100%",
    width: "180px",
    fontSize: "20px",
    border: `3px solid ${color}`, // Dynamic border color
    outline: `none`, // Remove default outline
    boxShadow: `0 0 10px ${color}`, // Highlight color
    transition: "box-shadow 0.3s ease-in-out", // Smooth transition
  };

  return (
    <label className="p-3 border-0">
      <textarea
        className="bg-white form-control p-2 rounded no-scrollbar resize-none"
        cols={75}
        rows={5}
        placeholder="Type your answer here..."
        style={customStyle}
        value={value}
        onChange={onChange}
        onFocus={
          (e) => (e.target.style.boxShadow = `0 0 15px ${color}`) // Glow effect on focus
        }
        onBlur={
          (e) => (e.target.style.boxShadow = `0 0 10px ${color}`) // Return to initial glow effect on blur
        }
      />
    </label>
  );
}

export default ColoredSmallSquaredTextBox;
