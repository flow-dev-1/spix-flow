import React from "react";
import QuestionBox from "../../../../components/QuestionBox";
import SmallTextBox from "../../../../components/SmallTextBox";

function Frame({ data, answers, setAnswers, setErrorMessage }) {
  const { step, question, questions } = data;

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
      <div className="d-flex gap-3 flex-column flex-md-row flex-md-nowrap align-items-start mt-4">
        <h2 className="text-blue fs-1 mb-0 flex-shrink-0 tot-question-text">
          Question:
        </h2>

        <div className="d-flex flex-column flex-grow-1 min-w-0 tot-question-text">
          <h2 className="text-gray fs-1 mb-1">{question} </h2>
        </div>
      </div>
      <div className="p-1 px-md-5">
        {questions.map(({ type }, index) => (
          <React.Fragment key={index}>
            <h2 className="text-gray fs-4 fs-md-1 tot-week-2-question-text mt-3 fw-bold">
              {type}
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
