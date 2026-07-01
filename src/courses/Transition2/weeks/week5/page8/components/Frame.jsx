import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import BigTextBox from "../../../../components/BigTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, question } = data;

  const handleInputChange = (value) => {
    setErrorMessage("");
    // Update answers state with the new value
    setAnswers((prevAnswers) => {
      const updatedAnswers = Array.isArray(prevAnswers) ? [...prevAnswers] : [];
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
    <QuestionBox extraStyle="bg-custom-blue">
      <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-5 text-center">
        <h2 className="text-blue fs-1 mb-0 flex-shrink-0">Question:</h2>

        <div className="d-flex flex-column flex-grow-1 min-w-0 mb-5">
          <h2 className="text-gray fs-1 mb-2 ">{question}</h2>
        </div>
      </div>
      <BigTextBox
        handleChange={(e) => handleInputChange(e.target.value)}
        value={
          Array.isArray(answers)
            ? answers.find((answer) => answer.stepId === step)?.value || ""
            : ""
        }
      />
    </QuestionBox>
  );
}

export default Frame;
