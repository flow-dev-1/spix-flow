import React from "react";
import QuestionBox from "../../../../components/QuestionBox";

import WhiteStarSmallTextBox from "../../../../components/WhiteStarSmallTextBox";

function SingleWhiteStarFrame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, question } = data;

  const handleInputChange = (value) => {
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
    <QuestionBox>
      <div className="mb-2">
        <div className="d-flex gap-2 justify-content-center flex-column flex-md-row">
          <h2 className="text-blue fs-1">Question:</h2>
          <h2 className="text-gray fs-1">{question}</h2>
        </div>
        <div className="d-flex justify-content-center">
          <WhiteStarSmallTextBox
            value={
              answers.find((answer) => answer.stepId === step)?.value || ""
            }
            handleChange={(e) => handleInputChange(e.target.value)}
          />
        </div>
      </div>
    </QuestionBox>
  );
}

export default SingleWhiteStarFrame;
