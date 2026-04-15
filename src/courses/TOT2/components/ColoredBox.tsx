import React from "react";

function ColoredBox({ text, color }) {
  return (
    <div 
      className="px-5 py-3 text-white text-center rounded" 
      style={{ backgroundColor: color }}
    >
      <h1>{text}</h1>
    </div>
  );
}

export default ColoredBox;
