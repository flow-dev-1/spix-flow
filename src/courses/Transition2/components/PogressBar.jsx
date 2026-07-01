import React from "react";

function ProgressBar({
  value,
  handleChange,
  min = 0,
  max = 10,
  step = 1,
  labels = [0, 5, 10],
}) {
  const sliderValue = value ?? (min + max) / 2;
  const progress = ((Number(sliderValue) - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Display percentage above the bar */}
      <div className="text-center mb-5 mt-5">
        <h1 className="text-blue bg-white py-10 px-5 text-2xl rounded d-inline py-4">
          {value ?? ""}
        </h1>
      </div>
      <style>
        {`
                    .custom-range {
                        -webkit-appearance: none;
                        width: 100%;
                        height: 16px;
                        border-radius: 8px;
                        background: linear-gradient(to right, #2563eb 0%, #2563eb ${progress}%, #d1d5db ${progress}%, #d1d5db 100%);
                    }
                    
                    .custom-range::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 28px;
                        height: 28px;
                        background-color: #2563eb;
                        border-radius: 50%;
                        cursor: pointer;
                        border: 2px solid white;
                    }
                    
                    .custom-range::-moz-range-thumb {
                        width: 28px;
                        height: 28px;
                        background-color: #2563eb;
                        border-radius: 50%;
                        cursor: pointer;
                        border: 2px solid white;
                    }
                `}
      </style>

      {/* Progress Bar */}
      <input
        type="range"
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleChange}
        step={step}
        className="custom-range"
        style={{
          "--range-progress": `${progress}%`,
        }}
      />

      <div className="d-flex justify-content-between gap-0 ms-2 align-left-lg-custom w-100">
        {labels.map((label) => (
          <h2 className="text-gray fs-1" key={label}>
            {label}
          </h2>
        ))}
      </div>
      {/* <div className="d-flex justify-content-between gap-0 ms-2 align-left-lg-custom w-100">
        <h2 className="text-black fs-1">Poor</h2>
        <h2 className="text-gray fs-1"></h2>
        <h2 className="text-black fs-1">Great</h2>
      </div> */}
    </div>
  );
}

export default ProgressBar;
