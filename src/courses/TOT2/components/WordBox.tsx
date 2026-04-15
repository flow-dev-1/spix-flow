import React from "react";

function WordBox({ text }) {
  return (
    <div className="position-relative d-inline-block">
      <svg
        width="100%"
        height="85"
        viewBox="0 0 300 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M299.658 45.0116C301.301 65.584 245.495 72.4302 212.073 83.2098C191.571 89.8224 170.233 93.9683 146.78 94.3197C124.269 94.657 104.61 90.4967 84.8597 85.1159C53.4694 76.564 6.33157 73.5404 0.917997 54.5816C-4.47563 35.6925 33.2102 20.1074 63.1132 8.95728C86.775 0.134325 115.767 0.245443 143.8 1.30399C167.316 2.19195 185.949 8.58949 206.578 14.3746C240.149 23.789 298.004 24.293 299.658 45.0116Z"
          fill="#FDC028"
        />
      </svg>
      <div className="position-absolute top-0 d-flex w-100 h-100 justify-content-center align-items-center">
        <h2 className="mt-3 font-lg text-white">"{text}"</h2>
      </div>
    </div>
  );
}

export default WordBox;
