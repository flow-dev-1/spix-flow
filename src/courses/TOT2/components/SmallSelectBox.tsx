import React from "react";

function SmallSelectBox({ value, onChange }) {
  const emotions = [
    "Angry",
    "Sad", 
    "Disgusted",
    "Happy",
    "Disappointed",
    "Guilty",
    "Frustrated",
    "Jealous",
    "Hurt",
    "Scared",
    "Anxious",
    "Lonely"
  ];

  return (
    <label className="small-input p-3 border-0 small-input-label">
      <select
        className="border-0 bg-transparent border-outline-0 form-control small-input"
        style={{ 
          maxWidth: "100%", 
          fontSize: "20px",
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
          cursor: "pointer",
          paddingRight: "20px"
        }}
        value={value}
        onChange={onChange}
      >
        <option value="">Select an emotion...</option>
        {emotions.map((emotion) => (
          <option key={emotion} value={emotion}>
            {emotion}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SmallSelectBox;
