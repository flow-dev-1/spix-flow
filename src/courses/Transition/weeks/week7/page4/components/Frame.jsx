import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import MediumTextBox from "../../../../components/MediumTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, info } = data;

  const handleInputChange = (value) => {
    setErrorMessage("");
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const pageIndex = updatedAnswers.findIndex(
        (answer) => answer.stepId === step
      );

      if (pageIndex !== -1) {
        updatedAnswers[pageIndex] = {
          ...updatedAnswers[pageIndex],
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
      <div className="d-flex gap-2 flex-column flex-md-row">
        <h2 className="text-blue fs-1">Question: </h2>
        <h2 className="text-gray fs-1">{info.question}</h2>
      </div>
      <div className="d-flex flex-column gap-3 justify-content-center">
        <MediumTextBox
          value={answers.find((answer) => answer.stepId === step)?.value || ""}
          handleChange={(e) => handleInputChange(e.target.value)}
        />
      </div>
    </QuestionBox>
  );
}

export default Frame;
