import React from "react";
import checkedImage from "@/assets/checkedbox.png";
import uncheckedImage from "@/assets/uncheckedBox.png";

function AssessmentQuestion({
  data,
  currentStep,
  selectedOption,
  onOptionSelect,
}) {
  const { question, options } = data;

  const handleOptionClick = (optionKey) => {
    if (onOptionSelect) {
      onOptionSelect(optionKey);
    }
  };

  return (
    <div className="ms-3 ms-md-5 transition2-assessment-question">
      <form>
        <div className="d-flex gap-2 transition2-assessment-question-title">
          <h3 className="fs-1">{currentStep}.</h3>
          <h3 className="fs-1">{question}</h3>
        </div>
        {options.map((option, index) => {
          const optionKey = Object.keys(option)[0]; // Get key (A, B, C, D)
          const optionText = option[optionKey]; // Get value (the text of the option)
          const isChecked = selectedOption === optionKey;

          return (
            <div
              key={index}
              className="ms-7 ms-md-5 d-flex gap-2 mb-2 align-md-items-center align-content-start transition2-assessment-option"
              onClick={() => handleOptionClick(optionKey)}
              style={{ cursor: "pointer" }}
            >
              <input
                type="radio"
                id={`${currentStep}-${optionKey}`}
                name={`question-${currentStep}`}
                value={optionKey}
                checked={isChecked}
                onChange={() => handleOptionClick(optionKey)}
                style={{ display: "none" }}
              />
              <img
                className="transition2-assessment-option-check"
                src={isChecked ? checkedImage : uncheckedImage}
                alt={`Option ${optionKey}`}
              />
              <label
                htmlFor={`${currentStep}-${optionKey}`}
                style={{ cursor: "pointer" }}
              >
                {`${optionKey}. ${optionText}`}
              </label>
            </div>
          );
        })}
      </form>
    </div>
  );
}

export default AssessmentQuestion;
