import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import SmallTextBox from "../../../week3/page10/components/SmallInputTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, questions } = data;

  const handleInputChange = (inputType, value) => {
    setErrorMessage("");
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      const stepIndex = updatedAnswers.findIndex(
        (answer) => answer.id === step
      );

      if (stepIndex !== -1) {
        updatedAnswers[stepIndex] = {
          ...updatedAnswers[stepIndex],
          id: step,
          [inputType]: value,
        };
      } else {
        updatedAnswers.push({
          id: step,
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
            <h2 className="text-gray fs-4 fs-md-1 tot-week-2-question-text mt-3">
              {question}
            </h2>
            <SmallTextBox
              value={answers.find((answer) => answer.id === step)?.[type] || ""}
              onChange={(e) => handleInputChange(type, e.target.value)}
            />
          </React.Fragment>
        ))}
      </div>
    </QuestionBox>
  );
}

export default Frame;
