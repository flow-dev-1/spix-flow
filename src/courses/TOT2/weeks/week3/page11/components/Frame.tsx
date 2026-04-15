import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import CustomDropDown from "./CustomDropDown";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, question, options } = data;

  const handleInputChange = (value) => {
    setErrorMessage("");
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const stepIndex = updatedAnswers.findIndex(
        (answer) => answer.stepId === step,
      );

      if (stepIndex !== -1) {
        updatedAnswers[stepIndex] = {
          ...updatedAnswers[stepIndex],
          value: value, // Store single value directly
        };
      } else {
        updatedAnswers.push({
          stepId: step,
          value: value,
        });
      }

      return updatedAnswers;
    });
  };

  return (
    <QuestionBox extraStyle={"bg-custom-blue"}>
      <div className="p-1 p-md-5">
        {step < 7 && (
          <div className="text-center mb-5 mt-4 mt-md-0">
            <h2 className="text-white bg-blue py-2 px-4 fs-2 font-bold rounded-3 d-inline display-4 text-center tot-week-2-question-text">
              Scenario {step - 1}
            </h2>
          </div>
        )}
        <div className="d-flex gap-2 flex-column flex-md-row">
          <h2 className="text-gray fs-3 fs-md-1 tot-week-2-question-text text-center fw-bold">
            {question}
          </h2>
        </div>

        <div className="mt-2">
          <CustomDropDown
            value={
              answers.find((answer) => answer.stepId === step)?.value || ""
            }
            onChange={handleInputChange}
            options={options} // Pass options here
          />
        </div>
      </div>
    </QuestionBox>
  );
}

export default Frame;
