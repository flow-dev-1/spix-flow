import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";
import orangeCheckBg from "@/assets/orangeCheckBg.png";
import greenCheckBg from "@/assets/greenCheckBg.png";

function SingleCheckboxFrame({ options, selectedOption, handleSelect }) {
  const colorBackgrounds = [orangeCheckBg, greenCheckBg];
  return (
    <div className="container mt-4">
      <div className="row justify-content-center gap-1 ">
        {options?.map((option, index) => (
          <div
            key={index}
            className="col-12 col-md-6 d-flex align-items-center mb-3"
            style={{
              borderRadius: "10px",
              backgroundImage: `url(${
                colorBackgrounds[index % colorBackgrounds.length]
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              padding: "15px",
              cursor: "pointer",
            }}
            onClick={() => handleSelect(index)}
          >
            <img
              src={selectedOption === index ? checkedImage : uncheckedImage}
              alt="checkbox"
              style={{ width: 35, height: 35, marginRight: "15px" }}
            />
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              {option}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SingleCheckboxFrame;
