import React from "react";

function TwoSmallInputs({ input1, input2, onInputChange }) {
  return (
    <div className="bg-white px-4 pt-3 pb-2 rounded">
      {[1, 2].map((num) => (
        <div key={num} className="mb-3">
          <div className="d-flex gap-3 align-items-center label-input-container">
            <p className="input-label">{num}.</p>
            <input
              type="text"
              className="resilience-input bg-white"
              placeholder="Type your action here"
              value={num === 1 ? input1 : input2}
              onChange={(e) => onInputChange(num, e.target.value)}
              style={{
                padding: "8px 12px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TwoSmallInputs;
