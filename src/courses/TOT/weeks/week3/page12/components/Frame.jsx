import React, { useState } from "react";
import QuestionBox from "../../../../components/QuestionBox";
import SmallTextBox from "./SmallInputTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage, type }) {
  const { step, questions } = data;


  const handleInputChange = (inputType, value) => {
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
          [inputType]: value, // dynamically set property based on input type
        };
      } else {
        updatedAnswers.push({
          stepId: step,
          [inputType]: value,
        });
      }

      return updatedAnswers;
    });
  };

  return (
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="p-1 p-md-5">
        {questions.map(({ type, question }, index) => (
          <React.Fragment key={index}>
            <h2 className="text-gray fw-bold fs-4 fs-md-1 tot-week-2-question-text">
              {question}
            </h2>
            <div className="mx-4">
              <SmallTextBox
                value={
                  answers.find((answer) => answer.stepId === step)?.[type] || ""
                }
                onChange={(e) => handleInputChange(type, e.target.value)}
              />
            </div>
          </React.Fragment>
        ))}
      </div>
    </QuestionBox>
  );
}

export default Frame;
