import React, { useEffect } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";

import maroonCheckBg from "@/assets/maroonCheckBg.png";
import orangeCheckBg from "@/assets/orangeCheckBg.png";
import purpleCheckBg from "@/assets/purpleCheckBg.png";
import greenCheckBg from "@/assets/greenCheckBg.png";

function CheckboxFrame({
  step,
  checkboxAnswers,
  setCheckboxAnswers,
  setErrorMessage,
}) {
  const colorBackgrounds = [
    maroonCheckBg,
    orangeCheckBg,
    purpleCheckBg,
    greenCheckBg,
  ];

  const handleCheckboxChange = (index) => {
    setErrorMessage("");
    setCheckboxAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: !prevAnswers[index],
    }));
  };

  return (
    <QuestionBox>
      <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center">
        <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>
        <div className="d-flex flex-column flex-grow-1 min-w-0">
          <h2 className="text-gray fs-1 mb-2">{step.question}</h2>
        </div>
      </div>

      <div className="container">
        <div className="row mt-md-5 gap-1">
          {step.options?.map((option, index) => (
            <div
              key={index}
              className="col-12 col-md-5 d-flex flex-column align-items-center"
              style={{
                backgroundImage: `url(${
                  colorBackgrounds[index % colorBackgrounds.length]
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center w-100">
                <div style={{ marginRight: "10px" }}>
                  <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={!!checkboxAnswers[index]}
                    onChange={() => handleCheckboxChange(index)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor={`checkbox-${index}`}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        checkboxAnswers[index] ? checkedImage : uncheckedImage
                      }
                      alt={`Checkbox for ${option}`}
                      style={{ width: 40, height: 40 }}
                    />
                  </label>
                </div>

                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "15px",
                    textAlign: "left",
                    flex: 1,
                  }}
                >
                  {option}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </QuestionBox>
  );
}

export default CheckboxFrame;
