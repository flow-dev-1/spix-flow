import React from "react";

function ColoredSmallSquaredTextBox({ color, value, onChange }) {
  const customStyle = {
    width: "180px",
    height: "180px",
    fontSize: "18px",
    border: `3px solid ${color}`,
    borderRadius: "50%",
    outline: "none",
    boxShadow: `0 0 10px ${color}`,
    transition: "box-shadow 0.3s ease-in-out",
    textAlign: "center",
    resize: "none",
    lineHeight: "1.5",
    whiteSpace: "normal",
    padding: "20px",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <label className="p-1 border-0">
      <textarea
        className="bg-white form-control no-scrollbar p-5"
        placeholder="Type your answer here"
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
