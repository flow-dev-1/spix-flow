import React from "react";

function CardBoard({ imgSrc, text }) {
  return (
    <div className="d-flex flex-column align-items-center position-relative flex-basis">
      <img src={imgSrc} className="cardboard-image" />
      <div className="w-75 text-center absolute-center  mb-4">
        <h2 className="">{text}</h2>
      </div>
    </div>
  );
}

export default CardBoard;
