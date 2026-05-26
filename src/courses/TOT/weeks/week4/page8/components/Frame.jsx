import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, question } = data;

  const handleInputChange = (index, value) => {
    setErrorMessage("");
    // Update answers state with the new value
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const stepIndex = updatedAnswers.findIndex(
        (answer) => answer.stepId === step
      );

      if (stepIndex !== -1) {
        updatedAnswers[stepIndex] = {
          ...updatedAnswers[stepIndex],
          stepId: step,
          value,
        };
      } else {
        updatedAnswers.push({
          stepId: step,
          value,
        });
      }

      return updatedAnswers;
    });
  };

  return (
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="p-1 p-md-5">
        {/* <div className="text-center mb-5 mt-4 mt-md-0">
          <h2 className="text-white bg-blue py-2 px-4 fs-2 font-bold rounded-3 d-inline display-4 text-center tot-week-2-question-text">
            Scenario {step - 1}
          </h2>
        </div> */}
        <div className="d-flex gap-2 flex-column flex-md-row">
          <h2 className="text-blue fw-bolder fs-4 fs-md-1 tot-week-2-question-text">
            {question}
          </h2>
        </div>
        <BigTextBox
          value={answers.find((answer) => answer.stepId === step)?.value || ""} // Pass the current answer
          handleChange={(e) => handleInputChange(step, e.target.value)} // Handle input change
        />
        {/* <BigTextBox handleChange={handleInputChange} value={myAnswer} /> */}
      </div>
    </QuestionBox>
  );
}

export default Frame;
